import { Response as BEResponse } from "../../response/response";
import { Request, Response } from "express";
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
import { GroupService, TYPES } from "../../services/interfaces";

@controller("/groups")
export class GroupController implements interfaces.Controller {
  constructor(@inject(TYPES.GroupService) private groupService: GroupService) {}

  @httpGet("/")
  public async getGroups(req: Request, res: Response) {
    res.json(await this.groupService.getGroups());
  }

  @httpPost("/")
  public async createGroup(req: Request, res: Response) {
    try {
      const group = req.body;
      const result = await this.groupService.createGroup(group);
      res.json(result);
    } catch (e) {
      res.json(e);
    }
  }

  @httpGet("/:group_id")
  public async getGroup(req: Request, res: Response) {
    var group = await this.groupService.getGroup(req.params.group_id);
    var response = new BEResponse(group);

    // Invalid group id
    if (group == null) {
      response.error = "No group exists with group id " + req.params.group_id;
      response.statuscode = 1;
    }

    // Return group obj (null if group_id does not correspond to a group in the DB)
    res.send(response);
  }
  @httpGet("/groups/:group_id/:invite_id")
  public async verifyInvite(req: Request, res: Response) {
    // 1) Check if a group exists with id 'group_id'
    var group = await this.groupService.getGroup(req.params.group_id);
    var response = new BEResponse(group);

    // TODO: Correctly/appropriately handle incorrect group ids
    // What should we send as response? How should we handle it in the frontend?
    if (group == null) {
      response.error = "No groups exist with id " + req.params.group_id;
      response.statuscode = 1;
      res.send(response);
    }

    // 2) Check if the 'invite_id' is valid for the group
    // TODO: Correctly/appropriately handle incorrect invite ids
    // Same as above: What do we send, how do we handle it in the frontend?
    if (group.invite_id != req.params.invite_id) {
      response.error =
        "Invalid invite id for group with id " + req.params.group_id;
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
