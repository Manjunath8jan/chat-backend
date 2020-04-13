const socket = io('http://localhost:3000');

const authToken = "OWRlNTllYTUxMzNlNjM2NDcyZTFjMTEwNWU3N2Q2ZjRhOGYzYjZmYjc3YzIxODgxNGIwZjNiYzgyOTJhNzFmNTRjNjMxYjZkZjczMjdiZDViY2IxMzg5MzQ0OGJiN2MyYWZjMTM2ODA2OTBiMjBmOTE4NzgyY2JkNTJlNWU0MWM2ZA=="
const userId = "H1pOQGY9M"

let chatSocket = () => {
    socket.on('verifyUser', (data) => {
        console.log("socket trying to verify user");
        socket.emit("set-user", authToken);
    });

    socket.on(userId, (data) => {
        console.log("you received a message")
        console.log(data)
    });
}

chatSocket();