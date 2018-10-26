import {Request, Response} from "express";

import { controller, httpGet, interfaces, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES, UserService } from "../services/interfaces";

@controller("/users")
export class UserController implements interfaces.Controller {
    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    @httpGet("/")
    public async getAllUsers(req: Request, res: Response) {
        const users = await this.userService.getAllUsers()
        console.log("USERSSS", users);
        res.send(users);
    }

    @httpGet("/:user_id")
    public async getUserById(req: Request, res: Response) : Promise<void>{

        let user_id : string = req.params.group_id;

        let result;
        try{
            result = await this.userService.getUserById(user_id);
        }catch(error){
            result = error.message;
        }

        res.json(result);
    }

    @httpPost("/create")
    public async createUser(req: Request, res: Response): Promise<void>{

        let username = req.body.username;

        let result;
        try {
            // This is the created user response
            result =  await this.userService.createUser(username);            
        } catch (error) {
            // This is the error response
            result = error.message;
        }

        // Send json response
        res.json(result);
    }
}
