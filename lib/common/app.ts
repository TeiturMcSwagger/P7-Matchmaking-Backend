// lib/app.ts
import * as express from "express";
import * as os from "os";
import logger from "./logger";
import * as morgan from "morgan";
import { Application } from "express";
import "../controllers";
import "reflect-metadata";
import * as bodyParser from "body-parser";
import {
  interfaces,
  InversifyExpressServer,
  TYPE
} from "inversify-express-utils";
import { iocContainer } from "./inversify.config";
import * as swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../../build/routes";

export default class App {
  public app: express.Application;
  private server: InversifyExpressServer;

  constructor() {
    this.app = express();
    this.app.use(this.allowCors);
    this.server = new InversifyExpressServer(
      iocContainer,
      null,
      null,
      this.app,
      null,
      false
    );

    this.app = this.server
      .setConfig(this.configFunc)
      .setErrorConfig(this.errorConfigFunc)
      .build();
  }

  private allowCors(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, apikey, x-access-token"
    );
    next();
  }

  //Is used by inversify to setup our "default" logger (morgan) and swagger
  configFunc(app: express.Application): void {
    // support application/json type post data
    app.use(bodyParser.json());

    //support application/x-www-form-urlencoded post data
    app.use(bodyParser.urlencoded({ extended: true }));

    RegisterRoutes(app);
    var logger = morgan("combined");
    app.use(logger);

    const swaggerDocument = require("../../build/swagger/swagger.json");

    app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
}
