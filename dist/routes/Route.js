"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exampleController_1 = require("../controllers/example/exampleController");
const groupController_1 = require("../controllers/groups/groupController");
class Routes {
    constructor() {
        this.ctrlFunc = new exampleController_1.ExampleController();
        this.groupController = new groupController_1.GroupController();
    }
    routes(app) {
        // Hello World example route, with controller
        app.route("/")
            .get(this.ctrlFunc.exampleRouteFunction)
            .post(this.ctrlFunc.exampleRouteFunction);
        // Groups route
        app.route("/groups")
            .get(this.groupController.getGroups)
            .post(this.groupController.createGroup);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=Route.js.map