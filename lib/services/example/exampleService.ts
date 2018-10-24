import * as mongoose from "mongoose";

import {ExampleSchema} from "../../models/example/exampleModel";
import { GroupSchema } from "../../models/groups/groupModel";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

export class ExampleService {
    private booksModel;

    constructor(){
        this.booksModel = mongoose.model("books", ExampleSchema);
    }

    public async getAllBooks() {
        return await this.booksModel.find({}, (err, data) => {
            return data;
        });
    }
}
