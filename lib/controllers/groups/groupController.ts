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
}