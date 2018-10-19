import {Request, Response} from "express";

import * as ExampleServices from "../../services/example/exampleService";

export class ExampleController {

    constructor(){

    }

    public async exampleRouteFunction(req : Request, res : Response) {
        let bookService = new ExampleServices.ExampleService();
        res.json(await bookService.getAllBooks());
    }
}