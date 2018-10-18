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
            .get(this.groupController.getGroups);
    }
}