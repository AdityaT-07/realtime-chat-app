import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";
import {Message} from '../models/message.model.js'

export const getAllUsers = catchAsyncError(async (req,res,next)=>{
    const userId = req.user._id;
    
    
    const filteredUser =  await User.find({_id : {$ne : userId}}).select('-password');
    
    
    res.status(200).json({
        success : true,
        user : filteredUser,
    })
})
export const getMessages = catchAsyncError(async (req,res,next)=>{
        const myId = req.user._id;
        const receiverId = req.params.id;

        const receiver = await User.findById(receiverId);

        if(!receiver){
            return res.status(400).json({
                success : false,
                message : "Receiver ID invalid"
            })
        }

        const messages =  await Message.find({
            $or : [
                {senderId : myId, recieverId : receiverId},
                { senderId : receiverId , receiverId : myId }
            ],
        }).sort({createdAt : 1})

        res.status(200).json({
            success : true,
            messages,
        })
})
export const sendMessage = catchAsyncError(async (req,res,next)=>{
    
})
