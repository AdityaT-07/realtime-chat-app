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

        io.emit('getOnlineUsers',Object.keys(userSocketMap))

        socket.on('disconnect',()=>{
            console.log('A user is disconnectted : ',socket.id);
            delete userSocketMap[userId];
            io.emit('getOnlineUsers',Object.keys(userSocketMap))
        })
        
    })

}

export function getReceiverSocketId(userId){
    return userSocketMap[userId]
}

export {io};