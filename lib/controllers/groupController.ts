import {
    Route,
    Controller,
    Get,
    Tags,
    Body,
    Post,
    Response
} from "tsoa";
import { provideSingleton, inject, provide } from "../common/inversify.config";
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { Group, GroupUser, GroupCreateBody, IGame, IMongoGroup, PersistedGroup, IdPair } from "../models/groupModel";
import { get } from "https";
import { promises } from "fs";
import { ApiError } from "./ErrorHandler";
import { response, results } from "inversify-express-utils";
// import { MessageEmbed } from "discord.js";
import { DiscordController } from "./discordController";
import { IUser } from "models/userModel";

const gameData = require("../gamelist.json");

import logger from "../common/logger";

@Tags("groups")
@Route("api/groups")
@provideSingleton(GroupController)
export class GroupController extends Controller {
    constructor(
        @inject(TYPES.GroupService) private groupService: GroupService,
        @inject(TYPES.UserService) private userService: UserService,
        private discordController: DiscordController,
    ) {
        super();
    }


    @Get()
    public async getGroups(): Promise<Group[]> {
        return await this.groupService.getGroups();
    }
    //groups/2
    @Get("fitting/{available_spots}/{game}")
    public async getFittingGroups(available_spots: number, game: string): Promise<Group[]> {
        return await this.groupService.getFittingGroups(available_spots, game);
    }

    @Get("game")
    public async getGameList(): Promise<IGame[]> {
        return await gameData;
    }

    private async ifExistingGroupsThenThrow(user_id: string) {
        const existingGroups = await this.groupService.getGroupsByUserId(user_id);
        if (existingGroups.length != 0) throw new ApiError({
            message: `The user with the userID: ${user_id} is already in a group.`, statusCode: 404, name: "UserAlreadyInAGroupOnJoinGroupError"
        }
        );
    }

    @Response<ApiError>(404, "Not valid state (user already in group/user not found)")
    @Post("create")
    public async createGroup(@Body() body: GroupCreateBody): Promise<PersistedGroup> {
        // Create a group in the database, and create a Discord server for the specific group
        try {
            const group = body;

            // This is the final result variable (NOTE: This is being changed during this function)
            let result;
            await this.ifExistingGroupsThenThrow(body.users[0])
            // This is for creating the group in the database
            try {
                result = await this.groupService.createGroup(group);
            } catch (error) {
                throw new Error("CreateGroupError: " + error.message);
            }

            // Create Discord Servers (GroupGame, GroupId) => Response: Id's for the servers
            let channels: string[];
            try {
                channels = await this.discordController.handleNewGroupRequest(result._id, result.game);
            } catch (error) {
                throw new Error("CreateGroupError: " + error.message);
            }

            // Store the response Id's to the created group
            try {
                result = await this.groupService.updateGroupDiscordChannels(channels, result._id);
            } catch (error) {
                throw new Error("CreateGroupError: " + error.message);
            }

            // Everything went alright! 
            // Both a mongo group and two Discord groups has been created here.
            // Response is the mongo group.
            return result;
        } catch (error) {
            // Something went wrong, send the errror message!
            throw new ApiError({ message: error.message, statusCode: 404, name: "CreateGroupError" });
        }
    }

    @Post("/join")
    public async joinGroup(@Body() body: GroupUser): Promise<any> {
        // Post request group id and username attributes is stored..
        const group_id: string = body.group_id;
        const user_id: string = body.user_id;

        await this.ifExistingGroupsThenThrow(user_id)
        // Get response from service
        let result: PersistedGroup;
        try {
            // Check if user is in group
            const group = await this.groupService.getGroup(group_id);
            if (group.users.indexOf(user_id) > -1) {
                throw new ApiError({
                    message: `The user with the userID: ${user_id} is already in the group: ${group_id}.`, statusCode: 404, name: "UserAlreadyInAGroupOnJoinGroupError"
                }
                );
            }

            // Check if user_id is a user and user has a discordId
            const user = await this.userService.getUserById(user_id);
            if (user == null) {
                throw new ApiError({
                    message: `The user with the userID: ${user_id} was not found.`, statusCode: 404, name: "UserDoesNotExistOnJoinGroupError"
                });
            } else if (user.discordId === undefined || user.discordId === null) {
                throw new ApiError({
                    message: `The user with the userID: ${user_id} has no discordId.`, statusCode: 404, name: "UserDiscordIdDoesNotExistOnJoinGroupError"
                });
            }


            // Join the group in mongo
            result = await this.groupService.joinGroup(group_id, user_id);

            // Try: Add the user to the Discord channels (This only works if the user is already in the group)
            await this.discordController.joinGroup(user.discordId, group_id);
        } catch (error) {
            throw new ApiError({ message: error.message, statusCode: error.statusCode, name: error.name });
        }

        return result;
    }


    // leaveGroup(req, res) | Get's post data from the route, and processes the post request.
    // Out: Response message from the service.
    @Post("leave")
    public async leaveGroup(@Body() body: GroupUser): Promise<PersistedGroup> {
        // Post request group id and username attributes is stored..
        let group_id: string = body.group_id;
        let user_id: string = body.user_id;

        // Get user discord
        let user: IUser;
        try {
            user = await this.userService.getUserById(user_id);
        } catch (error) {
            throw new Error("user does not have a Discord Id");
        }

        // Get response from service
        let result;
        try {
            result = await this.groupService.leaveGroup(group_id, user_id);
        } catch (error) {
            result = error.message;
        }

        // Check for group removal
        try {
            if (result.users.length < 1) {
                result = await this.removeGroup({ "group_id": group_id });
                console.log("Should be removed: " + group_id);
            }
        } catch (error) {
            result = error.message;
        }

        // Remove user from the Discord channels
        try {
            await this.discordController.leaveGroup(user.discordId, group_id);
        } catch (error) {
            // Do nothing -- This error is not critical
        }


        // Return result
        return result;
    }

    public async changeGroup(user_id: string, group_id: string, old_group_id: string = ""): Promise<PersistedGroup> {
        // Check if user_id is a user and user has a discordId
        const user = await this.userService.getUserById(user_id);
        if (user == null) {
            throw new ApiError({
                message: `The user with the userID: ${user_id} was not found.`, statusCode: 404, name: "UserDoesNotExistOnJoinGroupError"
            });
        } else if (user.discordId === undefined || user.discordId === null) {
            throw new ApiError({
                message: `The user with the userID: ${user_id} has no discordId.`, statusCode: 404, name: "UserDiscordIdDoesNotExistOnJoinGroupError"
            });
        }


        // Join the group in mongo
        try {
            const result = await this.groupService.joinGroup(group_id, user_id);
            await this.discordController.joinGroup(user.discordId, group_id);
            if (old_group_id !== "") {
                await this.leaveGroup({ group_id: old_group_id, user_id: user_id });
            }
            return result;

        } catch (error) {
            throw error();
        }
    }

    @Response<ApiError>(404, "Group not found")
    @Get("{group_id}")
    public async getGroup(group_id: string): Promise<PersistedGroup> {
        const res = await this.groupService.getGroup(group_id);
        logger.info(JSON.stringify(res))
        if (res == null) {
            throw new ApiError({
                message: `The group with the groupID: ${group_id} was not found.`, statusCode: 404, name: "Not found"
            });
        }
        return res;
    }
    @Get("{group_id}/{invite_id}")
    public async verifyInvite(
        group_id: string,
        invite_id: string
    ): Promise<Group> {
        // 1) Check if a group exists with id 'group_id'
        var group = await this.groupService.getGroup(group_id);

        // TODO: Correctly/appropriately handle incorrect group ids
        // What should we send as response? How should we handle it in the frontend?
        if (group == null) {
            throw new ApiError({
                message: "No groups exist with id " + group_id, statusCode: 404, name: "Not found"
            }
            );
        }

        // 2) Check if the 'invite_id' is valid for the group
        // TODO: Correctly/appropriately handle incorrect invite ids
        // Same as above: What do we send, how do we handle it in the frontend?
        if (group.invite_id != invite_id) {
            throw new ApiError({
                message: "Invalid invite id for group with id " + group_id, statusCode: 404, name: "Invalid invite id"
            }
            );
        }

        // The group id is valid and the invite id is correct w.r.t. the group.
        // Send response to frontend to redirect the page to the "join group" url
        // The "join group" controller will handle checks such as is the group full / does the user meet the requirements
        // TODO: Handle in frontend
        return group;
    }

    private isMergeCompatible(fromGroup: Group, toGroup: Group): boolean {
        const newGroupSize = fromGroup.users.length + toGroup.users.length;
        if (toGroup.maxSize < newGroupSize) {
            // logger.info("MS: " + toGroup.maxSize + " - - new GS: " + newGroupSize);
            return false;
        }
        if (fromGroup.game != toGroup.game) {
            // logger.info("Game types not compatible: " + fromGroup.game + "/" + toGroup.game)
            return false;
        } else {
            return true;
        }
    }

    @Post("merge")
    public async mergeTwoGroups(@Body() body: IdPair): Promise<Group> {
        const fromGroup: PersistedGroup = await this.groupService.getGroup(body.fromId);
        const toGroup: PersistedGroup = await this.groupService.getGroup(body.toId);
        const mergeCompatabilty = this.isMergeCompatible(fromGroup, toGroup);
        if (mergeCompatabilty) {

            // leves the group you're in and joins the groups thats been pushed.
            fromGroup.users.forEach(async user => {
                await this.leaveGroup({ group_id: fromGroup._id, user_id: user })
                await this.joinGroup({ group_id: toGroup._id, user_id: user })
            });

            // deletes the group that where ind.
            await this.removeGroup({ group_id: fromGroup._id });

            return toGroup;

        } else {
            throw new ApiError({ message: "Couldn't merge groups", statusCode: 404, name: "CouldNotMergeGroupsError" });
        }
    }

    @Post("update")
    public async updateVisibility(@Body() body: PersistedGroup): Promise<PersistedGroup> {
        return await this.groupService.updateVisibility(body);
    }

    @Post("remove")
    public async removeGroup(@Body() body: { group_id: string }): Promise<Group> {
        let result: Group;


        result = await this.groupService.removeGroup(body.group_id);

        // Delete discord channels
        if (!(await this.discordController.removeChannels(result.discordChannels[0], result.discordChannels[1], body.group_id))) {
            throw new ApiError({ message: "Couldn't remove Discord channels, but the group has been deleted", statusCode: 404, name: "DiscordChannelsCouldNotBeRemovedError" });
        }


        return result;
    }
}
