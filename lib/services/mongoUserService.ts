import * as mongoose from "mongoose";

import { UserSchema, IUser, IMongoUser } from "../models/userModel";
import { injectable } from "inversify";
import { UserService } from "./interfaces";

mongoose.connect(
  process.env.MONGOURL,
  { useNewUrlParser: true }
);

@injectable()
export class MongoUserService implements UserService {
    private userModel : mongoose.Model<IMongoUser>;

    constructor(){
        this.userModel = mongoose.model<IMongoUser>("users", UserSchema);
    }

    async getUserById(id: string): Promise<IUser> {
        return await this.userModel.findById(id);
    }

    async getAllUsers(): Promise<IUser[]> {
        return await this.userModel.find();
    }

    getUserByDiscordId(discord_id : string) : any{
        return this.userModel.findOne({discordId: discord_id});
    }

    createUser(name: string, discordId : string) : any {
        // Create a collection entry from the model definition
        var user = new this.userModel;
        user.name = name;
        user.created = new Date();
        user.discordId = discordId;

        // Save this data and return the response
        return user.save();
    }
}
