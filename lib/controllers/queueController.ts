
import { GroupService, QueueService } from "../services/interfaces";
import { PersistedGroup } from "../models/groupModel";


import * as mongoose from 'mongoose';
import { QueueEntry, PersistedQueueEntry, Rank } from "../models/queueModel";
import { QueueBusinessLogic, GroupBusinessLogic } from "./interfaces";
import { Controller } from "tsoa";
import { provide } from "inversify-binding-decorators";


@provide(QueueController)
export class QueueController extends Controller implements QueueBusinessLogic {
    constructor (
         private queueService: QueueService,
         private groupService: GroupService,
         private groupLogic: GroupBusinessLogic,
    ) {
        super();
    }
    
    
    public async createEntry(e: QueueEntry): Promise<PersistedQueueEntry>{
        return await this.queueService.createEntry(e);
    }

    public async removeEntry(e: PersistedQueueEntry) : Promise<PersistedQueueEntry>{
        return await this.queueService.removeEntry(e);
    };

    public async findMatch(backEntry: PersistedQueueEntry): Promise<{ couldMatch: boolean, grp: PersistedGroup }>{
        let fifo = await this.queueService.getEntries();
        if (!(fifo.length > 0)) {
            return {couldMatch: false, grp: null};
        }
        for (const frontEntry of fifo) {
            if (this.IsMatching(frontEntry, backEntry)) {
                const fromGroupId = await this.GetGroupIdOrEmpty(backEntry);
                const toGroupId = await this.GetGroupIdOrEmpty(frontEntry);
                const frontEntryIsGroup = toGroupId !== "";
                const backEntryIsGroup = toGroupId !== "";

                let newGroup: PersistedGroup;
                let newEntry: PersistedQueueEntry = frontEntry;

                if (!backEntryIsGroup && !frontEntryIsGroup) {
                    newGroup = await this.createGroupOfTwo(frontEntry, backEntry);
                    newEntry.users = newGroup.users;
                    await this.queueService.updateEntry(newEntry, newEntry._id);
                }
                else if (!backEntryIsGroup && frontEntryIsGroup) {
                    newGroup = await this.groupLogic.changeGroup(backEntry.users[0], toGroupId, "");
                    newEntry.users = frontEntry.users.concat(backEntry.users);
                }
                else if (backEntryIsGroup && !frontEntryIsGroup) {
                    newGroup = await this.groupLogic.changeGroup(frontEntry.users[0], fromGroupId, "");
                    newEntry.users = frontEntry.users.concat(backEntry.users);
                }
                else {
                    for (const userId of backEntry.users) {
                        newGroup = await this.groupLogic.changeGroup(userId, toGroupId, fromGroupId)
                    }

                    await this.groupLogic.removeGroup({ group_id: fromGroupId });
                }

                if (newGroup.users.length === 5) {
                    await this.queueService.removeEntry(frontEntry);
                } else {
                    this.queueService.updateEntry(newEntry, newEntry._id);
                }

                await this.queueService.removeEntry(backEntry);
                return {couldMatch:true, grp: newGroup};
            }
        }
        return { couldMatch: false, grp: null };
    }

    private async GetGroupIdOrEmpty(e: PersistedQueueEntry) {
        if (e.users.length > 1) {
            const g = await this.groupService.getGroupByUserId(e.users[0])
            return g._id;
        }
        return "";
    }

    private async createGroupOfTwo(frontEntry: PersistedQueueEntry, backEntry: PersistedQueueEntry) : Promise<PersistedGroup>{
        const user1 = frontEntry.users[0];
        const user2 = backEntry.users[0]
        return await this.groupLogic.createGroup({
            users: [user1, user2],

            game: "Counter-Strike: GO",

            name: "MMGROUP",
            maxSize: 5
        })
    }

    private IsMatching(firstEntry: PersistedQueueEntry, secondEntry: PersistedQueueEntry) {
        const maxSize = 5;
        const isSingleUser = firstEntry.users.length === 1 || secondEntry.users.length === 1;
        const canMakeFullGroup = (firstEntry.users.length + secondEntry.users.length) === maxSize;

        if ((firstEntry._id as unknown as mongoose.Types.ObjectId).equals(secondEntry._id as unknown as mongoose.Types.ObjectId)) {
            return false;
        }

        if (isSingleUser || canMakeFullGroup) {
            const sameMode = firstEntry.gameSettings.mode === secondEntry.gameSettings.mode
            const secondSatisfiesFirst = this.BSatisfiesA(firstEntry, secondEntry);
            const firstSatisfiesSecond = this.BSatisfiesA(secondEntry, firstEntry);
            return sameMode && secondSatisfiesFirst && firstSatisfiesSecond;
        } else {
            return false;
        }
    }

    private BSatisfiesA(a: PersistedQueueEntry, b: PersistedQueueEntry): boolean {
        const aLevel = a.gameSettings.level;
        const bLevel = b.gameSettings.level;

        return a.gameSettings.rank === Rank.SAME
            ? (aLevel === bLevel)
            : a.gameSettings.rank === Rank.ABOVE
                ? (aLevel < bLevel)
                : aLevel > bLevel
    }
}