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

    public async getGroup(group_id : String) {
        let group;
        try{
            group = await this.groupsModel.findById(group_id, function (err, adventure) {});
        }
        catch(e){
            group = null;
        }
        finally{
            return group;
        }        
    }
}