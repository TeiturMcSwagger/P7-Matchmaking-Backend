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


    // map namespaces to handler types
    // run through the mappings and create register the handles generically
    // {}
    // {'/groups' : GroupsHandler},
    // {'/users' : UsersHandler}

    // Add event handler for namespace '/groups'
    io.of('/api/groups').on('connection', (socket : IO.Socket) => {
        logger.debug('User connected to the "groups" namespace!');
        registerHandlers(io, socket, GroupsHandler);
    });
}