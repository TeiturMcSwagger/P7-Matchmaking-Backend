"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
const express = require("express");
const os = require("os");
const logger_1 = require("./common/logger");
const bodyParser = require("body-parser");
const Route_1 = require("./routes/Route");
class App {
    constructor() {
        this.route = new Route_1.Routes();
        this.app = express();
        this.config();
        // Init routes with app
        this.route.routes(this.app);
    }
    listen(p = process.env.PORT) {
        const welcome = port => () => logger_1.default.info(`up and running in ${process.env.NODE_ENV ||
            "development"} @: ${os.hostname()} on port: ${port}}`);
        this.app.listen(p, welcome(p));
        return this.app;
    }
    // Header configs
    config() {
        // Allow "CORS"
        this.app.use(function (req, res, next) {
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
exports.default = App;
//# sourceMappingURL=app.js.map