/* Debugging environment */
import "./common/env";
import "reflect-metadata";

import App from "./common/app";

const port = process.env.PORT;

const server = new App(port);
server.registerEvents();
