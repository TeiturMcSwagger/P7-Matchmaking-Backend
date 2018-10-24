export interface BookService {
  getAllBooks(): any;
}
const TYPES = {
    BookService: Symbol.for("BookService"),
};

export { TYPES };
