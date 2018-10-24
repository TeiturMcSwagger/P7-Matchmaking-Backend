import * as mongoose from "mongoose";

import { GroupSchema } from "../../models/groups/groupModel";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

export class GroupService {
    private groupsModel;

    constructor(){
        this.groupsModel = mongoose.model("groups", GroupSchema);
    }

    public async getGroups() {
        return await this.groupsModel.find({}, (err, data) => {
            return data;
        });
    }

    public async createGroup(group) {
        return await this.groupsModel.create(group);
    }
    
    public joinGroup(group_id: string, user_id: string){
        return this.groupsModel.updateOne({_id: group_id}, {$push: {users: user_id}});       
    }

    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    public leaveGroup(group_id: string, user_id: string) {
        // This finds the group, where both the group_id and user_id matches, and $pulls out the entry from the users array. 
        return this.groupsModel.updateOne({_id: group_id}, {$pull: {users: {$in: [user_id]}}});       
    }
}