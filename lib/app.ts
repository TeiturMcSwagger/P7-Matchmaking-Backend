// lib/app.ts
import * as express from "express";
import * as os from "os";
import logger from './common/logger'
import {Application} from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/Route";

export default class App {
  public app: express.Application;
  public route: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();

    // Init routes with app
    this.route.routes(this.app);
  }

  listen(p: string | number = process.env.PORT): Application {
    const welcome = port => () =>
      logger.info(
        `up and running in ${process.env.NODE_ENV ||
          "development"} @: ${os.hostname()} on port: ${port}}`
      );
    this.app.listen(p, welcome(p));
    return this.app;
  }

  // Header configs
  private config(): void {
    // Allow "CORS"
    this.app.use(function(req, res, next) {
      // HEADERS
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
      res.header("Access-Control-Allow-Headers", "Content-Type");
      next();
    });

    // support application/json type post data
    this.app.use(bodyParser.json());

    //support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

