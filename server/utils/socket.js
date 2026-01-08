import {Server} from 'socket.io';

const userSocketMap = {};

let io;

export default function initSocket(server){
    io = new Server(server,{
        cors :{ 
            origin : [process.env.FRONTEND_URL],

        }
    })

    io.on('connection',(socket)=>{
        console.log('user connected to server : ',socket.id);

        const userId = socket.handshake.query.userId;

        if(userId){
            userSocketMap[userId] = socket.id;
        }
        
    })

}