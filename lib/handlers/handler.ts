import * as io from 'socket.io';
import { TYPES, IIOService, GroupService } from '../services/interfaces';
import { inject, lazyInject } from '../common/inversify.config';

export default class Handler{
    // @lazyInject(TYPES.IIOService) 
    // public IIO : IIOService;

    protected IO : io.Server;

    // constructor()
    // {
    //     this.IO= this.IIO.IO;
    // }

    constructor(IOServer : io.Server){
        this.IO = IOServer;
    }
}