import {Response as BEResponse} from "../../response/response";

import {Request, Response} from "express";

import {GroupService} from "../../services/group/groupService";

export class GroupController {
    public async getGroups(req : Request, res : Response) 
    {
        const groupService = new GroupService();
        res.json(await groupService.getGroups());
    }

    public async createGroup(req : Request, res : Response) : Promise<void>{
        const groupService = new GroupService();

        res.json(groupService.createGroup(req.body));
    }

    public async joinGroup(req: Request, res: Response) : Promise<void>{        
        const groupService: GroupService = new GroupService();

        // Post request group id and username attributes is stored..
        const group_id : string = req.body.group_id;
        const user_id : string = req.body.user_id;

        // Get response from service
        let result: string;
        try {
            result = await groupService.joinGroup(group_id, user_id);
        } catch (error) {
            result = error.message;
        }
        
        res.json(result);
    }

    // leaveGroup(req, res) | Get's post data from the route, and processes the post request.
    // Out: Response message from the service. 
    public async leaveGroup(req: Request, res: Response) : Promise<void>{      
        const groupService: GroupService = new GroupService();

        // Post request group id and username attributes is stored..
        let group_id: string = req.body.group_id;
        let user_id: string = req.body.user_id;
        
        // Get response from service
        let result;
        try {
            result = await groupService.leaveGroup(group_id, user_id);
        } catch (error) {
            result = error.message;
        }
        // Return result
        res.json(result);
    }

    public async getGroup(req : Request, res : Response) {
        const groupService = new GroupService();
        var group = await groupService.getGroup(req.params.group_id);
        var response = new BEResponse(group);
        
        // Invalid group id
        if(group == null){
            response.error = "No group exists with group id " + req.params.group_id;
            response.statuscode = 1;
        }

        // Return group obj (null if group_id does not correspond to a group in the DB)
        res.send(response);
    }

    public async verifyInvite(req : Request, res : Response) {
        // 1) Check if a group exists with id 'group_id'
        const groupService = new GroupService();
        var group = await groupService.getGroup(req.params.group_id);
        var response = new BEResponse(group);

        // TODO: Correctly/appropriately handle incorrect group ids
        // What should we send as response? How should we handle it in the frontend?
        if(group == null){
            response.error = 'No groups exist with id ' + req.params.group_id;
            response.statuscode = 1;
            res.send(response);
        }

        // 2) Check if the 'invite_id' is valid for the group
        // TODO: Correctly/appropriately handle incorrect invite ids
        // Same as above: What do we send, how do we handle it in the frontend?
        if(group.invite_id != req.params.invite_id){
            response.error = 'Invalid invite id for group with id ' + req.params.group_id;
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