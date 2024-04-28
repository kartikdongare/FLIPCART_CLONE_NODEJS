import express from 'express';
import { RegisterUser,loginUser,logoutUser,refreshAccessToken } from '../controllers/user.controller.js';
import { verifyJwt } from '../middleware/auth.middleware.js';

const router=express.Router();

router.route('/register').post(RegisterUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt,logoutUser)
router.route('/new-access-token').post(refreshAccessToken)




export default router