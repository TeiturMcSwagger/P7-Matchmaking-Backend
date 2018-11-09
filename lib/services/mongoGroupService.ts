import * as mongoose from "mongoose";
import { GroupSchema, IMongoGroup, IGroup } from "../models/groupModel";
import { GroupService } from "./interfaces"
import { injectable } from "inversify";
import * as randomstring from "randomstring";
import logger from "../common/logger";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoGroupService implements GroupService {
    private groupsModel: mongoose.Model<IMongoGroup>;

    constructor() {
        this.groupsModel = mongoose.model("groups", GroupSchema);
    }

    public async updateGroupUsers(group_id: string, newUsers: string[]) {
        let res;
        newUsers.forEach(u => res = this.groupsModel.findOneAndUpdate({ _id: group_id }, { $push: { users: u } }, { new: true }));
        return res;
    }

    public async getGroups(): Promise<IGroup[]> {
        return await this.groupsModel.find();
    }

    public async updateGroupDiscordChannels(channels: string[], groupId: string): Promise<IMongoGroup> {
        return this.groupsModel.findOneAndUpdate({ _id: groupId }, { $push: { discordChannels: channels } }, { new: true });
    }

    public async getFittingGroups(size: number, game: string): Promise<IGroup[]> {
        return await this.groupsModel.find({ $where: "this.users.length > 0 && this.users.length <= " + size } && { game: game }); //({game : game})
        // return await this.groupsModel.find({$where: "this.users.length > 0 && this.users.length <= " + size} && {$where: "this.group.game === this.group.game"})
    }


    public createGroup(group): Promise<IMongoGroup> {
        group.invite_id = randomstring.generate();
        group.visible = false;
        return this.groupsModel.create(group);
    }

    public async getGroup(group_id: String): Promise<IMongoGroup> {
        logger.info("Requested group: " + group_id);
        const group = await this.groupsModel.findById(group_id);
        return group;
    }

    public async getGroupsByUserId(user_id: string): Promise<IMongoGroup[]> {
        return await this.groupsModel.find({ "users": { $in: [user_id] } });
    }

    public async joinGroup(group_id: string, user_id: string): Promise<IMongoGroup> {
        return await this.groupsModel.findOneAndUpdate({ _id: group_id }, { $push: { users: user_id } }, { new: true });
    }

    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    public async leaveGroup(group_id: string, user_id: string): Promise<IMongoGroup> {
        // This finds the group, where both the group_id and user_id matches, and $pulls out the entry from the users array. 
        return await this.groupsModel.findOneAndUpdate({ _id: group_id }, { $pull: { users: { $in: [user_id] } } }, { new: true });
    }

    public async updateVisibility(group: IGroup): Promise<IMongoGroup> {
        let value = !group.visible;
        return await this.groupsModel.findByIdAndUpdate({ _id: group._id }, { $set: { visible: value } }, { new: true });
    }

    public async removeGroup(group_id: string): Promise<IMongoGroup> {
        return await this.groupsModel.findOneAndDelete({ "_id": group_id });
    }
}
