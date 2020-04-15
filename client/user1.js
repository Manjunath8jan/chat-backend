const socket = io('http://localhost:3000');

const authToken = "OWRlNTllYTUxMzNlNjM2NDcyZTFjMTEwNWU3N2Q2ZjRhOGYzYjZmYjc3YzIxODgxNGIwZjNiYzgyOTJhNzFmNTRjNjMxYjZkZjczMjdiZDViY2IxMzg5MzQ0OGJiN2MyYWZjMTM2ODA2OTBiMjBmOTE4NzgyY2JkNTJlNWU0MWM2ZA=="
const userId = "H1pOQGY9M"

let chatMessage = {
    createdOn: Date.now(),
    receiverId: 'SJ-iectqM',
    senderId: userId,
    senderName: 'Mr sender'
} 
let chatSocket = () => {
    socket.on('verifyUser', (data) => {
        console.log("socket trying to verify user");
        socket.emit("set-user", authToken);
    });

    socket.on(userId, (data) => {
        console.log("you received a message"+data.senderName)
        console.log(data.message)
    });

    socket.on("online-user-list",(data) => {
        console.log("online user list is updated. some user sould be onlie or offline")
        console.log(data)
    });

    socket.on("typying", (data) => {
        console.log(data+" is typing")
    });

    $("#send").on('click', function() {
        let messageText = $("#messageToSend").val()
        chatMessage.message = messageText;
        socket.emit("chat-msg", chatMessage)
    })

    $("#messageToSend").on('keypress', function(){
        socket.emit("typing", "mr Xyz")
    })
}




chatSocket();