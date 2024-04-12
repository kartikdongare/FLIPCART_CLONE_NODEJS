import mongoose from 'mongoose';
import {MONGODB_NAME} from '../constant.js'
const connectDB=async()=>{
    try {
        const res=await mongoose.connect(`${process.env.MONGODB_CONNECT_URL}/${MONGODB_NAME}`);
        console.log('MONGO DB IS CONNECTED')
    } catch (error) {
        console.log('MONGO DB IS CONNECTION FAILED',error)
    }
}
export default connectDB