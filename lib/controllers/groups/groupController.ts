import { Response as BEResponse } from "../../response/response";
import { Request, Response } from "express";
import {
	interfaces,
	controller,
	httpGet,
	httpPost,
	httpDelete,
	request,
	queryParam,
	response,
	requestParam
} from "inversify-express-utils";
import { injectable, inject } from "inversify";
import { GroupService, TYPES, UserService } from "../../services/interfaces";
import { DiscordController } from "../discordController";

@controller("/groups")
export class GroupController implements interfaces.Controller {
	private discordController : DiscordController;

	constructor(@inject(TYPES.GroupService) private groupService: GroupService, @inject(TYPES.UserService) private userService: UserService) {
		this.discordController = new DiscordController();
	}	

	@httpGet("/")
	public async getGroups(req: Request, res: Response) {
		res.json(await this.groupService.getGroups());
	}

	@httpPost("/")
	public async createGroup(req: Request, res: Response) {
		// Create a group in the database, and create a Discord server for the specific group
		try {
			const group = req.body;

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
			res.json(result);
		} catch (error) {
			// Something went wrong, send the errror message!
			res.json({message: error.message});
		}
	}

	@httpPost("/join")
	public async joinGroup(req: Request, res: Response): Promise<void> {
		// Post request group id and username attributes is stored..
		const group_id: string = req.body.group_id;
		const user_id: string = req.body.user_id;

		// Get response from service
		let result: string;
		try {
			// Check if the user is already in the group
			const group = await this.groupService.getGroup(group_id);

			if(group.users.find(user => user===user_id)){
				throw new Error("user already exists");
			}

			// Get user discord
			const user = await this.userService.getUserById(user_id);
			if(!user.discordId){
				throw new Error("user does not have a Discord Id");
			}

			// Join the group in mong
			result = await this.groupService.joinGroup(group_id, user_id);

			// Try: Add the user to the Discord channels (This only works if the user is already in the group)
			await this.discordController.joinGroup(user.discordId, group_id);
		} catch (error) {
			result = error.message;
		}

		res.json(result);
	}

	// leaveGroup(req, res) | Get's post data from the route, and processes the post request.
	// Out: Response message from the service. 
	@httpPost("/leave")
	public async leaveGroup(req: Request, res: Response): Promise<void> {

		// Post request group id and username attributes is stored..
		let group_id: string = req.body.group_id;
		let user_id: string = req.body.user_id;

		// Get response from service
		let result;
		try {
			result = await this.groupService.leaveGroup(group_id, user_id);
		} catch (error) {
			result = error.message;
		}
		// Return result
		res.json(result);
	}

	@httpGet("/:group_id")
	public async getGroup(req: Request, res: Response) {
		var group = await this.groupService.getGroup(req.params.group_id);
		var response = new BEResponse(group);

		// Invalid group id
		if (group == null) {
			response.error = "No group exists with group id " + req.params.group_id;
			response.statuscode = 1;
		}

		// Return group obj (null if group_id does not correspond to a group in the DB)
		res.send(response);
	}
	@httpGet("/:group_id/:invite_id")
	public async verifyInvite(req: Request, res: Response) {
		// 1) Check if a group exists with id 'group_id'
		var group = await this.groupService.getGroup(req.params.group_id);
		var response = new BEResponse(group);

		// TODO: Correctly/appropriately handle incorrect group ids
		// What should we send as response? How should we handle it in the frontend?
		if (group == null) {
			response.error = "No groups exist with id " + req.params.group_id;
			response.statuscode = 1;
			res.send(response);
		}

		// 2) Check if the 'invite_id' is valid for the group
		// TODO: Correctly/appropriately handle incorrect invite ids
		// Same as above: What do we send, how do we handle it in the frontend?
		if (group.invite_id != req.params.invite_id) {
			response.error =
				"Invalid invite id for group with id " + req.params.group_id;
			response.statuscode = 2;
			res.send(response);
		}
		response.error = "Joined group";
		response.data = group;

		// The group id is valid and the invite id is correct w.r.t. the group.
		// Send response to frontend to redirect the page to the "join group" url
		// The "join group" controller will handle checks such as is the group full / does the user meet the requirements
		// TODO: Handle in frontend
		res.send(response);
	}
}
