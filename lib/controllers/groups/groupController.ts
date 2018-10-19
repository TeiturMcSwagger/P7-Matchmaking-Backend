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

    public async getGroup(req : Request, res : Response) {
        const groupService = new GroupService();
        var group = await groupService.getGroup(req.params.group_id);

        // Invalid group id
        // TODO: handle appropriately (if any special handling is needed on the backend)
        if(group == null){
            
        }
        
        // Return group obj (null if group_id does not correspond to a group in the DB)
        res.json(group);
    }

    public async verifyInvite(req : Request, res : Response) {
        // 1) Check if a group exists with id 'group_id'
        const groupService = new GroupService();
        var group = await groupService.getGroup(req.params.group_id);
        
        // TODO: Correctly/appropriately handle incorrect group ids
        // What should we send as response? How should we handle it in the frontend?
        if(group == null){
            res.send('No groups exist with id ' + req.params.group_id);
        }

        // 2) Check if the 'invite_id' is valid for the group
        // TODO: Correctly/appropriately handle incorrect invite ids
        // Same as above: What do we send, how do we handle it in the frontend?
        if(group.invite_id != req.params.invite_id){
            res.send('Invalid invite id for group with id ' + req.params.group_id);
        }

        // The group id is valid and the invite id is correct w.r.t. the group.
        // Send response to frontend to redirect the page to the "join group" url
        // The "join group" controller will handle checks such as is the group full / does the user meet the requirements
        // TODO: Handle in frontend
        res.send(group);
    }
}