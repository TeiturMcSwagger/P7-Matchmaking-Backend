import * as IO from 'socket.io';
import logger from '../common/logger';
import Handler from './handler';
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { IMongoGroup, Group } from "../models/groupModel";
import { lazyInject } from '../common/inversify.config';


export default class GroupsHandler extends Handler {
    @lazyInject(TYPES.GroupService)
    private groupService: GroupService;

    private count: number = 22;

    public createGroup = async (group: Group): Promise<{ error: boolean, newGroup: Group }> => {
        const result = { error: false, newGroup: null }

        try {
            // Invoke mongoGroupsService createGroup
            result.newGroup = await this.groupService.createGroup(group);

            // Add socket to room with group_id
            this.Socket.join(result.newGroup._id);

            // emit that a group has changed
            //  To namespace '/groups'
            //  To room with group_id
            this.emitGroupChange(result.newGroup, 'createGroup');
        }
        catch{
            result.error = true;
        }
        finally {
            return result;
        }
    }

    public joinGroup = async (args: { group_id: string, user_id: string }): Promise<IMongoGroup> => {
        logger.info("Join group invoked with the following args: " + JSON.stringify(args));
        // Invoke mongoGroupsService joinGroup
        logger.info("Group_id : " + args.group_id + "  ---   User_id: " + args.user_id);
        const group = await this.groupService.joinGroup(args.group_id, args.user_id);

        /* 
            Test if group is of type IGroup
            If it is, add the socket to room with id = group._id 
            and emitGroupChange
        */

        // Add socket to room with group_id
        this.Socket.join(group._id);

        // emit that a group has changed
        //  To namespace '/groups'
        //  To room with group_id
        this.emitGroupChange(group, 'joinGroup');

        return group;
    }

    public leaveGroup = async (args: { group_id: string, user_id: string }): Promise<void> => {
        // Invoke mongoGroupsService leaveGroup
        await this.groupService.leaveGroup(args.group_id, args.user_id);

        // Disconnect/remove socket from room with group_id
        this.Socket.leave(args.group_id);

        const group: IMongoGroup = await this.groupService.getGroup(args.group_id);

        // emit that a group has changed
        //  To namespace '/groups'
        //  To room with group_id
        this.emitGroupChange(group, 'leaveGroup');
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

    private emitGroupChange = (group: IMongoGroup, caller: string): void => {
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