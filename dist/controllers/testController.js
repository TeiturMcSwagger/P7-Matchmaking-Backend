"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const testModel_1 = require("../model/testModel");
mongoose.connect('mongodb://138.68.83.112/test', { useNewUrlParser: true });
const testModel = mongoose.model("books", testModel_1.TestSchema);
class TestController {
    testRouteFunction(req, res) {
        testModel.find({}, (err, data) => {
            console.log(data);
            res.json(data);
        });
        //res.send({"message": "Hello World!", "status": 200});
    }
}
exports.TestController = TestController;
//# sourceMappingURL=testController.js.map