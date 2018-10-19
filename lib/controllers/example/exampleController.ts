import {Request, Response} from "express";


import {ExampleService} from "../../services/example/exampleService";

export class ExampleController {

    constructor(){
    }

    public async exampleRouteFunction(req : Request, res : Response) {
        let bookService = new ExampleService();
        res.json(await bookService.getAllBooks());
    }
}