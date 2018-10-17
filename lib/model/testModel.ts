import * as mongoose from "mongoose";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const TestSchema = new Schema({
    element: {
        type: String,
        required: "Enter element1"
    },
    note: {
        type: String,
        required: "Enter testVar2"
    }
});

export class TestModel {
    private booksModel;

    constructor(){
        this.booksModel = mongoose.model("books", TestSchema);
    }

    public async getAllBooks() {
        return await this.booksModel.find({}, (err, data) => {
            console.log(data);
            return data;
        });
    }
}
