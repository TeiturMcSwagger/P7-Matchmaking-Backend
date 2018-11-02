import {
  Route,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Security,
  Query,
  Body,
  Response,
  Tags
} from "tsoa";
import { provideSingleton, inject, provide } from "../common/inversify.config";

import { IUser } from "../models/userModel";

import { TYPES, UserService } from "../services/interfaces";

@Tags("users")
@Route("users")
@provideSingleton(UserController)
export class UserController extends Controller {
  constructor(@inject(TYPES.UserService) private userService: UserService) {
    super();
  }

  @Get("/")
  public async getAllUsers(): Promise<IUser[]> {
    const users = await this.userService.getAllUsers();
    console.log("USERSSS", users);
    return users;
  }

  @Get("/{user_id}")
  public async getUserById(user_id: string): Promise<IUser> {
    let result;

    try {
      result = await this.userService.getUserById(user_id);
      debugger;
    } catch (error) {
      result = error.message;
    }
    return result;
  }

  @Post("/create")
    /* Creates a user based on the body of the request */
  public async createUser(@Body() body: { name: string, discordId: string }): Promise<void> {
    let result;
    try {
      // This is the created user response
      result = await this.userService.createUser(body.name, body.discordId);
      console.log("backend created user", result);
    } catch (error) {
      // This is the error response
      result = error.message;
    }

    // Send json response
    return result;
  }

}
