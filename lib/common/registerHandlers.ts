import * as IO from 'socket.io';
import logger from './logger';
import EventHandleMap from './eventHandleMap';
import '../handlers/groupsHandler'
import GroupsHandler from '../handlers/groupsHandler';
import { GroupSchema } from 'models/groupModel';
import Handler from '../handlers/handler';

export default function(io : IO.Server, socket : IO.Socket, handler : Handler){
    // Core aka Kåre
    // logger.error(Object.getOwnPropertyNames(handler));
    // logger.error(typeof handler['incTimer']);
    // let map = eventHandleMap.eventHandleMapping;
    const properties = Object.getOwnPropertyNames(handler);
    for (var propertyindex in properties){
        const property = properties[propertyindex];
        if (!handler.hasOwnProperty(property)) continue;
        if (typeof handler[property] === 'function'){
            socket.on(property, (args : any) => { handler[property](socket, args); });
        }
    }


    // for (var property in map) {
    //     // if (map.hasOwnProperty(property)) {
    //         // logger.debug('User subscribed to event111 ' + property);
    //         socket.on(property, (args : any) => {
    //              logger.info('Invoking actual wrapper for event ' + property);
    //             //map[property](socket, args);
    //         });
    //         //socket.on(property, (args : any) => map[property]);
    //     // }
    // }  
}
