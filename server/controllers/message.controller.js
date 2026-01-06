import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";

export const getAllUsers = catchAsyncError(async (req,res,next)=>{
    const userId = req.user._id;
    
    
    const filteredUser =  await User.find({_id : {$ne : userId}}).select('-password');
    
    
    res.status(200).json({
        success : true,
        user : filteredUser,
    })
})
export const getMessages = catchAsyncError(async (req,res,next)=>{
    
})
export const sendMessage = catchAsyncError(async (req,res,next)=>{})
