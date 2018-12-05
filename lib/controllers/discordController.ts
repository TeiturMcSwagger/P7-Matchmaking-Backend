import { Client, Guild, Message, GuildMember, CategoryChannel, TextChannel, VoiceChannel, Role, Channel, GuildChannel } from "discord.js";
import { inject } from "inversify";
import { TYPES, UserService, GroupService } from "../services/interfaces";
import { provideSingleton } from "../common/inversify.config";
import { Group, PersistedGroup } from "models/groupModel";
import { IUser } from "models/userModel";
import { text } from "body-parser";

@provideSingleton(DiscordController)
export class DiscordController {
    private client: Client;
    private guild : Guild;

    constructor(@inject(TYPES.UserService) private userService : UserService, @inject(TYPES.GroupService) private groupService : GroupService) {
        this.client = new Client();

        this.initBot(process.env.DISCORDTOKEN);

        this.initMessageEvents();
    }

    async initBot(token): Promise<void> {
        // Establish connection to the Discord bot server
        try {
            // Try: Log the bot in to the server
            await this.client.login(token);

            // Set the "guild" (This is the server attribute)
            this.guild = this.client.guilds.first();
        } catch (error) {
            throw new Error("DiscordBotLoginError: " + error.message);
        }
    }

    private initMessageEvents() {
        this.client.on("message", (message: Message) => {
            // Handle messages, posted to any Discord channel (We can add filters and text commands here)
            // if(message.content === "!rolecheck") {
            //     let role : Role = message.guild.roles.find((role : Role) => role.name === "5be2a19c051a4d42f4eb3dc0");
            //     message.channel.send("Role: " + role.name);            
            // }
        });


        this.client.on("guildMemberRemove", async (member : GuildMember) => {
            // When a member leaves the server, reset his roles
            try{
                await member.setRoles([]);
            }catch(error){
            }
        });

        this.client.on("guildMemberAdd", async (member : GuildMember) => {
            // When a new user joins the Discord server
            const username : string = member.user.username;
            const discriminator : string = member.user.discriminator;
            const discordId : string = username + "#" + discriminator;

            // Check whether the user should be added to something or not
            try{
                // Check if there is a user with this id
                const user : IUser = await this.userService.getUserByDiscordId(discordId);

                // Check if the discord member exist as a user
                if(!user){
                    throw new Error("User does not exist, please create a user");
                }

                // Get all the groups the user has joined
                const userGroups : PersistedGroup[] = await this.groupService.getGroupsByUserId(user._id);

                // Check if the user is in any groups!
                if(userGroups.length < 1){
                    throw new Error("You are not in a group, please join one");                
                }

                // Add user to all the groups that has discord channels!
                await userGroups.forEach((group : PersistedGroup) => {
                    // If the group has discord channels
                    if(group.discordChannels.length > 0){
                        this.joinGroup(discordId, group._id);
                    }
                });
            }catch(error){
                // If something went wrong, say to the member, that they must join a group on the platform.
                member.send("Hello! \nPlease join a group on the matchmaking platform, in order to join a channel! \nThank you \n/xoxo");
            }
        });
    }

    public async removeChannels(textchannel_id : string, voicechannel_id : string, group_id : string) : Promise<boolean>{
        
        let result : boolean;
        try{
            const textchannel : GuildChannel = this.guild.channels.get(textchannel_id);
            const voicechannel : GuildChannel = this.guild.channels.get(voicechannel_id);
            
            // Delete the channels
            await textchannel.delete();
            await voicechannel.delete();

            // Delete the roles
            await this.guild.roles.find((role : Role) => role.name === group_id).delete();

            // If success, we can say true
            result = true;
        }catch(error){
            result = false;
        }

        return result;
    }

    public async leaveGroup(discordId: string, groupId: string): Promise<Object> {
        try{
            // Find the member on the server
            const profile : string[] = discordId.split("#");
            const username : string = profile[0];
            const discriminator : string = profile[1];

            // Check if the user on the server
            const member = await this.guild.members.find((member : GuildMember) => username === member.user.username && discriminator === member.user.discriminator);   
            
            // Check if member exist
            if(member === undefined || member === null){
                throw new Error("Discord user not found: " + discordId);
            }

            // Find the role for removal
            const role : Role = await this.guild.roles.find((role : Role) => role.name === groupId.toString());
            
            if(role === undefined || role === null){
                throw new Error("Role not found");
            }

            member.removeRole(role);
        }catch(error){
            console.log(error.message);
            return {"message": error.message};
        }
        return {"message": "Member was kicked"};
    }

    public async joinGroup(discordId: string, groupId: string): Promise<Object> {
        let member : GuildMember;
        // Try and find the user as a member in Discord
        try{
            const profile : string[] = discordId.split("#");
            const username : string = profile[0];
            const discriminator : string = profile[1];

            // Check if the user on the server
            member = await this.guild.members.find((member : GuildMember) => username === member.user.username && discriminator === member.user.discriminator);   
            
            // Check if member exist
            if(member === undefined){
                throw new Error("Discord user not found");
            }

            // Try and add the user to the role
            const role : Role = await this.guild.roles.find((role : Role) => role.name === groupId.toString());

            if(role === undefined){
                throw new Error("Role could not be found! (Does the group exist?)");
            }

            // Finally add the role to the member.
            await member.addRole(role); 
    } catch (error) {
        console.log(error.message);
        return {"message": error.message}
    }

    return {"message": "discord user joined group"};
}

    // Register new group role and channel
    public async handleNewGroupRequest(groupId: string, gameTitle: string): Promise<string[]> {
        // Create a role
        let role: Role;
        try {
            role = await this.createRole(groupId, this.guild);
        } catch (error) {
            throw new Error("CreateRoleError: " + error.message);
        }

        // Create both a voice and a text channel for this group
        let channelIds: string[];
        try {
            channelIds = await this.createGroupChannels(gameTitle, role, this.guild);
        } catch (error) {
            throw new Error("DiscordChannelCreationError: " + error.message);
        }

        // Return the id's of the newly created channel
        return channelIds;
    }

    // Creates a role, based on the group, that needs a new channel
    private createRole(groupId: string, guild: Guild): Promise<Role> {
        let role: Promise<Role>;

        // Try: Create the role, with the right permissions
        try {
            role = guild.createRole({
                name: groupId,
                color: "Red",
                mentionable: true,
                permissions: 104126528
            });
        } catch (error) {
            throw new Error("Couldn't create a role");
        }

        // Return this role
        return role;
    }

    // Don't worry too much about this... Just specifications and creation of discord channels.
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

            // The result is both the textchannel and voicechannel id's
            result = [textChannel.id, voiceChannel.id];
        } catch (error) {
            throw new Error("Couldn't create channels");
        }

        // Return the result of the creation of servers
        return result;
    }
}

