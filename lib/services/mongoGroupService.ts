import * as mongoose from "mongoose";
import { GroupSchema, IMongoGroup, Group } from "../models/groupModel";
import { GroupService } from "./interfaces"
import { injectable } from "inversify";
import * as randomstring from "randomstring";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoGroupService implements GroupService {
    private groupsModel : mongoose.Model<IMongoGroup>;

    constructor(){
        this.groupsModel = mongoose.model("groups", GroupSchema);
    }

    public async getGroups(): Promise<Group[]> {
        return await this.groupsModel.find();
    }

    public async getFittingGroups(size: number, game: string): Promise<Group[]> {
        return await this.groupsModel.find({$where: "this.users.length > 0 && this.users.length <= " + size} && {game : game}); //({game : game})
        // return await this.groupsModel.find({$where: "this.users.length > 0 && this.users.length <= " + size} && {$where: "this.group.game === this.group.game"})
    }

    public createGroup(group): Promise<any> {
        group.invite_id = randomstring.generate();
        return this.groupsModel.create(group);
    }

    public async getGroup(group_id : String) : Promise<IMongoGroup> {
        return await this.groupsModel.findById(group_id);
    }
    
    public joinGroup(group_id: string, user_id: string) : mongoose.Query<any> {
        return this.groupsModel.updateOne({_id: group_id}, {$push: {users: user_id}});       
    }

    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    public leaveGroup(group_id: string, user_id: string) : any {
        // This finds the group, where both the group_id and user_id matches, and $pulls out the entry from the users array. 
        return this.groupsModel.updateOne({_id: group_id}, {$pull: {users: {$in: [user_id]}}});       
    }
}
