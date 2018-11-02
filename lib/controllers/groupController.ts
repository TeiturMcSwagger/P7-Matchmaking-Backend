import { Response as BEResponse, IResponse } from "../response";
import {
  Route,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Security,
  Query,
  Body,
  Response,
  Tags,
} from "tsoa";
import { provideSingleton, inject, provide } from "../common/inversify.config";
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { Group, IGroupUser } from "../models/groupModel";
import { get } from "https";
import { promises } from "fs";
import { twoGroups } from "../interfaces/interfaces";
import { ApiError } from "./ErrorHandler";
import { response } from "inversify-express-utils";

@Tags("groups")
@Route("groups")
@provideSingleton(GroupController)
export class GroupController extends Controller {
  constructor(
    @inject(TYPES.GroupService) private groupService: GroupService,
    @inject(TYPES.UserService) private userService: UserService
  ) {
    super();
  }

  @Get()
  public async getGroups(): Promise<Group[]> {
    return await this.groupService.getGroups();
  }
  //groups/2
  @Get("fitting/{group_size}")
  public async getFittingGroups(group_size: number): Promise<Group[]> {
    const fittingSize = 5 - group_size;

    return await this.groupService.getFittingGroups(fittingSize);
  }

  @Post("/create")
  public async createGroup(@Body() body: Group) {
    return await this.groupService.createGroup(body);
  }

  @Response<ApiError>(404,"Not valid state (user already in group/user not found)")
  @Post("/join")
  public async joinGroup(@Body() body: IGroupUser): Promise<any> {
    // Post request group id and username attributes is stored..
    const group_id: string = body.group_id;
    const user_id: string = body.user_id;

      // Check if user is in group
      const group = await this.groupService.getGroup(group_id);
      if (group.users.indexOf(user_id) > -1) {
        throw new ApiError({ 
          message : `The user with the userID: ${user_id} is already in the group: ${group_id}.`, statusCode : 404, name: ""}
        );
      }
      // Check if user_id is a user
      const user = await this.userService.getUserById(user_id);
      if (user == null) {
        throw new ApiError({ 
          message : `The user with the userID: ${user_id} was not found.`, statusCode : 404, name: ""}
        );
      }

      return this.groupService.joinGroup(group_id, user_id);
  }

  // leaveGroup(req, res) | Get's post data from the route, and processes the post request.
  // Out: Response message from the service.
  @Post("leave")
  public async leaveGroup(@Body() body: IGroupUser): Promise<any> {
    // Post request group id and username attributes is stored..
    let group_id: string = body.group_id;
    let user_id: string = body.user_id;

    // Get response from service
    return await this.groupService.leaveGroup(group_id, user_id);
  }

  @Response<ApiError>(404,"Group not found")
  @Get("{group_id}")
  public async getGroup(group_id: string): Promise<Group> {
    const res = await this.groupService.getGroup(group_id);
    if (res == null){
      throw new ApiError({ 
        message : `The grou with the groupID: ${group_id} was not found.`, statusCode : 404, name: "Not found"}
      );
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

  private isMergeCompatible(fromGroup: Group, toGroup: Group): boolean {
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
  public async mergeTwoGroups(@Body() body: twoGroups): Promise<Group> {
    const fromGroup = await this.groupService.getGroup(body.from_id);
    const toGroup = await this.groupService.getGroup(body.to_id);
    const newGroup = new Group();
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
