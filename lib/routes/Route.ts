import {ExampleController} from "../controllers/example/exampleController";

export class Routes {
    private ctrlFunc = new ExampleController();

    public routes(app) {
        // Hello World example route, with controller
        app.route("/")
            .get(this.ctrlFunc.exampleRouteFunction)
            .post(this.ctrlFunc.exampleRouteFunction);
    }
}