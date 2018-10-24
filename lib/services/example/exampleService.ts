import * as mongoose from "mongoose";
import { injectable, inject } from "inversify";
import { BookService } from "../interfaces";
import { ExampleSchema } from "../../models/example/exampleModel";

mongoose.connect(
  "mongodb://138.68.83.112/test",
  { useNewUrlParser: true }
);

@injectable()
export class ExampleService implements BookService {
  private booksModel;

  constructor() {
    this.booksModel = mongoose.model("books", ExampleSchema);
  }
  public async getAllBooks() {
    return "example service - getAllBooks";
    return await this.booksModel.find({}, (err, data) => {
      return data;
    });
  }
}
