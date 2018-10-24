import {Request, Response} from "express";

import {UserService} from "../../services/users/userService";

export class UserController {
    public async createUser(req: Request, res: Response){
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