const mongoose = require('mongoose')
const shortid = require('shortid')
const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib')
const validateInput = require('./../libs/paramsValidationLib')
const check = require('./../libs/checkLib')
const passwordLib = require('./../libs/generatePasswordLib')
const token = require('./../libs/tokenLib')

const UserModel = mongoose.model('User')

let signUpFunction = (req,res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if(req.body.email) {
                if(!validateInput.Email(req.body.email)){
                    let apiResponse = response.generate(true, 'Email does not meet the requirement', 400, null)
                    reject(apiResponse)
                }else if(check.isEmpty(req.body.password)){
                    let apiResponse = response.generate(true, '"password" parameter is missing', 400, null)
                    reject(apiResponse)
                }else{
                    resolve(req)
                }
            }else{
                logger.error('field missing during user creation', 'UserController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email })
                .exec((err, retrivedUserDetails) => {
                    if(err) {
                        logger.error(err.message, 'UserController: createUser', 10)
                        let apiResponse = response.generate(true, 'failed to create user', 500, null)
                        reject(apiResponse)
                    }else if(check.isEmpty(retrivedUserDetails)){
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastname: req.body.lastname || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if(err){
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, "Failed to create new user", 500, null)
                                reject(apiResponse)
                            }else{
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('user cannot be created. user already present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already present with this email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiresponse = response.generate(false, 'User Created', 200, resolve)
            res.send(apiresponse)
        })
            .catch((err) => {
            console.log(err);
            res.send(err);
        })
}

let loginFunction = (req, res) => {

    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if(req.body.email){
                console.log("req body email is there");
                console.log(req.body)
                UserModel.findOne({ email: req.body.emai}, (err, userDetails) => {
                    if(err){
                        console.log(err)
                        logger.error('failed to retrive user data', 'userController: findUser()', 10)
                        let apiResponse = response.generate(true, 'Failed to find user details', 500, null)
                        reject(apiResponse)
                    }else if(check.isEmpty(userDetails)){
                        logger.error('No user found', 'userController: finsUser()', 10)
                        let apiresponse = response.generate(true, 'failed to find user details', 500, null)
                        reject(apiresponse)
                    }else{
                        logger.info('User found', 'userController: findUser()', 10)
                        resolve(userDetails)
                    }
                });
            } else {
                let apiresponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiresponse)
                }

        })
    }

    let validatePassword = (retriveduserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comaparePassword(req.body.password, retrivedUserDetails.password, (err, isMatch) =>{
                if(err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiresponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiresponse)
                }else if(isMatch){
                    let retrivedUserDetailsObj = retriveduserDetails.toObject()
                    delete retrivedUserDetailsObj.password
                    delete retrivedUserDetailsObj._id
                    delete retrivedUserDetailsObj.__v
                    delete retrivedUserDetailsObj.createdOn
                    delete retrivedUserDetailsObj.modifiedOn
                    resolve(retrivedUserDetailsObj)
                }else {
                    logger.info('Login failed due to invalid password', 'userController: validatePassword()', 10)
                    let apiresponse = response.generate(true, 'wrong pssword.login failed', 400, null)
                    reject(apiresponse)
                }
            })
        })
    }

    let generateToken  = (userDetails) => {

        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if(err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To generate token', 500, null)
                    reject(apiResponse)
                }else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })

    }

    findUser(req, res)
        .then(validatePassword)
        .then(generateToken)
        .then((resolve) => {
            let apiResponse = response.generate(false, 'login successful', 200, resolve)
            res.status(200)
            res.send(apiresponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err)
            console.log(err.status)
            res.send(err)
        })
}

let logOut = (req, res) => {

}

module.exports = {
    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logOut
}