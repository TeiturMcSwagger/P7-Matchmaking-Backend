import {Request, Response} from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam } from "inversify-express-utils";
import { inject, injectable } from "inversify";

import {ExampleService} from "../../services/example/exampleService";
import {BookService, TYPES} from "../../services/interfaces"

@controller("/")
export class ExampleController implements interfaces.Controller {

    constructor( @inject(TYPES.BookService) private bookService: BookService ) {}

    @httpGet("/")
    public async exampleRouteFunction(req : Request, res : Response) {
        let service = new ExampleService();
        res.json(await service.getAllBooks());
    }
}
