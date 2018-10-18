import * as mongoose from "mongoose";

import {GroupSchema} from "../../models/groups/groupModel";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

export class GroupService {

    constructor(){
    }

    public async getAllGroups() {
        
    }
}
