import { IGroup, IMongoGroup } from "models/groupModel";
import { IUser } from "models/userModel";
import { Server } from 'socket.io';


export interface BookService {
    getAllBooks(): any;
}

export interface GroupService {
    getGroups(): Promise<IGroup[]>;
    getFittingGroups(size: number, game: string): Promise<IGroup[]>;
    createGroup(group: any): Promise<IMongoGroup>;
    getGroup(group_id: String): Promise<IMongoGroup>;
    leaveGroup(group_id: String, user_id: String): Promise<IMongoGroup>;
    joinGroup(group_id: String, user_id: String): Promise<IMongoGroup>;
    updateVisibility(group: IGroup): Promise<IMongoGroup>;
    updateGroupDiscordChannels(channels: string[], groupId: string): Promise<IMongoGroup>;
    updateGroupUsers(group_id: string, newUsers: string[]): Promise<IMongoGroup>;
    getGroupsByUserId(user_id: String): Promise<IMongoGroup[]>;
    removeGroup(group_id: string): Promise<IMongoGroup>;
}

export interface UserService {
    getUserById(id: string): any
    getAllUsers()
    createUser(name: string, discordId: string): Promise<IUser>
}

export interface IIOService {
    IO: Server;
}

export interface UserService {
    getUserById(id: string): Promise<IUser>
    getAllUsers(): Promise<IUser[]>,
    createUser(name: string, discordId: string): IUser,
    getUserByDiscordId(discord_id: string): any
}

export const TYPES = {
    BookService: Symbol.for("BookService"),
    UserService: Symbol.for("UserService"),
    GroupService: Symbol.for("GroupService"),
    IIOService: Symbol.for("IIOService"),
};