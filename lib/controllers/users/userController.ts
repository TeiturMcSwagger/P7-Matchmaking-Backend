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
  requestParam,
  httpPut
} from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES, UserService } from "../../services/interfaces";

@controller("/users")
export class UserController implements interfaces.Controller {

    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    @httpGet("/")
    public async getUsers(req : Request, res : Response) : Promise<void> {
        let result;
        try{
            result = await this.userService.getUsers();
        }catch(error){
            result = error;
        }

        return result;
    }

    @httpPut("/")
    public async getUserById(req: Request, res: Response) : Promise<void>{
        let user_id : string = req.body.user_id;

        let result : string;
        try{
            result = await this.userService.getUserById(user_id);
        }catch(error){
            result = error.message;
        }

        res.json(result);
    }

    @httpPost("/")
    public async createUser(req: Request, res: Response): Promise<void>{
        let username = req.body.username;
        let discordId = req.body.discordId;

        let result;
        try {
            // This is the created user response
            result =  await this.userService.createUser(username, discordId);            
        } catch (error) {
            // This is the error response
            result = error.message;
        }

        // Send json response
        res.json(result);
    }
}