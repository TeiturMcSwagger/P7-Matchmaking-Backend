import * as mongoose from "mongoose";

import { GroupSchema } from "../../models/groups/groupModel";
import { GroupService } from "../interfaces"
import { injectable } from "inversify";
import * as randomstring from "randomstring";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoGroupService implements GroupService {
    private groupsModel: mongoose.Model<any>;

    constructor() {
        this.groupsModel = mongoose.model("groups", GroupSchema);
    }

    public getGroups() {
        return this.groupsModel.find();
    }

    public createGroup(group): Promise<any> {
        group.invite_id = randomstring.generate();
        return this.groupsModel.create(group);
    }

    public async getGroup(group_id: String): Promise<any> {
        let group;
        try {
            group = await this.groupsModel.findById(group_id, function (err, adventure) { });
        }
        catch (e) {
            group = null;
        }
        finally {
            return group;
        }
    }

    public async joinGroup(group_id: string, user_id: string): Promise<any> {
        let result;
        try {
            await this.groupsModel.findByIdAndUpdate({ _id: group_id }, { $push: { users: user_id } });
            result = await this.getGroup(group_id);
        }
        catch {
            result = null;
        }
        finally {
            return result;
        }
    }

    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    public leaveGroup(group_id: string, user_id: string): any {
        // This finds the group, where both the group_id and user_id matches, and $pulls out the entry from the users array. 
        return this.groupsModel.updateOne({ _id: group_id }, { $pull: { users: { $in: [user_id] } } });
    }
}
