"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exampleController = require("../../controllers/example/exampleController");
class Routes {
    constructor() {
        this.ctrlFunc = new exampleController.ExampleController();
    }
    routes(app) {
        // Hello World example route, with controller
        app.route("/")
            .get(this.ctrlFunc.exampleRouteFunction)
            .post(this.ctrlFunc.exampleRouteFunction);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=exampleRoutes.js.map