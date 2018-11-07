import { Response as BEResponse, IResponse, Response } from "../response";
import {
  Route,
  Controller,
  Get,
  Tags,
  Body,
  Post
} from "tsoa";
import { provideSingleton, inject, provide } from "../common/inversify.config";
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { IGroup, IGroupUser, IGroupCreateBody } from "../models/groupModel";
import { get } from "https";
import { promises } from "fs";
import { twoGroups } from "../interfaces/interfaces";
import { ApiError } from "./ErrorHandler";
import { response } from "inversify-express-utils";
import { MessageEmbed } from "discord.js";
import { DiscordController } from "./discordController";
import { IUser } from "models/userModel";

@Tags("groups")
@Route("groups")
@provideSingleton(GroupController)
export class GroupController extends Controller {
  constructor(
    @inject(TYPES.GroupService) private groupService: GroupService,
    @inject(TYPES.UserService) private userService: UserService, 
    private discordController : DiscordController,
    ) {
    super();
  }

  @Get()
  public async getGroups(): Promise<IGroup[]> {
    return await this.groupService.getGroups();
  }
  //groups/2
  @Get("fitting/{group_size}")
  public async getFittingGroups(group_size: number): Promise<IGroup[]> {
    const fittingSize = 5 - group_size;
    return await this.groupService.getFittingGroups(fittingSize);
  }


  @Post()
  public async createGroup(@Body() body: IGroupCreateBody) {
    // Create a group in the database, and create a Discord server for the specific group
		try {
			const group = body;

			// This is the final result variable (NOTE: This is being changed during this function)
			let result;
			
			// This is for creating the group in the database
			try{
				result = await this.groupService.createGroup(group);
			}catch(error){
				throw new Error("CreateGroupError: " + error.message);
			}

		// Create Discord Servers (GroupGame, GroupId) => Response: Id's for the servers
		let channels : string[];
		try {
			channels = await this.discordController.handleNewGroupRequest(result._id, result.game);
		}catch(error){
			throw new Error("CreateGroupError: " + error.message);
		}

		// Store the response Id's to the created group
		try{
			result = await this.groupService.updateGroupDiscordChannels(channels, result._id);
		}catch(error){
			throw new Error("CreateGroupError: " + error.message);
		}

		// Everything went alright! 
		// Both a mongo group and two Discord groups has been created here.
		// Response is the mongo group.
    return result;
	} catch (error) {
		// Something went wrong, send the errror message!
		throw new ApiError({message: error.message, statusCode: 404, name: "CreateGroupError"});
	}
}

  @Post("/join")
	public async joinGroup(@Body() body: IGroupUser): Promise<any> {
		// Post request group id and username attributes is stored..
		const group_id: string = body.group_id;
		const user_id: string = body.user_id;

		// Get response from service
		let result: string;
		try {
			// Check if user is in group
      const group = await this.groupService.getGroup(group_id);
      if (group.users.indexOf(user_id) > -1) {
        throw new ApiError({ 
          message : `The user with the userID: ${user_id} is already in the group: ${group_id}.`, statusCode : 404, name: "UserAlreadyInAGroupOnJoinGroupError"}
        );
      }

      // Check if user_id is a user and user has a discordId
      const user = await this.userService.getUserById(user_id);
      if (user == null) {
        throw new ApiError({ 
          message : `The user with the userID: ${user_id} was not found.`, statusCode : 404, name: "UserDoesNotExistOnJoinGroupError"
        });
      }else if(user.discordId === undefined || user.discordId === null){
        throw new ApiError({
          message : `The user with the userID: ${user_id} has no discordId.`, statusCode : 404, name: "UserDiscordIdDoesNotExistOnJoinGroupError"
        });
      }
    

			// Join the group in mongo
			result = await this.groupService.joinGroup(group_id, user_id);

			// Try: Add the user to the Discord channels (This only works if the user is already in the group)
			await this.discordController.joinGroup(user.discordId, group_id);
		} catch (error) {
			throw new ApiError({message: error.message, statusCode: error.statusCode, name: error.name});
		}

		return result;
  }


  // leaveGroup(req, res) | Get's post data from the route, and processes the post request.
  // Out: Response message from the service.
  @Post("leave")
  public async leaveGroup(@Body() body: IGroupUser): Promise<any> {
    // Post request group id and username attributes is stored..
    let group_id: string = body.group_id;
    let user_id: string = body.user_id;

    // Get user discord
    let user : IUser;
    try{
      user = await this.userService.getUserById(user_id);
    }catch(error){
      throw new Error("user does not have a Discord Id");
    }

    // Get response from service
    let result;
    try {
      result = await this.groupService.leaveGroup(group_id, user_id);
    } catch (error) {
      result = error.message;
    }

    // Remove user from the Discord channels
    try {
      await this.discordController.leaveGroup(user.discordId, group_id);
    }catch(error){
      // Do nothing -- This error is not critical
    }
    

    // Return result
    return result;
  }

  @Get("{group_id}")
  public async getGroup(group_id: string): Promise<IGroup> {
    const res = await this.groupService.getGroup(group_id);
    if (res == null){
      throw new ApiError({ 
        message : `The group with the groupID: ${group_id} was not found.`, statusCode : 404, name: "Not found"}
      );
    }  
    return res;
  }
  @Get("{group_id}/{invite_id}")
  public async verifyInvite(
    group_id: string,
    invite_id: string
  ): Promise<IGroup> {
    // 1) Check if a group exists with id 'group_id'
    var group = await this.groupService.getGroup(group_id);

    // TODO: Correctly/appropriately handle incorrect group ids
    // What should we send as response? How should we handle it in the frontend?
    if (group == null) {
      throw new ApiError({ 
        message : "No groups exist with id " + group_id, statusCode : 404, name: "Not found"}
      );
    }

    // 2) Check if the 'invite_id' is valid for the group
    // TODO: Correctly/appropriately handle incorrect invite ids
    // Same as above: What do we send, how do we handle it in the frontend?
    if (group.invite_id != invite_id) {
      throw new ApiError({ 
        message : "Invalid invite id for group with id " + group_id, statusCode : 404, name: "Invalid invite id"}
      );
    }

    // The group id is valid and the invite id is correct w.r.t. the group.
    // Send response to frontend to redirect the page to the "join group" url
    // The "join group" controller will handle checks such as is the group full / does the user meet the requirements
    // TODO: Handle in frontend
    return group;
  }

  private isMergeCompatible(fromGroup: IGroup, toGroup: IGroup): boolean {
    const newGroupSize = fromGroup.users.length + toGroup.users.length;
    if (toGroup.maxSize >= newGroupSize) {
      return false;
    }
    if (fromGroup.game != toGroup.game) {
      return false;
    } else {
      return true;
    }
  }

  @Post("merge")
  public async mergeTwoGroups(@Body() body: twoGroups): Promise<IGroup> {
    const fromGroup : IGroup = await this.groupService.getGroup(body.from_id);
    const toGroup : IGroup= await this.groupService.getGroup(body.to_id);
    let newGroup : IGroup;
    const mergeCompatabilty = this.isMergeCompatible(fromGroup, toGroup);
    if (mergeCompatabilty) {
      toGroup.users.push(...fromGroup.users);
      newGroup.users = toGroup.users;
      newGroup.game = toGroup.game;
      newGroup.name = toGroup.name;
      newGroup.maxSize = toGroup.maxSize;
      return this.groupService.createGroup(newGroup);
    } else {
      return null;
    }
  }
}