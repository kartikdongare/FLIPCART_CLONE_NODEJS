
import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js';
import  asyncHandler  from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

const verifyJwt=asyncHandler(async(req,res,next)=>{
    
    try {
        // console.log('hii')
        const token=req?.cokkie?.access_token || req.header("Authorization")?.split(' ')[1]
        console.log(token,'token')
        if(!token){
            return res.json(new ApiError(401,"Unauthorized request"))
        }
        const decodeToken=await jwt.decode(token);
        console.log('decodeToken',decodeToken)
        const user=await User.findById(decodeToken?._id).select('-password -refresh_token');
        console.log(user,'user')
        if(!user){
            return res.json(new ApiError(401,'Invalid access token!'))
        }
        req.user=user;
        next()
    } catch (error) {
         res.json(new ApiError(401,"Invalid access token",error))
    }
})

export {verifyJwt}