import * as mongoose from "mongoose";

import { GroupSchema } from "../../models/groups/groupModel";
import { GroupService } from "../interfaces"
import { injectable } from "inversify";
import * as randomstring from "randomstring";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoGroupService implements GroupService {
    private groupsModel : mongoose.Model<any>;

    constructor(){
        this.groupsModel = mongoose.model("groups", GroupSchema);
    }

    public getGroups() {
        return this.groupsModel.find();
    }

    public updateGroupDiscordChannels(channels : string[], groupId : string){
        return this.groupsModel.findOneAndUpdate({_id: groupId}, {$push: {discordChannels: channels}}, {new: true});
    }

    public createGroup(group): Promise<any> {
        group.invite_id = randomstring.generate();
        return this.groupsModel.create(group);
    }

    public getGroup(group_id : String) : any {
        return this.groupsModel.findById(group_id);
    }
    
    public joinGroup(group_id: string, user_id: string) : any {
        return this.groupsModel.findOneAndUpdate({_id: group_id}, {$push: {users: user_id}});       
    }

    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    public leaveGroup(group_id: string, user_id: string) : any {
        // This finds the group, where both the group_id and user_id matches, and $pulls out the entry from the users array. 
        return this.groupsModel.findOneAndUpdate({_id: group_id}, {$pull: {users: {$in: [user_id]}}});       
    }
}
