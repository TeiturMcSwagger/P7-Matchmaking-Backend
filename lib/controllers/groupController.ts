import { Response as BEResponse } from "../common/response";
import { Request, Response } from "express";
import {ErrorCodes} from '../common/errors';
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
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { IGroup } from "models/groupModel";
import { Error } from "mongoose";

@controller("/groups")
export class GroupController implements interfaces.Controller {
    constructor(@inject(TYPES.GroupService) private groupService: GroupService,
        @inject(TYPES.UserService) private userService: UserService) { }

    @httpGet("/")
    public async getGroups(req: Request, res: Response) : Promise<void> {
        const result = await this.groupService.getGroups();
        let response : BEResponse<IGroup[]> = new BEResponse<IGroup[]>(result.result);

        if (result.result == null) {
            response.statuscode = ErrorCodes.NoGroupsExist; 
            response.error = result.exception;
        }

        res.json(response);
    }

    @httpPost("/")
    public async createGroup(req: Request, res: Response): Promise<void> {
        const result = await this.groupService.createGroup(req.body);
        let response : BEResponse<IGroup> = new BEResponse<IGroup>(result.result);

        if (response.data === null) {
            response.statuscode = ErrorCodes.ErrorCreatingGroup;
            response.error = result.exception;
        }

        res.json(response);
    }

    @httpPost("/join")
    public async joinGroup(req: Request, res: Response): Promise<void> {
        // Post request group id and username attributes is stored..
        const group_id: string = req.body.group_id;
        const user_id: string = req.body.user_id;
        
        let response : BEResponse<IGroup> = new BEResponse(null);

        // Do checks for the group
        const group =  await this.groupService.getGroup(group_id);

        // Does a group exist with _id == group_id ?
        if(group.result === null){         
            response.statuscode === ErrorCodes.NoGroupsExist;
            response.error = group.exception;
            res.json(response);
            return;
        }

        // Is the user already in this group ?
        if (group.result.users.indexOf(user_id) > -1) {
            response.statuscode = ErrorCodes.UserAlreadyInThisGroup;
            response.error = group.exception;
            res.json(response);
            return;
        }

        // Do checks for the user
        const user = await this.userService.getUserById(user_id);
        if (user.result === null) {
            response.statuscode = ErrorCodes.InvalidUserID;
            response.error = user.exception;
            res.json(response);
            return;
        }

        /* 
        TODO:
        Check if the user complies with the group filters/requirements
        */

        // Finally, try to let the user join the group
        const joinGroup = await this.groupService.joinGroup(group_id, user_id);
        if(joinGroup.result === null){
            response.statuscode = ErrorCodes.UnknownError;
            response.error = joinGroup.exception;
            res.json(response);
            return;
        }

        response.data = joinGroup.result;

        res.json(response);
    }

    // leaveGroup(req, res) | Get's post data from the route, and processes the post request.
    // Out: Response message from the service. 
    @httpPost("/leave")
    public async leaveGroup(req: Request, res: Response) : Promise<void> {
        // Post request group id and username attributes is stored..
        let group_id: string = req.body.group_id;
        let user_id: string = req.body.user_id;
        
        const group = await this.groupService.leaveGroup(group_id, user_id);
        let response : BEResponse<IGroup> = new BEResponse<IGroup>(group.result);

        // Invalid group id
        if (group.result === null) {
            response.statuscode = ErrorCodes.InvalidGroupID;
            response.error = group.exception;
        }

        // Return result
        res.json(response);
    }

    @httpGet("/:group_id")
    public async getGroup(req: Request, res: Response) : Promise<void> {
        const group = await this.groupService.getGroup(req.params.group_id);
        let response : BEResponse<IGroup> = new BEResponse<IGroup>(group.result);

        // Invalid group id
        if (group.result === null) {
            response.statuscode = ErrorCodes.InvalidGroupID;
            response.error = group.exception;
        }

        // Return group obj (null if group_id does not correspond to a group in the DB)
        res.json(response);
    }

    @httpGet("/:group_id/:invite_id")
    public async verifyInvite(req: Request, res: Response) : Promise<void> {
        // 1) Check if a group exists with id 'group_id'
        const group = await this.groupService.getGroup(req.params.group_id);
        let response : BEResponse<IGroup> = new BEResponse<IGroup>(group.result);

        if (group.result === null) {
            response.statuscode = ErrorCodes.InvalidGroupID;
            response.error = group.exception;
            res.json(response);
            return;
        }

        // 2) Check if the 'invite_id' is valid for the group
        if (group.result.invite_id !== req.params.invite_id) {
            response.statuscode = ErrorCodes.InvalidInviteID;
            response.error = group.exception;
            res.json(response);
            return;
        }
    
        // The group id is valid and the invite id is correct w.r.t. the group.
        // Send response to frontend to redirect the page to the "join group" url
        // The "join group" controller will handle checks such as is the group full / does the user meet the requirements
        // TODO: Handle in frontend
        res.json(response);
    }
}
