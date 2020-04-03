const response = require('./../libs/responseLib')

let errorHandler = (err, req, res, next) => {
    console.log("application error handler called");
    console.log(err)
     
    let apiresponse = response.generate(true, 'some error occurred at global level', 500, null)
    res.send(apiResponse)
}

let notfoundHandler = (req, res, next) => {
    console.log("global not found handler called");
    let apiResponse = response.generate(true, 'Route not found in the application', 404, null)
    res.status(404).send(apiResponse)
}

module.exports = {
    globalErrorHandler: errorHandler,
    globalNotFoundHandler: notfoundHandler
}