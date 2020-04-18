const socket = io('http://localhost:3000');

const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Imc2QzNwdjhBSyIsImlhdCI6MTU4NzE1MDYyMzA5NSwiZXhwIjoxNTg3MjM3MDIzLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6Ikc0NHVneG04SiIsImZpcnN0TmFtZSI6IlRoYWxhaXZhIiwibGFzdE5hbWUiOiJEYXJiYXIiLCJlbWFpbCI6ImhlbGxvQGRhcmJhci5jb20iLCJtb2JpbGVOdW1iZXIiOjE0MzI1NjEzMjV9fQ.Hjyw53ERKSpWTD38r9J3xISe848b-JYDtWoAhZWPFNk"
const userId = "G44ugxm8J"

let chatMessage = {
    createdOn: Date.now(),
    receiverId: 'XkMCf-d-3',
    receiverName:"shivaji bhasha" ,
    senderId: userId,
    senderName: 'thalaiva darbar'
} 
let chatSocket = () => {
    socket.on('verifyUser', (data) => {
        console.log("socket trying to verify user");
        socket.emit('set-user', authToken);
    });

    socket.on(userId, (data) => {
        console.log("you received a message"+data.senderName)
        console.log(data.message)
    });

    socket.on('online-user-list',(data) => {
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