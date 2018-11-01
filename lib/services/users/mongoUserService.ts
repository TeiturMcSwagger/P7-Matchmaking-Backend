import * as mongoose from "mongoose";

import { UserSchema } from "../../models/users/userModel";
import { UserService } from "../interfaces"
import { injectable } from "inversify";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoUserService implements UserService {
    private userModel : mongoose.Model<any>;

    constructor(){
        this.userModel = mongoose.model("users", UserSchema);
    }

    getUserById(id : string) : any {
        return this.userModel.findOne({_id: id});
    }

    getUsers() : any{
        return this.userModel.find({});
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
