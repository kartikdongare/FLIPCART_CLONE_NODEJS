import dotenv from 'dotenv';
dotenv.config();
import connectDB from './db/index.js';
import {app} from './app.js'
connectDB()
.then(()=>{
    console.log('Mongo DB is connected');
    app.listen(process.env.SERVER_PORT,()=> {
        console.log(`Server is running on ${process.env.SERVER_PORT}`)
    })
})
.catch((err)=>{
    console.log('Mongo DB is failed');
})