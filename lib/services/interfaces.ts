export interface BookService {
  getAllBooks(): any;
}
export interface GroupService {
    getGroups(): any;
    createGroup(group: any): Promise<any>;
    updateGroupDiscordChannels(channels : string[], groupId : string);
    getGroup(group_id : String) : any;
    leaveGroup(group_id : String, user_id : String) : any;
    joinGroup(group_id : String, user_id : String) : any;
}

export interface UserService {
    getUserById(id : string) : any,
    createUser(name: string, discordId : string) : any ,
    getUsers() : any
}

export const TYPES = {
    BookService: Symbol.for("BookService"),
    GroupService: Symbol.for("GroupService"),
    UserService: Symbol.for("UserService"),
};