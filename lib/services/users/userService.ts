import * as mongoose from "mongoose";

import { UserSchema } from "../../models/users/userModel";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

export class UserService {
    private userModel : mongoose.model;

    constructor(){
        this.userModel = mongoose.model("users", UserSchema);
    }

    getUserById(id : string) : any {
        return this.userModel.find({_id: id});
    }

    createUser(name: string) : any {
        // Create a collection entry from the model definition
        var user = new this.userModel;
        user.name = name;
        user.created = new Date();

        // Save this data and return the response
        return user.save();
    }
}
