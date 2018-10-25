/* Debugging environment */
import './common/env';
import "reflect-metadata";
import "./controllers/exampleController"
import "./controllers/groupController"
import "./controllers/userController"


import App from './common/app';

const port = process.env.PORT;

new App().listen(port);
