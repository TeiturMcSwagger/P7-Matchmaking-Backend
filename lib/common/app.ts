// lib/app.ts
import * as express from "express";
import * as os from "os";
import logger from "./logger";
import * as morgan from "morgan";
import { Application } from "express";
import * as swagger from "swagger-express-ts";
import { SwaggerDefinitionConstant } from "swagger-express-ts";
import "../controllers/exampleController";
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
  private server: InversifyExpressServer;

  constructor() {
    this.app = express();
    this.config();
    this.server = new InversifyExpressServer(
      AppContainer,
      null,
      null,
      this.app
    );

    this.app = this.server
      .setConfig(this.configFunc)
      .setErrorConfig(this.errorConfigFunc)
      .build();
  }
  //Is used by inversify to setup our "default" logger (morgan) and swagger
  configFunc(app: any): void {
    var logger = morgan("combined");
    app.use(logger);

    app.use(
      "/api-docs/swagger/assets",
      express.static("node_modules/swagger-ui-dist")
    );
    app.use("/swagger", express.static("lib/common/swagger"));
    app.use(
      swagger.express({
        definition: {
          info: {
            title: "Matchmaking P7",
            version: "1.0"
          }
          // Models can be defined here
        }
      })
    );
  }
  //Prints error to input (dev -> terminal, prod -> file)
  errorConfigFunc(app: any): void {
    app.use(
      (
        err: Error,
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
      ) => {
        logger.info(err.stack);
        response.status(500).send("Something went wrong");
      }
    );
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
