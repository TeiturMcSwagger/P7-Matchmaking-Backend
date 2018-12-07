// lib/app.ts
import * as express from "express";
import * as os from "os";
import { ApiError } from "../controllers/ErrorHandler";
import { ValidateError } from "tsoa";
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
import { iocContainer, provideSingleton } from "./inversify.config";
import * as swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../../build/routes";
import * as io from 'socket.io';
import * as HTTP from 'http';
import registerEvents from "./registerEvents";
import { IIOService, TYPES } from '../services/interfaces';
import { DiscordController, GroupController } from "../controllers";

@provideSingleton(TYPES.IIOService)
export default class App implements IIOService {
    public app: express.Application;
    private server: InversifyExpressServer;
    public IO: io.Server;

    constructor(p: string | number = process.env.PORT) {
        this.app = express();
        this.app.use(this.allowCors);
        var discord = iocContainer.get<DiscordController>(DiscordController)
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

        this.IO = io(this.listen(p));

    }

    public registerEvents() {
        registerEvents(this.IO);
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

        app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
                logger.info(request);
                const error = new ApiError({
                    statusCode:
                        err instanceof ApiError ? (err as ApiError).statusCode : 400,
                    name: err.name,
                    message: err.message,
                    fields:
                        err instanceof ValidateError
                            ? (err as ValidateError).fields
                            : { stack: { message: err.stack } }
                });
                logger.info(error);
                response.status(error.statusCode).send(error);
            }
        );
    }

    private listen(p: string | number = process.env.PORT): HTTP.Server {

        if(this.IO !== undefined){this.IO.path('/api')}

        const welcome = port => () =>
            logger.info(
                `up and running in ${process.env.NODE_ENV ||
                "development"} @: ${os.hostname()} on port: ${port}}`
            );

        return this.app.listen(p, welcome(p));
    }
}
