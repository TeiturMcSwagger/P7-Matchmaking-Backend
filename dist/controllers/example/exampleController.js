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
const exampleService_1 = require("../../services/example/exampleService");
class ExampleController {
    constructor() {
        this.bookService = new exampleService_1.ExampleService();
        console.log(this.bookService);
    }
    exampleRouteFunction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let books = new exampleService_1.ExampleService();
            res.json(yield books.getAllBooks());
            console.log(yield this.bookService.getAllBooks());
        });
    }
}
exports.ExampleController = ExampleController;
//# sourceMappingURL=exampleController.js.map