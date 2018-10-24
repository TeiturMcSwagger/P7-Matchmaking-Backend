export interface BookService {
  getAllBooks(): any;
}
export interface GroupService {
    getGroups(): any;
    createGroup(group: any): Promise<any>;
    getGroup(group_id : String) : any;
}

const TYPES = {
    BookService: Symbol.for("BookService"),
    GroupService: Symbol.for("GroupService"),
};

export { TYPES };
