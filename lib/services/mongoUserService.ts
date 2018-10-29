import * as mongoose from "mongoose";

import { UserSchema, IUser } from "../models/userModel";
import { injectable } from "inversify";
import { UserService, ServiceResponse } from  "./interfaces";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoUserService implements UserService {
    private userModel : mongoose.Model<IUser>;

    constructor(){
        this.userModel = mongoose.model<IUser>("users", UserSchema);
    }

    public async getUserById(id: string): Promise<ServiceResponse<IUser>> {
        let user : IUser = null, exception : any = {};
        try {
            user = await this.userModel.findById(id);
        }
        catch (e) {
            exception = e;
        }
        finally {
            return {result : user, exception : exception};
        }
    }

    public async getAllUsers(): Promise<ServiceResponse<IUser[]>> {
        let users : IUser[] = null, exception : any = {};
        try {
            users = await this.userModel.find();
        }
        catch (e) {
            exception = e;
        }
        finally {
            return {result : users, exception : exception};
        }
    }

    public async createUser(name: string) : Promise<ServiceResponse<IUser>> {
        let user : IUser = new this.userModel(), exception : any = {};
        // Create a collection entry from the model definition
        user.name = name;
        user.created = new Date();
        
        try {
            // Save this data
            user.save();
        }
        catch (e) {
            exception = e;
            user = null;
        }
        finally {
            // Return the response
            return {result : user, exception : exception};
        }
    }
}
