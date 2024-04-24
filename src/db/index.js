import mongoose from 'mongoose';
import {MONGODB_NAME} from '../constant.js'
const connectDB=async()=>{
    try {
        const res=await mongoose.connect(`${process.env.MONGODB_CONNECT_URL}/${MONGODB_NAME}`);
        console.log('MONGO DB IS CONNECTED')
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error
            console.error('Duplicate key error:', error.code);
            throw new Error('Username already exists');
          } else {
            // Handle other errors
            // console.error('Error:', error.message);
            throw new Error('Failed to add user');
          }
        // console.log('MONGO DB IS CONNECTION FAILED',error)
    }
}
export default connectDB