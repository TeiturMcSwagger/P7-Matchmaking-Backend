import * as IO from 'socket.io';
import logger from './logger';
import registerHandlers from './registerHandlers';
import EventHandleMap from './eventHandleMap';
import GroupsHandler from '../handlers/groupsHandler';

export default function(io : IO.Server){
    // Global connection (Namespace '/')
    io.on('connection', (socket: IO.Socket) => {
        logger.debug('a user connected');
        // registerHandlers(io, socket);
    });

    // Add event handler for namespace '/groups'
    const groupsHandler = new GroupsHandler(io);
    let groupEventHandler = new EventHandleMap();
    groupEventHandler.eventHandleMapping = {
        'getGroups' : groupsHandler.getGroups,
        'getGroup' : groupsHandler.getGroup,
        'createGroup' : groupsHandler.createGroup,
        'joinGroup' : groupsHandler.joinGroup,
        'leaveGroup' : groupsHandler.leaveGroup,
        'verifyInvite' : groupsHandler.verifyInvite,

        
        'subscribeToTimer' : groupsHandler.subscribeToTimer,
        'incTimer' : groupsHandler.incTimer
    }
    io.of('/groups').on('connection', (socket : IO.Socket) => {
        logger.debug('User connected to the "groups" namespace!');
        // logger.error('Length: ' + Object.keys(io.sockets.sockets).length);
        registerHandlers(io, socket, groupEventHandler);
    });
}