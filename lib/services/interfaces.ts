import { Group } from "models/groupModel";
import { IUser } from "models/userModel";

export interface BookService {
  getAllBooks(): any;
}
export interface GroupService {
    getGroups(): Promise<Group[]>;
    getFittingGroups(size: number, game: string) : Promise<Group[]>;
    createGroup(group: any): Promise<Group>;
    getGroup(group_id : String) : Promise<Group>;

    leaveGroup(group_id : String, user_id : String) : any;
    joinGroup(group_id : String, user_id : String) : any;
}

export interface UserService {
    getUserById(id : string) : any
    getAllUsers()
    createUser(name: string, discordId: string) : Promise<IUser>
}

const TYPES = {
    BookService: Symbol.for("BookService"),
    UserService: Symbol.for("UserService"),
    GroupService: Symbol.for("GroupService"),
};

export { TYPES };
