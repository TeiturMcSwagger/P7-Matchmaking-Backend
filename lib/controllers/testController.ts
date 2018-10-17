import {Request, Response} from "express";

import * as mongoose from "mongoose";
import {TestSchema} from "../model/testModel";

mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });

const testModel = mongoose.model("books", TestSchema);

export class TestController {
    public testRouteFunction(req : Request, res : Response): void{
        testModel.find({}, (err, data) => {
            console.log(data);
            res.json(data);
        });
    }
}