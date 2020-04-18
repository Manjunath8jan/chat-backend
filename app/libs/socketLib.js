const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const logger = require('./loggerLib.js');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const redisLib = require('./redisLib.js');

const tokenLib = require('./tokenLib.js');
const check = require('./checkLib.js');
const response = require('./responselib');
const chatModel = mongoose.model('chat');

let setServer = (server) => {
    let allOnlineUsers = []
    let io = socketio.listen(server);
    let myIo = io.of('')

    myIo.on('connection', (socket)=> {
        console.log("on connection--emitting verify user");
        socket.emit("verifyUser", "");
//verify user make as online
        socket.on('set-user',(authToken) => {
            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken,(err,user) => {
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token'})
                } else {
                    console.log("user is verified.. setting details");
                    let currentUser = user.data;

                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    let key = currentUser.userId
                    let value = fullName

                    let setUserOnline = redisLib.setANewOnlineUserInHash('OnlineUsers', key, value, (err, result) => {
                        if(err){
                            console.log('some error occured')
                        } else {
                            redisLib.getAllUsersInAhash('OnlineUsers', (err, result) => {
                                console.log('--- inside getAllUsersInHash function ---')
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log(`${fullName} is onlline`);
                                    socket.room = 'newchatroom'

                                    socket.join(socket.room)
                                    socket.to(socket.room).broadcast.emit('online-user-list', result);
                                }
                            })
                        }
                    })

                }
            })
        })

        socket.on('disconnect', ()=> {
            console.log("user is disconnected");
            console.log(socket.userId);
            // var removeIndex = allOnlineUsers.map(function(user){return user.userId;}).indexOf(socket.userId);
            // allOnlineUsers.splice(removeIndex, 1)
            // console.log(allOnlineUsers)

            // socket.to(socket.room).broadcast.emit('online-user-list', allOnlineUsers);
            // socket.leave(socket.room)

            if(socket.userId){
                redisLib.deleteUserFromHash('Onlineusers', socket.userId)
                redisLib.getAllUsersInAhash('OnlineUsers', (err, result) => {
                    if(err){
                        console.log(err)
                    } else {
                        socket.leave(socket.room)
                        socket.to(socket.room).broadcast.emit('online-user-list', result)
                    }
                })
            }
        })

        socket.on('chat-msg', (data) => {
            console.log("socket chat-msg called")
            console.log(data);
            data['chatId'] = shortid.generate()
            console.log(data);

            setTimeout(function(){
                eventEmitter.emit('save-chat', data);
            }, 2000)
            myIo.emit(data.receiverId, data)
        });

        socket.on('typing', (fullName) => {
            socket.to(socket.room).broadcast.emit('typing',fullName);
        });
    });


}

eventEmitter.on('save-chat', (data) => {

    let newChat = new chatModel({
        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receivername: data.receiverName || '',
        receiverId: data.receiverId || '',
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn
    })

    newChat.save((err, result)=>{
        if(err){
            console.log(`error occured: ${err}`);
        }
        else if(result == undefined || result == null || result == ""){
            console.log("chat is not saved");
        }
        else {
            console.log("chat saved");
            console.log(result);
        }
    });
})

module.exports = { 
    setServer : setServer
}