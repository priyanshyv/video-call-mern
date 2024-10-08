const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const app = express();
const PORT = process.env.PORT || 8000;

// const io = new Server(8000,{
//     //basically frontend localhost->5173 pei chalra hai and backend->8000 pei 
//     //so browser security poin of view sey allow nahi karta hai thats why use cors
//     //CORS (Cross-Origin Resource Sharing)
//     cors:true,
// });

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "https://video-call-mern-front.onrender.com",
      methods: ["GET", "POST"],
      credentials: true,
    }
  });
  

//hamey track rakhna hoga konsi id kis room mei hai
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection",(socket)=>{
    console.log('socket connected',socket.id); 
    socket.on('room:join',data=>{
        const {email,room} = data;
        emailToSocketIdMap.set(email,socket.id);
        socketidToEmailMap.set(socket.id,email);
        io.to(room).emit('user:joined',{email,id:socket.id})


        //user room mei join karwane sey pahle hamm yei karenge ki 
        io.to(room).emit('user:joined',{email,id:socket.id});
        socket.join(room);
        //basically agar waha pei koi user hoga toh uskey paas event aayega 'user:joined' then this socket.join(room); user ko join karwa denge


        //jo user ney join karne ka request kara tha mai usi ka data usi ko return karra hu
        //mai keh raha hu ki tum room join kar sakte ho
        io.to(socket.id).emit('room:join',data);
    });


        //tab bhi strem on hoti hai vaha sey yei yei aata hai
        socket.on("user:call",({to,offer})=>{
            //dusrey user ke liye toh incomming call hi hai
            io.to(to).emit("incomming:call",{from:socket.id,offer})
        });

        socket.on("call:accepted", ({ to, ans }) => {
            io.to(to).emit("call:accepted", { from: socket.id, ans });
        });

        socket.on('peer:nego:needed',({to,offer})=>{
            io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
        })

        socket.on('peer:nego:done',({to,ans})=>{
            io.to(to).emit("peer:nego:final", { from: socket.id, ans });
        })
   
});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });