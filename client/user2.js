const socket = io('http://localhost:3000');

const authToken = "OWRlNTllYTUxMzNlNjM2NDcyZTFjMTEwNWU3N2Q2ZjRhOGYzYjZmYjc3YzIxODgxNGIwZjNiYzgyOTJhNzFmNTRjNjMxYjZkZjczMjdiZDViY2IxMzg5MzQ0OGJiN2MyYWZjMTM2ODA2OTBiMjBmOTE4NzgyY2JkNTJlNWU0MWM2ZA=="
const userId = "SJ-iectqM"

let chatMessage = {
    createdOn: Date.now(),
    receiverId: 'H1pOQGY9M',
    receiverName: userId,
    senderName: "Guruguntla" 
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