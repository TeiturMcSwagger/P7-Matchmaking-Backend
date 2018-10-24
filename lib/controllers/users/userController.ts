import {Request, Response} from "express";

import {UserService} from "../../services/users/userService";

export class UserController {
    public async getUserById(req: Request, res: Response) : Promise<void>{
        const userService: UserService = new UserService();

        let user_id : string = req.body.user_id;

        let result : string;
        try{
            result = await userService.getUserById(user_id);
        }catch(error){
            result = error.message;
        }

        res.json(result);
    }

    public async createUser(req: Request, res: Response): Promise<void>{
        const userService: UserService = new UserService();

        let username = req.body.username;

        let result;
        try {
            // This is the created user response
            result =  await userService.createUser(username);            
        } catch (error) {
            // This is the error response
            result = error.message;
        }

        // Send json response
        res.json(result);
    }
}