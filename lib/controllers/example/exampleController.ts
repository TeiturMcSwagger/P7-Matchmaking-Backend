import {Request, Response} from "express";

import {ExampleModel} from "../../services/example/exampleService";

export class ExampleController {
    public async exampleRouteFunction(req : Request, res : Response) {
        let booksModel = new ExampleModel();
        res.json(await booksModel.getAllBooks());
    }
}