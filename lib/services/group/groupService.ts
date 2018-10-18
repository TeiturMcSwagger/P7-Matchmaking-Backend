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
}