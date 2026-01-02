import mongoose from "mongoose";

export const dbConnection = ()=>{

    mongoose.connect(process.env.MONGO_URI,{
        dbName : 'RealTimeChatApp'
    }).then(()=>{
        console.log("database connected succesfully");
        
    }).catch((err)=>{
        console.log(`error caught while connecting to database : ${err.stack || err}  `);
        
    })
}