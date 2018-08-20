
const winston = require('winston');

process.on('unhandledRejection', (ex) => {
  throw ex;
});

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({handleExceptions: true}),
      new winston.transports.File({ filename: 'logfile.log',handleExceptions: true})
    ],
    exitOnError: false
  });



module.exports = logger;