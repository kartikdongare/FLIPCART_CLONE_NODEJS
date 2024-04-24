import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password:{
    type:String,
    required:[true,'Password is required']
  },
  refresh_token:{
    type:String
  }
});

userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.method.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.method.generateAccessToken=async function(){
    return jwt.sign(
        {
            _id:this._id,
            user_name:this.user_name,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECREAT_KEY,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.method.generateRefreshToken=async function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECREAT_KEY,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model('users',userSchema);