import * as IO from 'socket.io';
import logger from '../common/logger';
import Handler from './handler';
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { IMongoGroup, Group, PersistedGroup } from "../models/groupModel";
import { lazyInject, iocContainer, provideSingleton } from '../common/inversify.config';
import { GroupController } from '../controllers';

interface SocketResponse<T> {
    data: T;
    error: boolean
}
@provideSingleton(GroupsHandler)
export default class GroupsHandler extends Handler {
    @lazyInject(TYPES.GroupService)
    private groupService: GroupService;
    @lazyInject(GroupController)
    private controller: GroupController

    private count: number = 22;

    public createGroup = async (group: Group): Promise<SocketResponse<PersistedGroup>> => {
        const result : SocketResponse<PersistedGroup> = { error: false, data: null }
        try {
            result.data = await this.controller.createGroup(group);

            // Add socket to room with group_id
            this.Socket.join(result.data._id);

            // emit that a group has changed
            //  To namespace '/groups'
            //  To room with group_id
            this.emitGroupChange(result.data, 'createGroup');
        }
        catch{
            result.error = true;
        }
        finally {
            return result;
        }
    }

    public joinGroup = async (args: { group_id: string, user_id: string }): Promise<SocketResponse<PersistedGroup>> => {
        const result : SocketResponse<PersistedGroup> = { error: false, data: null }
        logger.info("Join group invoked with the following args: " + JSON.stringify(args));
        // Invoke mongoGroupsService joinGroup
        logger.info("Group_id : " + args.group_id + "  ---   User_id: " + args.user_id);
        try {
            result.data = await this.controller.joinGroup({ group_id: args.group_id, user_id: args.user_id });

            // Add socket to room with group_id
            this.Socket.join(result.data._id);

            // emit that a group has changed
            //  To namespace '/groups'
            //  To room with group_id
            this.emitGroupChange(result.data, 'joinGroup');
        } catch (error) {
            result.error = true;
        }
        finally{
            return result;
        }

    }

    public leaveGroup = async (args: { group_id: string, user_id: string }): Promise<SocketResponse<void>> => {
        const result : SocketResponse<void> = { error: false, data: null }
        // Invoke mongoGroupsService leaveGroup
        try {
            const group = await this.controller.leaveGroup({ group_id: args.group_id, user_id: args.user_id });
            // Disconnect/remove socket from room with group_id
            this.Socket.leave(args.group_id);

            //const group: PersistedGroup = await this.controller.getGroup(args.group_id);

            // Is the group now empty?
            // If so, destroy the group and emit that a group has been destroyed

            // emit that a group has changed
            //  To namespace '/groups'
            //  To room with group_id
            this.emitGroupChange(group, 'leaveGroup');
        } catch (_) {
            result.error = true;
        }
        finally{
            return result;
        }
        
        
    }

    public getGroup = (args: any): void => { }

    public getGroups = (args: any): void => { }

    public verifyInvite = (args: any): void => { }

    public incTimer = async (args: any): Promise<void> => {
        // let interval = args as number;
        logger.debug(this.Socket.id + ' incremented from ' + this.count);
        this.count++;
        this.emitter(this.IO.of('/groups'), 'timer', this.count);
    }

    public subscribeToTimer = (args: any): void => {
        logger.debug('client is subscribing to timer at count ', this.count);
        this.emitter(this.IO.of('/groups'), 'timer', this.count);
    }

    private emitGroupChange = (group: PersistedGroup, caller: string): void => {
        // Responsible for emitting to entire '/groups' namespace AND room with group_id
        // Namespace '/groups'
        this.emitter(this.IO.of('/groups'), 'groupChanged', { group: group, caller: caller });

        // Room for group_id
        this.emitter(this.IO.to(group._id), 'groupChanged', { group: group, caller: caller });
    }

    public updateVisibility = async (group: IMongoGroup) => {
        const result = await this.groupService.updateVisibility(group);
        this.emitGroupChange(result, 'updateVisibility');
        return result;
    }



}