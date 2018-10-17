import {Request, Response} from "express";

import {TestModel} from "../model/exampleModel";

export class TestController {
    public async testRouteFunction(req : Request, res : Response){
        let booksModel = new TestModel();
        res.json(await booksModel.getAllBooks())
    }
}