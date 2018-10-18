"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
const express = require("express");
const bodyParser = require("body-parser");
const exampleRoutes_1 = require("./routes/example/exampleRoutes");
class App {
    constructor() {
        this.route = new exampleRoutes_1.Routes();
        this.app = express();
        this.config();
        // Init routes with app
        this.route.routes(this.app);
    }
    // Header configs
    config() {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map