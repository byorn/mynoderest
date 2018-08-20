const express = require('express');
const app = express();
require('express-async-errors');
const port = process.env.PORT || 5000;


const logger = require('./api/startup/logging');
require('./api/startup/configuration')(app,express);
require('./api/startup/db')();
require('./api/routes/Routes')(app); 


const server = app.listen(port);
logger.info(`Byorns MyNODEREst Server Started now: ${port}`);
module.exports = server;