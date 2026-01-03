import { catchAsyncError } from "../middlewares/catchAsyncError.middleware.js"
import {User} from '../models/user.model.js'

export const signup = catchAsyncError(async (req,res,next)=>{
    const{fullName,email,password} = req.body
    if(!fullName || !email || !password){
        return res.status(400).json({
            success : false,
            message : 'please fill everything'
        })
    }
    const emailReg = null
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

})
export const signin = catchAsyncError(async (req,res,next)=>{

})
export const signout = catchAsyncError(async (req,res,next)=>{

})
export const getUser = catchAsyncError(async (req,res,next)=>{

})
export const updateProfile = catchAsyncError(async (req,res,next)=>{

})
