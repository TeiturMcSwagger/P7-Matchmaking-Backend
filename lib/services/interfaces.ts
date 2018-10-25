export interface BookService {
  getAllBooks(): any;
}
export interface GroupService {
    getGroups(): any;
    createGroup(group: any): Promise<any>;
    getGroup(group_id : String) : any;
    leaveGroup(group_id : String, user_id : String) : any;
    joinGroup(group_id : String, user_id : String) : any;
}

export interface UserService {
    getUserById(id : string) : any,
    createUser(name: string) : any
}

const TYPES = {
    BookService: Symbol.for("BookService"),
    GroupService: Symbol.for("GroupService"),
    UserService: Symbol.for("UserService")
};

export { TYPES };
