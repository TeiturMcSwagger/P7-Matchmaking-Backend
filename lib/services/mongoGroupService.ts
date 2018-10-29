import * as mongoose from "mongoose";

import { GroupSchema, IGroup } from "../models/groupModel";
import { GroupService, ServiceResponse } from "./interfaces"
import { injectable } from "inversify";
import * as randomstring from "randomstring";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoGroupService implements GroupService {
    private groupsModel : mongoose.Model<IGroup>;

    constructor(){
        this.groupsModel = mongoose.model("groups", GroupSchema);
    }

    public async getGroups() : Promise<ServiceResponse<IGroup[]>> {
        let groups : IGroup[] = null, exception : any = {};
        try {
            groups = await this.groupsModel.find({});
        }
        catch (e) {
            exception = e;
        }
        finally {
            return {result : groups, exception : exception};
        }
    }

    public async createGroup(group_data : any): Promise<ServiceResponse<IGroup>> {
        group_data.invite_id = randomstring.generate();

        let group : IGroup = null, exception : any = {};
        try{
            group = await this.groupsModel.create(group_data);
        }
        catch(e){
            exception = e;
        }
        finally{
            return {result : group, exception : exception};
        }
    }

    public async getGroup(group_id : string) : Promise<ServiceResponse<IGroup>> {
        let group : IGroup = null, exception : any = {};
        try {
            group = await this.groupsModel.findById(group_id);
        }
        catch(e){
            exception = e;
        }
        finally{
            return {result : group, exception : exception};
        }
    }
    
    public async joinGroup(group_id: string, user_id: string) : Promise<ServiceResponse<IGroup>> {
        let group : IGroup = null, exception : any = {};
        try {
            group = await this.groupsModel.updateOne({_id: group_id}, {$push: {users: user_id}});
        }
        catch(e){
            exception = e;
        }
        finally{
            return {result : group, exception : exception};
        }
    }

    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    public async leaveGroup(group_id: string, user_id: string) : Promise<ServiceResponse<IGroup>> {
        // This finds the group, where both the group_id and user_id matches, and $pulls out the entry from the users array. 
        let group : IGroup = null, exception : any = {};
        try {
            group = await this.groupsModel.updateOne({_id: group_id}, {$pull: {users: {$in: [user_id]}}}); 
        }
        catch(e){
            exception = e;
        }
        finally{
            return {result : group, exception : exception};
        }     
    }
}
