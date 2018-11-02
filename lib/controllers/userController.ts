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
  Tags,
} from "tsoa";
import { ApiError } from "./ErrorHandler";
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

  @Response<ApiError>("404", "User not found")
  @Get("{user_id}")
  public async getUserById(user_id: string): Promise<IUser> {
    const result = await this.userService.getUserById(user_id);
    if (result == null)
      throw new ApiError({
        statusCode: 404,
        name: "Find user Error",
        message: "User not found",
        fields: null,
      });
    return result;
  }

  @Post("/create")
  /* Creates a user based on the body of the request */
  public async createUser(@Body() body: IUser): Promise<IUser> {
    return this.userService.createUser(body.name, body.discordId);
  }
}
