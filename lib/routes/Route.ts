import {ExampleController} from "../controllers/example/exampleController";

import {GroupController} from "../controllers/groups/groupController"

export class Routes {
    private ctrlFunc: ExampleController;
    private groupController: GroupController;

    constructor(){
        this.ctrlFunc = new ExampleController();
        this.groupController = new GroupController();
    }

    public routes(app) {
        // Hello World example route, with controller
        app.route("/")
            .get(this.ctrlFunc.exampleRouteFunction)
            .post(this.ctrlFunc.exampleRouteFunction);

        // Groups route
        app.route("/groups")
            .get(this.groupController.getGroups)
            .post(this.groupController.createGroup);

        app.route("/groups/:group_id")
            .get(this.groupController.getGroup);

        // Group invite link
        app.route("/groups/:group_id/:invite_id")
            .get(this.groupController.verifyInvite);
    }
}