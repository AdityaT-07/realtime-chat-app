import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import { User } from "../models/user.model.js";
import {Message} from '../models/message.model.js'
import {v2 as cloudinary} from 'cloudinary'

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
    const {senderId} = req?.user._id;
    const {id : receiverId} = req.params.id;
    const {media} = req?.files?.media;
    const {text} = req.body;

    const receiver = await User.findById(receiverId);

        if(!receiver){
            return res.status(400).json({
                success : false,
                message : "Receiver ID invalid"
            })
        }

        const sanitizedText = text?.trim() || '';

        if(!sanitizedText && !media){
            return res.status(400).json({
                success :  true,
                message : 'empty message is not allowed',
            })
        }
        let mediaUrl = '';

        if(media){
            try{
                const uploadResponse = await cloudinary.uploader.upload(
                media.tempFilePath,{
                    resource_type : 'auto', //identified whether img or video
                    folder : '  REAL_TIME_CHAT_MEDIA',
                    transformation : [
                        {
                            width : 1080,
                            height : 1080
                        },
                        {
                            quality : 'auto'
                        },
                        {
                            fetch_format : 'auto'
                        }
                    ]
                }
            )
            mediaUrl = uploadResponse?.secure_url;

            }
            catch(error){
                console.error('cloudinary upload error : ',error)
                return res.status(500).json({
                    success : false,
                    message : 'Failed to upload media. please try again later !'
                })
            }
            
        }
})
