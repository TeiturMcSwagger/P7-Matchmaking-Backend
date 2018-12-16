import Handler from './handler';
import { GroupService, TYPES, QueueService } from "../services/interfaces";
import { lazyInject } from '../common/inversify.config';
import { GroupController, QueueController} from '../controllers';
import GroupsHandler from './groupsHandler';
import { PersistedQueueEntry, QueueEntry } from 'models/queueModel';
import { PersistedGroup } from 'models/groupModel';
import * as mongoose from 'mongoose';
import App from '../common/app';
import { BUSINESSTYPES, QueueBusinessLogic, GroupBusinessLogic } from '../controllers/interfaces';

interface SocketResponse<T> {
    data: T;
    error: boolean
}


export default class QueueHandler extends Handler {
    @lazyInject(TYPES.GroupService)
    private groupService: GroupService
    @lazyInject(GroupController)
    private groupLogic: GroupController
    @lazyInject(TYPES.QueueService)
    private queueService: QueueService
    
    public queueLogic: QueueBusinessLogic = new QueueController(this.queueService, this.groupService, this.groupLogic)

    public enqueue = async (entry: QueueEntry): Promise<SocketResponse<PersistedQueueEntry>> => {
        const result: SocketResponse<PersistedQueueEntry> = { error: false, data: null }
        try {
            result.data = await this.queueLogic.createEntry(entry);
            if (result.data.users.length > 1) {
                result.data.users.forEach(userId => {
                    App.SocketIdMap[userId].emit('groupEnqueued', { group: result.data, caller: "enqueue" });
                });
            }
            let matchResult = await this.queueLogic.findMatch(result.data);
            while (matchResult.couldMatch) {
                this.emitGroupMade(matchResult.grp, "enqueue");
                matchResult = await this.queueLogic.findMatch(await this.queueService.getHead());
            }
        }
        catch (error) {
            result.error = true;
            console.error("Error: " + error.message);
        }
        finally {
            return result;
        }
    }

    public dequeue = async (entry: PersistedQueueEntry): Promise<SocketResponse<PersistedQueueEntry>> => {
        const result: SocketResponse<PersistedQueueEntry> = { error: false, data: null }
        try {
            result.data = await this.queueLogic.removeEntry(entry);
            if (entry.users.length > 1) {
                entry.users.forEach(userId => {
                    App.SocketIdMap[userId].emit('groupDequeued', { group: result.data, caller: "dequeue" });
                });
            }
        }
        catch{
            result.error = true;
        }
        finally {

            return result;
        }
    }

    public emitGroupMade = async (group: PersistedGroup, caller: string) => {
        const newGroup = await this.groupService.getGroup(group._id);
        for (const userId of group.users) {
            await App.SocketIdMap[userId].emit('joinedGroup', { group: newGroup, caller: caller });
        }
    }


}