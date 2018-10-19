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
    
    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    public async leaveGroup(group_id: string, username: string): Promise<any> {
        try{
            return await Promise.resolve(this.groupsModel.find({"_id": group_id}, (err, data) => {
                /*
                    ====================================
                    |||||| Needed Functionality ||||||||
                    ====================================
                    ------ Update the group, so --------
                    ------ The user requesting  --------
                    ------ Is deleted from the  --------
                    ------ Group                --------
                    ====================================
                    ------ We should also check --------
                    ------ Whether the username --------
                    ------ Exist or not         --------
                    ====================================
                */
               console.log(`Username: ${username}`);
            }));
        }catch(e){
            return {"message": "Group does not exist", "status": 500};
        }
    }
}