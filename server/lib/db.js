import mongoose from "mongoose";

//Function to connnect to the mongodb database
export const connectDB = async()=>{
    try {
        mongoose.connection.on("connected",()=> console.log("Database Connected"));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
    } catch (error){
        console.log("Error in DB Connection: "+error.message);
    }
}