import * as IO from 'socket.io';
import logger from '../common/logger';
import Handler from './handler';
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { lazyInject } from '../common/inversify.config';
import { GroupController } from '../controllers';
import GroupsHandler from './groupsHandler';
import { PersistedQueueEntry, QueueEntry } from 'models/queueModel';
import { MongoQueueService } from 'services';

interface SocketResponse<T> {
    data: T;
    error: boolean
}

interface QueueResponse{
    userid: string,
    mode: string,
    rank: string
}

export default class QueueHandler extends Handler {
    @lazyInject(TYPES.GroupService)
    private groupService: GroupService;
    @lazyInject(GroupController)
    private controller: GroupController
    @lazyInject(GroupsHandler)
    private handler: GroupsHandler
    @lazyInject(MongoQueueService)
    private service: MongoQueueService

    public queue = async (entry: QueueEntry): Promise<SocketResponse<PersistedQueueEntry>> => {
        const result : SocketResponse<PersistedQueueEntry> = { error: false, data: null }
        try {
            result.data = await this.service.createEntry(entry);
        }
        catch{
            result.error = true;
        }
        finally {
            this.findMatch(result.data);
            return result;
        }
    }

    

    private async findMatch(newEntry: PersistedQueueEntry): Promise<void>{
        let fifo = await this.service.getEntries();
        fifo.forEach(element => {
            if(this.IsMatching(element, newEntry)){
                newEntry.users.forEach(userId => {
                   // this.controller.changeGroup(userId, )
                });
            }
        });
        
    }

    private IsMatching(firstEntry: PersistedQueueEntry, secondEntry: PersistedQueueEntry){
        const maxSize = 5;
        const isSingleUser = firstEntry.users.length > 1 || secondEntry.users.length > 1;
        const canMakeFullGroup = (firstEntry.users.length + secondEntry.users.length) === maxSize;

        if (isSingleUser || canMakeFullGroup ) {
            const sameMode = firstEntry.gameSettings.mode === secondEntry.gameSettings.mode
            const secondSatisfiesFirst = this.BSatisfiesA(firstEntry, secondEntry); 
            const firstSatisfiesSecond = this.BSatisfiesA(secondEntry, firstEntry); 
            return sameMode && secondSatisfiesFirst && firstSatisfiesSecond;
        } else {
            return false;
        }
    }
    private BSatisfiesA(a: PersistedQueueEntry, b: PersistedQueueEntry): boolean{
        const aLevel = a.gameSettings.level;
        const bLevel = b.gameSettings.level;

        return  a.gameSettings.rank === 1 
                    ? (aLevel === bLevel)
                    : a.gameSettings.rank === 2 
                        ? (aLevel < bLevel) 
                        : aLevel > bLevel 
    }

    public emitGroupMade = () => {

    }  
}