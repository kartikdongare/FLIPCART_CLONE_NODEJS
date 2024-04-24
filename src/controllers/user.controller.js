import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Joi from 'joi';
import {User} from '../models/user.model.js'
import ApiResponce from "../utils/ApiResponce.js";

const RegisterUser=asyncHandler(async(req,res,next)=>{

    const {first_name,last_name,user_name,password,email}=req.body;
    // console.log('hi')
    // validations
    // check error is getting or not while validation
    //check if user already exist or not
    //if user alredy exist then throw error as user already exist
    // create db for user
    //check successfully created not db for user
    // return res
    const userDataVal=Joi.object({
        first_name:Joi.string().min(2).max(10).required(),
        last_name:Joi.string().min(2).max(10).required(),
        user_name:Joi.string().max(6).required(),
        email:Joi.string().email().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    })

    const {error}=userDataVal.validate(
        {
            first_name,
            last_name,
            user_name,
            email,
            password 
        }
    )

    if(error){
        // console.log(error,'error')
        res.json(new ApiError(400,error.message,error.message))
    }

    //check user already exist or not
    const existUser=await User.findOne(
        {
            $or:[{user_name},{email}]
        }
    )
// console.log(existUser,'existUser')
    if(existUser){
        // console.log('exist user jh')
        res.json(new ApiError(401,'User Already Exist'));
    }

    //create db for user
    const user = await User.create({
      first_name,
      last_name,
      user_name,
      email,
      password,
    });

    // check user successfully registered or not
   const createUser=await User.findById(user._id).select('-password -refresh_token')
   if(!createUser){
    res.json(new ApiError(500,'Something went wrong while registering the user'))
   }

    res.json(new ApiResponce(200,createUser,'User Successfully Registered'))
})

export {RegisterUser}