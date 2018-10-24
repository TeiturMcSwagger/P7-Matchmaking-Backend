import * as mongoose from "mongoose";

import { GroupSchema } from "../../models/groups/groupModel";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

export class GroupService {
    private groupModel;

    constructor() {
        this.groupModel = mongoose.model("group", GroupSchema);
    }

    public async getGroups() {
        let groups;
        try {
            groups = await this.groupModel.find({}, (err, data) => { })
            console.log(groups)
        }
        catch (e) {
            groups = null
        }
        finally {
            return groups;
        }
    }

    public async createGroup(group) {
        return await this.groupModel.create(group);
    }

    public async getGroup(group_id: String) {
        let group;
        try {
            group = await this.groupModel.findById(group_id, function (err, adventure) { });
        }
        catch (e) {
            group = null;
        }
        finally {
            return group;
        }
    }


}