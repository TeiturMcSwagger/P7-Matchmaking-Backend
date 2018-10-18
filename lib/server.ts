/* Debugging environment */
import './common/env';

import App from './app';

const port = process.env.PORT;

new App().listen(port);
