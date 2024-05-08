import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app=express();
app.use(cors());
app.use(express.urlencoded({extended:true,limit:'20kb'}));
app.use(cookieParser())
// app.use(express.static('public'));
app.use(express.json());


// import routers
import userRouter from './routes/user.router.js'



// router declarations

app.use('/api/v1/users',userRouter)



export {app}