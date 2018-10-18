import {Request, Response} from "express";

import {GroupService} from "../../services/group/groupService"
import {ExampleService} from "../../services/example/exampleService"

export class GroupController {
    private groupService: GroupService;

    constructor(){
        this.groupService = new GroupService();
    }

    public async getGroups(req : Request, res : Response) 
    {
        console.log("Getting Groups!");
        res.json(await this.groupService.getAllGroups());
    }
}