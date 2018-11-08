import * as IO from 'socket.io';
import logger from '../common/logger';
import Handler from './handler';
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { IMongoGroup } from "../models/groupModel";
import { inject, lazyInject } from '../common/inversify.config';
import { ADDRGETNETWORKPARAMS } from 'dns';
import { UV_UDP_REUSEADDR } from 'constants';

export default class GroupsHandler extends Handler {
    @lazyInject(TYPES.GroupService)
    private groupService : GroupService;

    private count : number = 22;    

    public createGroup = (args : any) : void => {
        // Invoke mongoGroupsService createGroup
        // Add socket to room with group_id
        // emit that a group has changed
        //  To namespace '/groups'
        //  To room with group_id
    }

    public joinGroup = async (args : {group_id : string, user_id : string}) : Promise<IMongoGroup> => {
        logger.info("Join group invoked with the following args: " + JSON.stringify(args));
        // Invoke mongoGroupsService joinGroup
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
        this.emitGroupChange(group);

        return group;
    }

    public leaveGroup(args : any) : void {
        // Invoke mongoGroupsService leaveGroup
        // Disconnect/remove socket from room with group_id
        // emit that a group has changed
        //  To namespace '/groups'
        //  To room with group_id
    }

    public getGroup = (args : any) : void => {}

    public getGroups = (args : any) : void => {}

    public verifyInvite = (args : any) : void => {}

    public incTimer = async (args : any) : Promise<void> => {
        // let interval = args as number;
        logger.debug(this.Socket.id + ' incremented from ' + this.count);
        this.count++;
        this.emitter(this.IO.of('/groups'), 'timer', this.count);
    }

    public subscribeToTimer = (args : any) : void => {
        logger.debug('client is subscribing to timer at count ', this.count);
        this.emitter(this.IO.of('/groups'), 'timer', this.count);
    }

    private emitGroupChange = (group : IMongoGroup) : void => {
        // Responsible for emitting to entire '/groups' namespace AND room with group_id
        // Namespace '/groups'
        this.emitter(this.IO.of('/groups'), 'groupChanged', group);

        // Room for group_id
        this.emitter(this.IO.to(group._id), 'groupChanged', group);
    }

}