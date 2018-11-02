import * as mongoose from "mongoose";

import { UserSchema, IUser, IMongoUser } from "../models/userModel";
import { injectable } from "inversify";
import { UserService } from  "./interfaces";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

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

    createUser(name: string, discordId: string) : Promise<IUser> {
        // Create a collection entry from the model definition
        var user = new this.userModel;
        user.name = name;
        user.discordId = discordId;
        user.created = new Date();
        // Save this data and return the response
        return user.save();
    }
}
