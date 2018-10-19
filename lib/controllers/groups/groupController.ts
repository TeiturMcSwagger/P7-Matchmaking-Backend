import {Request, Response} from "express";

import {GroupService} from "../../services/group/groupService"

export class GroupController {
    public async getGroups(req : Request, res : Response) 
    {
        const groupService = new GroupService();
        res.json(await groupService.getGroups());
    }

    public async createGroup(req : Request, res : Response) {
        const groupService = new GroupService();
        console.log(groupService.createGroup(req.body));
    }

    // leaveGroup(req, res) | Get's post data from the route, and processes the post request.
    // Out: Response message from the service. 
    public async leaveGroup(req: Request, res: Response){        
        const groupService: GroupService = new GroupService();

        // Post request group id and username attributes is stored..
        let group_id = req.body.group_id;
        let username = req.body.username;

        // Get response from service
        let response = groupService.leaveGroup(group_id, username);
        res.json(await response);
    }
}