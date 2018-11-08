import { IGroup } from "models/groupModel";
import { IUser } from "models/userModel";

export interface BookService {
  getAllBooks(): any;
}
export interface GroupService {
    updateGroupDiscordChannels(channels : string[], groupId : string);
    getGroups(): Promise<IGroup[]>;
    createGroup(group: any): Promise<IGroup>;
    getGroup(group_id : String) : Promise<IGroup>;
    getGroupsByUserId(user_id : String) : Promise<IGroup[]>;
    getFittingGroups(size: number, game: string): Promise<IGroup[]>;
    leaveGroup(group_id : String, user_id : String) : any;
    joinGroup(group_id : String, user_id : String) : any;
    removeGroup(group_id: string);
}

export interface UserService {
    getUserById(id : string) : Promise<IUser>
    getAllUsers() : Promise<IUser[]>,
    createUser(name: string, discordId : string) : any ,
    getUserByDiscordId(discord_id : string) : any
}

export const TYPES = {
    BookService: Symbol.for("BookService"),
    UserService: Symbol.for("UserService"),
    GroupService: Symbol.for("GroupService")
};