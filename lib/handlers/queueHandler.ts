import * as IO from 'socket.io';
import logger from '../common/logger';
import Handler from './handler';
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { lazyInject } from '../common/inversify.config';
import { GroupController } from '../controllers';
import GroupsHandler from './groupsHandler';
import { PersistedQueueUser } from 'models/queueModel';
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

    public queueUser = async (args: {userid: String, mode: String, rank:String}): Promise<SocketResponse<PersistedQueueUser>> => {
        const result : SocketResponse<PersistedQueueUser> = { error: false, data: null }
        try {
            result.data = await this.service.queueUser({userid: args.userid}, 
                                                       {mode: args.mode}, 
                                                       {rank: args.rank});
        }
        catch{
            result.error = true;
        }
        finally {
            return result;
        }
    }
}