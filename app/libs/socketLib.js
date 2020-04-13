const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const tokenLib = require('./tokenLib.js');
const check = require('./checkLib.js');
const response = require('./responselib');

let setServer = (server) => {
    let allOnlineUsers = []
    let io = socketio.listen(server);
    let myIo = io.of('')

    myIo.on('connection', (socket)=> {
        console.log("on connection--emitting verify user");
        socket.emit("verifyUser", "");

        socket.on('set-user',(authToken) => {
            console.log("set-user called")
            tokenLib.verifyClaimWithOutSecret(authToken,(err,user) => {
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token'})
                } else {
                    console.log("user is verified.. setting details");
                    let currentUser = user.data;

                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstname} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);
                    socket.emit(currentUser.userId, "you are online")

                    let userObj = {userId:currentUser.userId, fullName:fullName}
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)
                }
            })
        })

        socket.on('disconnect', ()=> {
            console.log("user is disconnected");
            console.log(socket.userId);
            var removeIndex = allOnlineUsers.map(function(user){return user.userId;}).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex, 1)
            console.log(allOnlineUsers)
        })
    });


}

module.exports = { 
    setServer : setServer
}