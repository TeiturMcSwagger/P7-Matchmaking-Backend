import { IGroup } from "models/groupModel";
import {DocumentQuery} from "mongoose";
import * as io from 'socket.io';

export interface BookService {
  getAllBooks(): any;
}

export interface GroupService {
    getGroups(): Promise<IGroup[]>;
    createGroup(group: any): Promise<IGroup>;
    getGroup(group_id : String) : Promise<IGroup>;
    leaveGroup(group_id : String, user_id : String) : any;
    joinGroup(group_id : String, user_id : String) : DocumentQuery<any, any>;
}

export interface UserService {
    getUserById(id : string) : any
    getAllUsers()
    createUser(name: string) : any
}

export interface IIOService {
    IO : io.Server;
}

const TYPES = {
    BookService: Symbol.for("BookService"),
    UserService: Symbol.for("UserService"),
    GroupService: Symbol.for("GroupService"),
    IIOService : Symbol.for("IIOService"),
};

export { TYPES };
