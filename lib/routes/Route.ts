import {ExampleController} from "../controllers/example/exampleController";
import {GroupController} from "../controllers/groups/groupController"
import {UserController} from "../controllers/users/userController";

export class Routes {
    private ctrlFunc: ExampleController;
    private groupController: GroupController;
    private userController: UserController;

    constructor(){
        this.ctrlFunc = new ExampleController();
        this.groupController = new GroupController();
        this.userController = new UserController();
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

        // Routes data to the groupController
        app.route("/groups/leave")
            .post(this.groupController.leaveGroup);

        app.route("/groups/join")
            .post(this.groupController.joinGroup);

        // Routes data to the userController
        app.route("/users")
            .post(this.userController.getUserById);
        app.route("/users/create")
            .post(this.userController.createUser);
    }
}