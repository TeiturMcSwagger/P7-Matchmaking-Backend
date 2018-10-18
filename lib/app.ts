// lib/app.ts
import * as express from "express";
import * as bodyParser from "body-parser";
import {Routes} from "./routes/Route";

class App {
    public app: express.Application;
    public route: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        
        // Init routes with app
        this.route.routes(this.app);
    }

    // Header configs
    private config(): void{
        // Headers
        this.app.use(function(req, res, next) { 
            // HEADERS
            res.header('Access-Control-Allow-Origin', "*"); 
            res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE'); 
            res.header('Access-Control-Allow-Headers', 'Content-Type'); 
            next();
        });

        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}

export default new App().app;