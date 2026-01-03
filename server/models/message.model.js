import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema({
  from : {
    senderId : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true 
  },
  to : {
    receiverId : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },
  text : String,
  media : String,
  required : true
  
},{timestamps : true})

export const Message =  mongoose.model('Message',messageSchema)
