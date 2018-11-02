import * as io from 'socket.io';
import logger from '../common/logger';

export default class Handler{
    protected IO : io.Server;
    protected socket : io.Socket;

    constructor(IOServer : io.Server){
        this.IO = IOServer;
    }
}