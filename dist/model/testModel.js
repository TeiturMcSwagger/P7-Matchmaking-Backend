"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
class TestModel {
    constructor() {
        this.booksModel = mongoose.model("books", TestSchema);
    }
    getAllBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Trying to find books`);
            this.booksModel.find({}, (err, data) => __awaiter(this, void 0, void 0, function* () {
                console.log(data);
                return data;
            }));
        });
    }
}
exports.TestModel = TestModel;
//# sourceMappingURL=testModel.js.map