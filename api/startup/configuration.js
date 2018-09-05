const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');

//set DEBUG=app:startup
//set NODE_ENV=production
//set mynoderest_jwtPrivateKey=
const debug = require('debug')('app:startup');

module.exports = function(app, express){

    app.use(express.static('public'));
      
    debug(`Node Env ${process.env.NODE_ENV}`);
    debug(`app env: ${app.get('env')}`)
    app.use(helmet());
    if(app.get('env')==='development'){
        app.use(morgan('tiny'));
    }

 
    if(!config.get("jwtPrivateKey")){
        debug(`########## JwtPrivatreKey is not set #############`);
        process.exit(1);
    }

    debug(`Application name ${config.name}`);
  
    app.use(express.json());

    app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
            abortOnLimit: true
        }));
   
}