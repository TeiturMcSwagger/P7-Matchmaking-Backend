import * as IO from 'socket.io';
import logger from './logger';
import EventHandleMap from './eventHandleMap';
import '../handlers/groupsHandler'
import GroupsHandler from '../handlers/groupsHandler';
import { GroupSchema } from 'models/groupModel';

export default function(io : IO.Server, socket : IO.Socket, eventHandleMap : EventHandleMap){
    // Core aka Kåre
    const map = eventHandleMap.eventHandleMapping;
    for (var property in map) {
        if (map.hasOwnProperty(property)) {
            // logger.debug('User subscribed to event ' + property);
            socket.on(property, (args : any) => map[property](socket, args));
        }
    }  
}
