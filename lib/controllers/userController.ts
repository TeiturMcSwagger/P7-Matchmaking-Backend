import {Request, Response} from "express";

import { controller, httpGet, interfaces } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES, UserService, ServiceResponse } from "../services/interfaces";
import { Response as BEResponse } from "../common/response";
import { IUser } from "models/userModel";
import { ErrorCodes } from "common/errors";

@controller("/users")
export class UserController implements interfaces.Controller {
    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    @httpGet("/")
    public async getAllUsers(req: Request, res: Response) : Promise<void> {
        const users = await this.userService.getAllUsers();
        let response : BEResponse<IUser[]> = new BEResponse(users.result);
        if (users.result === null){
            response.statuscode = ErrorCodes.NoUsersExist;
            response.error = users.exception;
        }
        
        res.json(response);
    }

    public async getUserById(req: Request, res: Response) : Promise<void> {
        const user = await this.userService.getUserById(req.body.user_id);
        let response : BEResponse<IUser> = new BEResponse<IUser>(user.result);

        if(user.result === null){
            response.statuscode = ErrorCodes.InvalidUserID;
            response.error = user.exception;
        }

        res.json(response);
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        const user = await this.userService.createUser(req.body.username); 
        let response : BEResponse<IUser> = new BEResponse<IUser>(user.result);
        
        if(user.result === null){
            response.statuscode = ErrorCodes.ErrorCreatingUser;
            response.error = user.exception;
        }

        res.json(response);
    }
}
