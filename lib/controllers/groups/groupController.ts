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
            result = groupService.joinGroup(group_id, user_id);
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
}