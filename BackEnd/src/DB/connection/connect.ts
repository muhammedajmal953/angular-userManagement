import { config } from "dotenv";
import mongoose from "mongoose";
config()


const connectDb = async (): Promise<void>=>{
    try {
        const con = await mongoose.connect(process.env.mongoDb_Url!); 
        console.log(`MongoDB connected: ${con.connection.host}`);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}  
export default connectDb