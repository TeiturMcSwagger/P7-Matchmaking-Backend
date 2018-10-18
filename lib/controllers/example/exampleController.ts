import {Request, Response} from "express";

import {ExampleService} from "../../services/example/exampleService";

export class ExampleController {
    private bookService: ExampleService;

    constructor(){
        this.bookService = new ExampleService();
    }

    public async exampleRouteFunction(req : Request, res : Response) {
        let books = new ExampleService();
        res.json(await books.getAllBooks());
        console.log(await this.bookService.getAllBooks());
    }
}