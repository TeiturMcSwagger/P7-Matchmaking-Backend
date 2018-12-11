import * as IO from 'socket.io';
import logger from './logger';
import '../handlers/groupsHandler';
import '../handlers/queueHandler';
import Handler from '../handlers/handler';

export default function(io : IO.Server, socket : IO.Socket, handlerType : typeof Handler){
    // Core aka Kåre
    const handler = new handlerType(io, socket);
    const properties = Object.getOwnPropertyNames(handler);
    for (var propertyindex in properties){
        const property = properties[propertyindex];
        if (!handler.hasOwnProperty(property)) continue;
        if (typeof handler[property] === 'function' && !property.startsWith('emit')){
            socket.on(property, async (args : any, ackFn? : (args : any) => void) => { 
                // Here we can add stuff to be done BEFORE each event is invoked
                // E.g. log the event being handled etc for statistics

                // Invoke the actual handler for this event
                // provide it with the current socket and propegate the args
                const result = await handler[property](args); 

                // If provided, invoke the acknowledgement function with the result
                if(ackFn){
                    ackFn(result);
                }

                // Likewise, we can add stuff to be done AFTER an event has been handled here
            });
        }
    }
}
