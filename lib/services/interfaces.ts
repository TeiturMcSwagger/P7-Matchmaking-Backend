import { Group, IMongoGroup } from "models/groupModel";
import { IUser } from "models/userModel";
import { DocumentQuery } from 'mongoose';
import { Server } from 'socket.io';

export interface BookService {
    getAllBooks(): any;
}

export interface GroupService {
    getGroups(): Promise<Group[]>;
    getFittingGroups(size: number): Promise<Group[]>;
    createGroup(group: any): Promise<IMongoGroup>;
    getGroup(group_id: String): Promise<Group>;

    leaveGroup(group_id: String, user_id: String): any;
    joinGroup(group_id: String, user_id: String): Promise<IMongoGroup>;
    updateVisibility(group: IMongoGroup): Promise<IMongoGroup>;
}

export interface UserService {
    getUserById(id: string): any
    getAllUsers()
    createUser(name: string, discordId: string): Promise<IUser>
}

export interface IIOService {
    IO: Server;
}

const TYPES = {
    BookService: Symbol.for("BookService"),
    UserService: Symbol.for("UserService"),
    GroupService: Symbol.for("GroupService"),
    IIOService: Symbol.for("IIOService"),
};

export { TYPES };
