const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjRZcjN1eW5hViIsImlhdCI6MTU4NzE1MDU2NjU5MywiZXhwIjoxNTg3MjM2OTY2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IlhrTUNmLWQtMyIsImZpcnN0TmFtZSI6InNoaXZhamkiLCJsYXN0TmFtZSI6IkJoYXNoYSIsImVtYWlsIjoiaGVsbG9Ac2hpdmFqaS5jb20iLCJtb2JpbGVOdW1iZXIiOjE0MzI1NjExNDN9fQ.cwuyx7otjG4EcgmzoVFK-yFX-s5YQ_CFdHGoW-PM7MU"
const userId = "XkMCf-d-3"

let chatMessage = {
    createdOn: Date.now(),
    receiverId: 'G44ugxm8J',
    receiverName: userId,
    senderId: userId,
    senderName: "shivaji bhasha" 
}

let chatSocket = () => {
    socket.on('verifyUser', (data) => {
        console.log("socket trying to verify user");
        socket.emit("set-user", authToken);
    });

    socket.on(userId, (data) => {
        console.log("you received a message from "+data.senderName);
        console.log(data.message)
    });

    $("#send").on('click', function() {
        let messageText = $("#messageToSend").val()
        chatMessage.message = messageText;
        socket.emit("chat-msg", chatMessage)
    })

    $("#messageToSend").on('keypress', function(){
        socket.emit("typing","Aditya kumar")
    })

    socket.on("typing", (data) => {
        console.log(data +" is typing")
    });
}

chatSocket();