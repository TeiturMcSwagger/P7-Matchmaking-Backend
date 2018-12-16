import * as io from 'socket.io';
import logger from '../common/logger';
import { provide } from 'inversify-binding-decorators';
import { provideSingleton } from '../common/inversify.config';

@provideSingleton(Handler)
export default class Handler{
    protected IO : io.Server;
    protected Socket : io.Socket;

    constructor(IOServer : io.Server, IOSocket : io.Socket){
        this.IO = IOServer;
        this.Socket = IOSocket;
    }

    protected emitter(namespace : io.Namespace, event : string, args : any){
        // logging, validation?, etc
        namespace.emit(event, args);
    }
}