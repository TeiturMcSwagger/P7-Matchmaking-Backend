import * as mongoose from "mongoose";

import {GroupSchema} from "../../models/groups/groupModel";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

export class GroupService {
    private groupModel;

    constructor(){
        this.groupModel = mongoose.model("groups", GroupSchema);
        console.log("Groups constructed!");
    }

    public async getAllGroups() {
        console.log("Returning groups!");
        return await this.groupModel.find({}, (err, data) => {
            return data;
        });
    }
}
