import * as IO from 'socket.io';
import logger from './logger';
import registerHandlers from './registerHandlers';
import EventHandleMap from './eventHandleMap';
import GroupsHandler from '../handlers/groupsHandler';

export default function(io : IO.Server){
    // Global connection (Namespace '/')
    io.on('connection', (socket: IO.Socket) => {
        logger.debug('a user connected to global namespace');
        // registerHandlers(io, socket);
    });

    
    const groupsHandler : GroupsHandler = new GroupsHandler(io);
    // let groupEventHandler = new EventHandleMap();
    // groupEventHandler.eventHandleMapping = {
    //     'getGroups'         : groupsHandler.getGroups,
    //     'getGroup'          : groupsHandler.getGroup,
    //     'createGroup'       : groupsHandler.createGroup,
    //     'leaveGroup'        : groupsHandler.leaveGroup,
    //     'verifyInvite'      : groupsHandler.verifyInvite,
    //     'joinGroup'         : groupsHandler.joinGroup,

    //     'incTimer'          : groupsHandler.incTimer,
    //     'subscribeToTimer'  : groupsHandler.subscribeToTimer,
    // }

    // Add event handler for namespace '/groups'
    io.of('/groups').on('connection', (socket : IO.Socket) => {
        logger.debug('User connected to the "groups" namespace!');
        registerHandlers(io, socket, groupsHandler);
    });
}