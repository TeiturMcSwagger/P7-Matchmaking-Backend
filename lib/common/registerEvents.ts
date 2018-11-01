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
        // 'getGroups' : null,
        // 'getGroup' : null,
        'subscribeToTimer' : groupsHandler.subscribeToTimer,
        'incTimer' : groupsHandler.incTimer
    }
    io.of('/groups').on('connection', (socket : IO.Socket) => {
        logger.debug('User connected to the "groups" namespace!');
        registerHandlers(io, socket, groupEventHandler);
    });
}