/* Debugging environment */
import './common/env';
import "reflect-metadata";
import "./controllers/example/exampleController"


import App from './common/app';

const port = process.env.PORT;

new App().listen(port);
