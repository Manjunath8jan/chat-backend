const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const fs = require('fs')
const app = express();
const http = require('http');
const appConfig = require('./config/appConfig');
const logger = require('./app/libs/loggerLib')
const routeLoggerMidlleware = require('./app/middlewares/routeLogger')
const globalErrorMiddleware = require('./app/middlewares/appErrorHandler')
const mongoose = require('mongoose')
const morgan = require('morgan')

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routeLoggerMiddleWare.logIp);
app.use(globalErrorMiddleware.globalErrorHandler);

app.use(express.static(path.join(__dirname, 'client')));

const modelsPath = './app/models';
const controllerspath = './app/controlers';
const libsPath = './app/libs';
const middlewaresPath = './app/middlewares';
const routesPath = './app/routes';

app.all('*', function(req, res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE")
    next();
});

fs.readdirSync(modelspath).forEach(function (file) {
    if (~file.indexOf('.js')) require(modelspath +'/'+ file)
});

fs.readdirSync(routesPath).forEach(function (file){
    if(~file.indexOf('.js')){
        let route = require(routesPath+ '/' + file);
        route.setRouter(app);
    }
})

app.use(globalErrorMiddleware.globalNotFoundHandler);

const server = http.createServer(app);

console.log(appConfig);
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error){
    if(error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen ', 'serverOnErrorhandler', 10)
        throw error;
    }

    switch (error.code) {
        case 'EACCS':
            logger.error(error.code + ':elavated privalages required', 'serverOnErrorhandler', 10);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error(error.code+ ':port is already in use', 'serverOnErrorhandler', 10);
            process.exit(1);
            break;
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10);
            throw error; 
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ?'pipe' + addr
        : 'port' + addr.port;
    ('Listening on'+bind);
    logger.info('server listening on port' + addr.port, 'serverOnListeningHandler', 10);
    let db = mongoose.connect(appConfig.db.uri, { useMongoClient: true });
}

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);

});


mongoose.connection.on('error', function(err){
    console.log('database connection error');
    console.log(err)
    console.log(err, 'mongoose connection on error handler', 10)
});

mongoose.connection.on('open', function(err){
    if(err){
        console.log("database error");
        console.log(err);
        logger.error(err, 'mongoose connection open handler', 10)
    } else {
        console.log("database connection oppen success");
        logger.info("database connection open", 'database connection open handler', 10)
    }
});

module.exports = app;