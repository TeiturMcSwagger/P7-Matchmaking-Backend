import { Client, Guild, Message, GuildMember, Channel, CategoryChannel, TextChannel, VoiceChannel, Role, RoleData } from "discord.js";
import { text } from "body-parser";
import { injectable, inject } from "inversify";
import { TYPES, UserService, GroupService } from "../services/interfaces";

export class DiscordController {
    private client: Client;
    private guild: Guild;

    constructor(@inject(TYPES.UserService) private userService : UserService, @inject(TYPES.GroupService) private groupService : GroupService) {
        this.client = new Client();

        this.initMessageEvents();
    }

    private initMessageEvents() {
        this.client.login(process.env.DISCORDTOKEN);

        this.client.on("message", (message: Message) => {
            // Handle messages, posted to any Discord channel (We can add filters and text commands here)
        });

        this.client.on("guildMemberAdd", async (member) => {
            // When a new user joins the Discord server
            const username = member.user.username;
            const discriminator = member.user.discriminator;
            const discordId = username + "#" + discriminator;

            // Check whether the user should be added to something or not
            try{
                // Check if there is a user with this id
                console.log(this.userService);
                const user = await this.userService.getUserByDiscordId(discordId);
                console.log(user);

                if(!user){
                    throw new Error("User does not exist, please create a user");
                }

                // Check if there is a group with this user groupId
                const groups = await this.groupService.getGroups();
                const userGroup = groups.find((group) => group.users.find((user) => user.discordId === discordId));

                if(!userGroup){
                    throw new Error("You are not in a group, please join one");
                }

                await this.joinGroup(discordId, userGroup._id);
            }catch(error){
                member.sendMessage("Hello! \nPlease join a group on the matchmaking platform, in order to join a channel! \nThank you /xoxo");
                console.log("Catch: " + error.message);
            }
        });
    }

    async initBot(token): Promise<Guild> {
        let guild: Guild;

        // Establish connection to the Discord bot server
        try {
            // Try: Log the bot in to the server
            await this.client.login(token);

            // Set the "guild" (This is the server attribute)
            guild = this.client.guilds.first();
        } catch (error) {
            throw new Error("DiscordBotLoginError: " + error.message);
        }

        return guild;
    }

    public async joinGroup(discordId: string, groupId: string): Promise<Object> {
        /*  Settings:
            console.log(message.member.user.username);
            console.log(message.author.discriminator);
        */
        const guild: Guild = await this.initBot(process.env.DISCORDTOKEN);

        let member : GuildMember;
        try {
            // Try and find the user as a member in Discord
            try{
                const profile : string[] = discordId.split("#");
                const username : string = profile[0];
                const discriminator : string = profile[1];

                member = await guild.members.find((member) => username === member.user.username && discriminator === member.user.discriminator);   
            }catch(error){
                throw new Error("Member does not exist");
            }

            // Try and add the user to the role
            try{
                let role : Role = guild.roles.find((role) => role.name === groupId);

                await member.addRole(role); 
            }catch(error){
                throw new Error(error.message);
            }
        } catch (error) {
            return {"message": error.message}
        }

        return {"message": "discord user joined group"};
    }

    // Register new group role and channel
    public async handleNewGroupRequest(groupId: string, gameTitle: string): Promise<string[]> {
        const guild: Guild = await this.initBot(process.env.DISCORDTOKEN);

        // Create a role
        let role: Role;
        try {
            role = await this.createRole(groupId, guild);
        } catch (error) {
            throw new Error("CreateRoleError: " + error.message);
        }

        // Create both a voice and a text channel for this group
        let channelIds: string[];
        try {
            channelIds = await this.createGroupChannels(gameTitle, role, guild);
        } catch (error) {
            throw new Error("DiscordChannelCreationError: " + error.message);
        }

        // Return the id's of the newly created channel
        return channelIds;
    }

    private createRole(groupId: string, guild: Guild): Promise<Role> {
        let role: Promise<Role>;

        try {
            role = guild.createRole({
                name: groupId,
                color: "Red",
                mentionable: true,
                permissions: 0
            });
        } catch (error) {
            throw new Error("Couldn't create a role");
        }

        return role;
    }

    private async createGroupChannels(gameTitle: string, role: Role, guild: Guild): Promise<string[]> {
        // Create voice and text channel
        let result: string[];

        // Try and create a textChannel
        try {
            // Specify textChannel
            let textChannel: CategoryChannel | TextChannel | VoiceChannel = await guild.createChannel(gameTitle + ":TEXT", "text");

            // Permissions for @everyone
            textChannel.overwritePermissions(guild.id, {
                VIEW_CHANNEL: false,
            });

            // Role/Group specific groups
            textChannel.overwritePermissions(role.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                READ_MESSAGES: true,
                SEND_TTS_MESSAGES: true
            });

            // Specify voiceChannel
            let voiceChannel: CategoryChannel | TextChannel | VoiceChannel = await guild.createChannel(gameTitle + ":VOICE", "voice");

            // Permissions for @everyone
            voiceChannel.overwritePermissions(guild.id, {
                VIEW_CHANNEL: false
            });

            // Role/Group specific groups
            voiceChannel.overwritePermissions(role.id, {
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true
            });

            result = [textChannel.id, voiceChannel.id];
        } catch (error) {
            throw new Error("Couldn't create channels");
        }

        // Return the result of the creation of servers
        return result;
    }
}