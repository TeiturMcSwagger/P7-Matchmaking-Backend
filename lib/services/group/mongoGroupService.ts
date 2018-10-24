import * as mongoose from "mongoose";

import { GroupSchema } from "../../models/groups/groupModel";
import { GroupService } from "../interfaces"
import { injectable } from "inversify";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

@injectable()
export class MongoGroupService implements GroupService {
    private groupsModel : mongoose.Model<any>;

    constructor(){
        this.groupsModel = mongoose.model("groups", GroupSchema);
    }

    public getGroups() {
        return this.groupsModel.find();
    }

    public createGroup(group): Promise<any> {
        return this.groupsModel.create(group);
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
