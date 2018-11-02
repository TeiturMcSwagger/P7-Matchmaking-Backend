import * as IO from 'socket.io';
import logger from '../common/logger';
import Handler from './handler';
import { GroupService, TYPES, UserService } from "../services/interfaces";
import { IGroup, IGroupUser } from "../models/groupModel";
import { inject, lazyInject } from '../common/inversify.config';
import { ADDRGETNETWORKPARAMS } from 'dns';

export default class GroupsHandler extends Handler {
    @lazyInject(TYPES.GroupService)
    private groupService : GroupService;

    private count : number = 22;    

    // public getGroups(socket : IO.Socket, args : any) : any {

    // }

    public createGroup = (socket : IO.Socket, args : any) : void => {
        // Invoke mongoGroupsService createGroup
        // Add socket to room with group_id
        // emit that a group has changed
        //  To namespace '/groups'
        //  To room with group_id
    }

    public joinGroup = (socket : IO.Socket, args : any) : void => {
        // Invoke mongoGroupsService joinGroup
        // Add socket to room with group_id
        // emit that a group has changed
        //  To namespace '/groups'
        //  To room with group_id
    }

    public leaveGroup = (socket : IO.Socket, args : any) : void => {
        // Invoke mongoGroupsService leaveGroup
        // Disconnect/remove socket from room with group_id
        // emit that a group has changed
        //  To namespace '/groups'
        //  To room with group_id
    }

    public getGroup = (socket : IO.Socket, args : any) : void => {}

    public getGroups = (socket : IO.Socket, args : any) : void => {}

    public verifyInvite = (socket : IO.Socket, args : any) : void => {}

    public incTimer = async (socket : IO.Socket, args : any) : Promise<void> => {
        // let interval = args as number;
        logger.debug(socket.id + ' incremented from ' + this.count);
        this.count++;
        this.IO.of('/groups').emit('timer', this.count);
    }

    public subscribeToTimer = (socket : IO.Socket, args : any) : void => {
        // let interval = args as number;
        logger.debug('client is subscribing to timer at count ', this.count);
    }


    private registerGroupChange = (group : IGroup) : void => {
        // Responsible for emitting to entire '/groups' namespace AND room with group_id
        // this.IO.of('/groups').emit('groupChanged', group);
        // this.IO.to(group._id).emit('groupChanged', group);
    }
}