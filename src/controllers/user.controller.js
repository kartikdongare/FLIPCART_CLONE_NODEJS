import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import Joi from 'joi';
import {User} from '../models/user.model.js'
import ApiResponce from "../utils/ApiResponce.js";
import jwt from 'jsonwebtoken'
const generateAccessAndRefreshToken=async(id)=>{
    console.log(id,'id')
    try {
       const user=await User.findById(id);
       console.log(user._id,'usser')
    const refresh_token=await user.generateAccessToken();
    const access_token= await user.generateRefreshToken(); 
    user.refresh_token=refresh_token
    await user.save({ validateBeforeSave: false });
    return {access_token,refresh_token}

    } catch (error) {
        throw error
    }
    
}

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
        user_name:Joi.string().required(),
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

const loginUser=asyncHandler(async(req,res,next)=>{
    // validate user and password;
    // user exist or not  in database
    //if user does not exist throw error
    // check password is correct or not
    // if password does not match then throw error
    // generate access and refresh token 
    // create option for security pursose like https
    // everything is fine then send response to client

    // validations
    const {user_name,password}=req.body;
    // console.log(req.body,'ff')
    const userValidate=Joi.object({
        user_name:Joi.string().required(),
        password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
    })
    const {error}=userValidate.validate({
        user_name,
        password
    });
    if(error){
         res.json(new ApiError(400,error.message))
    }
    const user=await User.findOne({
        $or:[{user_name}]
    })

    if(!user){
        res.json(new ApiError(404,"User does not exist"))
    }

    const isPasswordvalid=await user.isPasswordCorrect(password);
    // console.log(isPasswordvalid,'isPasswordvalid')
    if(!isPasswordvalid){
        res.json(new ApiError(401,"Invalid credentials"))
    }
    
    const {access_token,refresh_token}=await generateAccessAndRefreshToken(user._id);
    // console.log(accessToken,'accc')
    const loginedUser=await User.findOne(user._id).select('-password -refresh_token');

    const options = {
        httpOnly: true,
        secure: true,
        sameSite:'lax'
    }
    return res
    .status(200)
    .cookie('access_token',access_token,options)
    .cookie('refresh_token',refresh_token,options)
    .json(
        new ApiResponce(
            200,
            {
                user:loginedUser,access_token,refresh_token
            },
            "User Login Successfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refresh_token:1
            }
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .clearCookie('access_token',options)
    .clearCookie('refresh_token',options)
    .json(
        new ApiResponce(200,{},"User logout Successfully")
    )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refresh_token || req.body.refresh_token

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.decode(
            incomingRefreshToken,
            // process.env.REFRESH_TOKEN_SECREAT_KEY
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refresh_token) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {access_token, refresh_token} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("access_token", access_token, options)
        .cookie("refresh_token", refresh_token, options)
        .json(
            new ApiResponce(
                200, 
                {access_token, refreshToken: refresh_token},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})
export {RegisterUser,loginUser,logoutUser,refreshAccessToken}