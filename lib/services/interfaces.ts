import { IGroup } from "models/groupModel";
import { IUser } from "models/userModel";

export interface BookService {
  getAllBooks(): any;
}

export interface ServiceResponse<T> {
    result : T,
    exception : any
}

export interface GroupService {
    getGroups(): Promise<ServiceResponse<IGroup[]>>;
    createGroup(group: any): Promise<ServiceResponse<IGroup>>;
    getGroup(group_id : String) : Promise<ServiceResponse<IGroup>>;
    leaveGroup(group_id : String, user_id : String) : Promise<ServiceResponse<IGroup>>;
    joinGroup(group_id : String, user_id : String) : Promise<ServiceResponse<IGroup>>;
}

export interface UserService {
    getUserById(id : string) : Promise<ServiceResponse<IUser>>;
    getAllUsers() : Promise<ServiceResponse<IUser[]>>;
    createUser(name: string) : Promise<ServiceResponse<IUser>>;
}

const TYPES = {
    BookService: Symbol.for("BookService"),
    UserService: Symbol.for("UserService"),
    GroupService: Symbol.for("GroupService"),
};

export { TYPES };
