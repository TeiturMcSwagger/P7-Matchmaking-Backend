"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testController = require("../controllers/testController");
class Routes {
    constructor() {
        this.ctrlFunc = new testController.TestController();
    }
    routes(app) {
        // Hello World example route, with controller
        app.route("/")
            .get(this.ctrlFunc.testRouteFunction)
            .post(this.ctrlFunc.testRouteFunction);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=testRoutes.js.map