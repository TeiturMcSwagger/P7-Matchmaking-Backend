"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exampleController_1 = require("../controllers/example/exampleController");
const groupController_1 = require("../controllers/groups/groupController");
const userController_1 = require("../controllers/users/userController");
class Routes {
    constructor() {
        this.ctrlFunc = new exampleController_1.ExampleController();
        this.groupController = new groupController_1.GroupController();
        this.userController = new userController_1.UserController();
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
        // Routes data to the groupController
        app.route("/groups/leave")
            .post(this.groupController.leaveGroup);
        app.route("/groups/join")
            .post(this.groupController.joinGroup);
        app.route("/groups/:group_id")
            .get(this.groupController.getGroup);
        // Routes data to the userController
        app.route("/users")
            .post(this.userController.getUserById);
        app.route("/users/create")
            .post(this.userController.createUser);
        // Group invite link
        app.route("/groups/:group_id/:invite_id")
            .get(this.groupController.verifyInvite);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=Route.js.map