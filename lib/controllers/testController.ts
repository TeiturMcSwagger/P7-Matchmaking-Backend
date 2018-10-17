import {Request, Response} from "express";

import * as mongoose from "mongoose";
import {TestModel} from "../model/testModel";

export class TestController {
    public async testRouteFunction(req : Request, res : Response){
        let booksModel = new TestModel();
        res.json(await booksModel.getAllBooks())
    }
}