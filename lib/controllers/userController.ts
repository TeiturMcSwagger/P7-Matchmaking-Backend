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

  /* Creates a user based on the body of the request */
  // Don't use IUser in body since it will throw a validation error saying created is required
  @Post("/create")
    /* Creates a user based on the body of the request */
  public async createUser(@Body() body: IUser): Promise<IUser> {
    // Send json response
    let name = body.name;
    let discordId = body.discordId;

        let result;
        try {
            // This is the created user response
            result =  await this.userService.createUser(name, discordId);            
        } catch (error) {
            // This is the error response
            result = error.message;
        }

    // return json response
    return result;
  }
}
