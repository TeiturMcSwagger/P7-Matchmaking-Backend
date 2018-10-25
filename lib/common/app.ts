// lib/app.ts
import * as express from "express";
import * as os from "os";
import logger from "./logger";
import { Application } from "express";
import "../controllers/exampleController"
import "reflect-metadata";
import * as bodyParser from "body-parser";
import {
  interfaces,
  InversifyExpressServer,
  TYPE
} from "inversify-express-utils";
import { AppContainer } from "./inversify.config";

export default class App {
  public app: express.Application;
  private server : InversifyExpressServer ;
  constructor() {
    this.app = express();
    this.config();
    this.server = new InversifyExpressServer(AppContainer, null, null, this.app);
    this.app = this.server.build();

    // Init routes with app
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
