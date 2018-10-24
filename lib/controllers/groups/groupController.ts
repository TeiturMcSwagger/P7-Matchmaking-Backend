import {Request, Response} from "express";

import {GroupService} from "../../services/group/groupService";
import {UserService} from "../../services/users/userService";

export class GroupController {
    public async getGroups(req : Request, res : Response) 
    {
        const groupService = new GroupService();
        res.json(await groupService.getGroups());
    }

    public async createGroup(req : Request, res : Response) {
        const groupService = new GroupService();
        res.json(groupService.createGroup(req.body));
    }

    public async joinGroup(req: Request, res: Response){        
        const groupService: GroupService = new GroupService();

        // Post request group id and username attributes is stored..
        let group_id = req.body.group_id;
        let user_id = req.body.user_id;

        // Get response from service
        let response = groupService.joinGroup(group_id, user_id);
        res.json(await response);
    }

    // leaveGroup(req, res) | Get's post data from the route, and processes the post request.
    // Out: Response message from the service. 
    public async leaveGroup(req: Request, res: Response){        
        const groupService: GroupService = new GroupService();

        // Post request group id and username attributes is stored..
        let group_id = req.body.group_id;
        let user_id = req.body.user_id;

        // Get response from service
        let response = groupService.leaveGroup(group_id, user_id);
        res.json(await response);
    }
}