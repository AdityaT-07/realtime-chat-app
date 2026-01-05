import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import {User} from '../models/user.model.js'
import { generateToken } from "../utils/jwtToken.js"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'

export const signup = catchAsyncError(async (req,res,next)=>{
    const{fullName,email,password} = req.body
    if(!fullName || !email || !password){
        return res.status(400).json({
            success : false,
            message : 'please fill everything'
        })
    }
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailReg.test(email)){
        return res.status(400).json({
            success : false,
            message : 'enter valid email '
        })
    }

    if(password.length <6){
        return res.status(400).json({
            success : false,
            message : 'password must be minimum of 6 character '
        })
    }
     const isEmailExisting = await User.findOne({email})
     if(isEmailExisting){
        return res.status(400).json({
            success : false,
            message : 'email already exist !'
        })
     }

     const hashPassword = await bcrypt.hash(password,10)

     const user =  await User.create({
        fullName,
        email,
        password : hashPassword,
        avatar : {
            public_id : '',
            url : ''
        }
     })
     generateToken(user,"User Registered Successfully",201,res);

})
export const signin = catchAsyncError(async (req,res,next)=>{
    const{email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : 'please fill everything'
        })
    }

     const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailReg.test(email)){
        return res.status(400).json({
            success : false,
            message : 'enter valid email '
        })
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            success : false,
            message : 'Invalid details !'
        })
    }
    const isPasswordMatched = await bcrypt.compare(password,user.password);
     if(!isPasswordMatched){
        return res.status(400).json({
            success : false,
            message : 'Invalid details !'
        })
    }

    generateToken(user,"user loggin Successfully",201,res);
    


})
export const signout = catchAsyncError(async (req,res,next)=>{
 res.status(201).cookie("token","",{
    maxAge : 0,
    httpOnly : true,
    sameSite : 'strict',
    secure : process.env.NODE_ENV !=='development' ? true : false
 }).json({
    success : true,
    message : "user logout Successfully",
 })
})
export const getUser = catchAsyncError(async (req,res,next)=>{

    const user = req.user;
    res.status(201).json({
        success : true,
        user
    })
})
export const updateProfile = catchAsyncError(async (req,res,next)=>{

    const {fullName, email} = req.body;

    if(fullName.trim().length===0 || email.trim().length===0){
        return res.status(400).json({
            success : false,
            message : "fullName and Email cannot be empty !",
        })
    }
    const avatar = req?.files?.avatar;
    let cloudinaryResponse = {};

    if(avatar){

        try {
            const oldAvatarPublicId = req.user?.avatar?.public_id;
            if(oldAvatarPublicId && oldAvatarPublicId.length>0){
                await cloudinary.uploader.destroy(oldAvatarPublicId)
            }
             cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath,{
                folder : 'chat_app_user_avatar',
                transformation : [
                    {
                        width : 300,
                        height : 300,
                        crop : 'limit'
                    },
                    {
                        quality : 'auto'
                    },
                    {
                        fetch_format : 'auto'
                    }
                ]
             })
        } catch (error) {
            console.error("Cloudinary error : ",error)
            return res.status(500).json({
                success : false,
                message : 'failed to upload avatar, please try again later !'
            })
        }
    }

    let data = {
        fullName,
        email
    }
    if(avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url){
        data.avatar = {
            public_id : cloudinaryResponse.public_id,
            url : cloudinaryResponse.secure_url
        }
    }

    let user = await User.findByIdAndUpdate(req.user._id,data,{
        new :  true,
        runValidators : true
    })

    res.status(200).json({
        success : true,
        message : "profile updated Successfully!",
        user,
    })

})
