import * as testController from "../controllers/testController";

export class Routes {
    private ctrlFunc = new testController.TestController();

    public routes(app) : void {
        // Hello World example route, with controller
        app.route("/")
            .get(this.ctrlFunc.testRouteFunction)
            .post(this.ctrlFunc.testRouteFunction);
    }
}