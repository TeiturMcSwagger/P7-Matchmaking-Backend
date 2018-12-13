import * as mongoose from "mongoose";
import { GroupSchema, IMongoGroup, Group, PersistedGroup, IUserList } from "../models/groupModel";
import { GroupService } from "./interfaces"
import { injectable } from "inversify";
import * as randomstring from "randomstring";
import logger from "../common/logger";
import { MongoUserService } from "../services/mongoUserService";
import { IUser } from "../models/userModel";

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true });

@injectable()
export class MongoGroupService implements GroupService {
    private groupsModel: mongoose.Model<IMongoGroup>;
    private userService: MongoUserService;

    constructor() {
        this.groupsModel = mongoose.model("groups", GroupSchema);

        this.userService = new MongoUserService();
    }

    public async updateGroupUsers(group_id: string, newUsers: string[]) {
        let res;
        newUsers.forEach(u => res = this.groupsModel.findOneAndUpdate({ _id: group_id }, { $push: { users: u } }, { new: true }));
        return res;
    }

    public async getGroups(): Promise<Group[]> {
        const allGroups = await this.groupsModel.find();
        const result: Group[] = []
        for (const group of allGroups) {
            result.push(await this.populateUserList(group));
        }
        logger.error(JSON.stringify(result))
        return result;
    }

    public async updateGroupDiscordChannels(channels: string[], groupId: string): Promise<IMongoGroup> {
        return this.groupsModel.findOneAndUpdate({ _id: groupId }, { $push: { discordChannels: channels } }, { new: true });
    }

    public async getFittingGroups(size: number, game: string): Promise<Group[]> {
        return await this.groupsModel.find({ $where: "this.users.length > 0 && this.users.length <= " + size } && { game: game }); //({game : game})
        // return await this.groupsModel.find({$where: "this.users.length > 0 && this.users.length <= " + size} && {$where: "this.group.game === this.group.game"})
    }


    public createGroup(group): Promise<IMongoGroup> {
        group.invite_id = randomstring.generate();
        group.visible = false;
        return this.groupsModel.create(group);
    }

    public async getGroup(group_id: String): Promise<PersistedGroup> {
        logger.info("Requested group: " + group_id);
        return await this.populateUserList(await this.groupsModel.findById(group_id));
    }

    private async populateUserList(group: PersistedGroup): Promise<PersistedGroup> {
        for (const userID of group.users) {
            const userobj = await this.userService.getUserById(userID)
            group.userList.push(userobj)
        }
        return group
    }

    public async getGroupsByUserId(user_id: string): Promise<IMongoGroup[]> {
        return await this.groupsModel.find({ "users": { $in: [user_id] } });
    }

    public async getGroupByUserId(user_id: string): Promise<PersistedGroup> {
        return await this.groupsModel.findOne({ "users": { $in: [user_id] } });
    }

    public async joinGroup(group_id: string, user_id: string): Promise<PersistedGroup> {
        return await this.populateUserList(
            await this.groupsModel.findOneAndUpdate(
                { _id: group_id },
                { $push: { users: user_id } },
                { new: true }
            )
        );
    }

    // leaveGroup(group_id) | Checks whether the group id exist in the database
    // Out: A message, containing either a success- or reject message
    public async leaveGroup(group_id: string, user_id: string): Promise<PersistedGroup> {
        // This finds the group, where both the group_id and user_id matches, and $pulls out the entry from the users array. 
        return await this.populateUserList(
            await this.groupsModel.findOneAndUpdate(
                { _id: group_id },
                { $pull: { users: { $in: [user_id] } } },
                { new: true }
            )
        );
    }

    public async updateVisibility(group: PersistedGroup): Promise<IMongoGroup> {
        let value = !group.visible;
        return await this.groupsModel.findByIdAndUpdate({ _id: group._id }, { $set: { visible: value } }, { new: true });
    }

    public async removeGroup(group_id: string): Promise<IMongoGroup> {
        return await this.groupsModel.findOneAndDelete({ "_id": group_id });
    }
}
