// $env:NODE_ENV="production";  --> run this when using powershell because here NODE_ENV is clean by default
//console.log("Current NODE_ENV:", process.env.NODE_ENV);

const express = require("express");
const dotenv = require("dotenv");
const {chats} = require("./data/dummy data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const chatRoutes = require("./routes/chatRoutes")
const messageRoute = require("./routes/messageRoute")
const { notFound, errorHandler } = require("./middlewares/errorMiddleWare");

dotenv.config();
connectDB();

const app = express();

app.use(express.json())  //to accept JSON data

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoute)

/*-------------------------------------------------------------------------------------*/
/* Deployment */
const path = require("path");

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "frontend/dist")));
  app.use((req, res) =>
    res.sendFile(path.join(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
/* Deployment */
/*-------------------------------------------------------------------------------------*/

/*Error handler*/ 
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, console.log("App listening"));

/*const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173" //frontend url
    }
})*/

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket)=> {
    console.log("connected to socket.io")

    socket.on("setup", (userData)=> {
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room)=> {
        socket.join(room)
        console.log("user joined Room " + room)
    })

    socket.on("typing", (room)=> socket.in(room).emit("typing"))
    socket.on("stop typing", (room)=> socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageRecieved)=> {
        var chat = newMessageRecieved.chat
        if(!chat.users) return console.log("chat users not defined")
        
        chat.users.forEach(user=> {
            if(user._id === newMessageRecieved.sender._id) return

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })
    })

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})
