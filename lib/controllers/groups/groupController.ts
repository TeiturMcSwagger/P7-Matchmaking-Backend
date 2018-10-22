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
        try {
            const group = req.body;
            const result = await groupService.createGroup(group);
            res.json(result);

        } catch(e) {
            res.json(e);
        }
    }
}