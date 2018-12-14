import * as IO from 'socket.io';
import logger from './logger';
import registerHandlers from './registerHandlers';
import EventHandleMap from './eventHandleMap';
import GroupsHandler from '../handlers/groupsHandler';
import QueueHandler from '../handlers/queueHandler';
import App from './app';

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
    io.of('/groups').on('connection', (socket : IO.Socket) => {
        logger.debug('User connected to the "groups" namespace!');
        registerHandlers(io, socket, GroupsHandler);
    });
    io.of('/queues').on('connection', (socket : IO.Socket) => {
        logger.debug('User connected to the "queues" namespace!');
        console.log(socket.handshake.query);
        App.SocketIdMap[socket.handshake.query.id] = socket;
        registerHandlers(io, socket, QueueHandler);
    });
}