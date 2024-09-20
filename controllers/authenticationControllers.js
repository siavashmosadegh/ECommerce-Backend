import {
    registerUsersData,
    loginUsersData,
    forgotPasswordData,
    resetPasswordData,
    getUserProfileData
} from "../data/authentication/index.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import pkg3 from 'jsonwebtoken';
const {verify} = pkg3;

const registerUsers = catchAsyncErrors( async (req, res) => {
    const {username, email, password} = req.body;

    let insertUser;

    insertUser = await registerUsersData(username, email,password);

    if (insertUser === "User Already Exists") {
        res.status(400).json({
            message: "User Already Exists"
        })
    } else if (insertUser === "User registered Successfully")  {
        res.status(201).json({
            message: "User Registered Successfully"
        })
    }
})

const loginUsers = catchAsyncErrors( async (req,res) => {
    const {username , password} = req.body;

    let result = await loginUsersData(username, password);

    console.log(result);

    //check if user exists
    if (result === "Login Failed: User Does Not Exist") {
        res.status(400).json({ message: "Login Failed: User Does Not Exist"});
    } else if (result === "Invalid Credentials: This Combination of Username & Password is Incorrect") {
        res.status(400).json({ message: "Invalid Credentials: This Combination of Username & Password is Incorrect"});
    } else {
        res.status(200).json({ token: result });
    }
})

const forgotPassword = catchAsyncErrors( async (req, res) => {

    const {username} = req.body;

    let result = await forgotPasswordData(username);

    console.log(result);

    if (result === "Login Failed: User Does Not Exist") {
        res.status(400).json({ message: "Login Failed: User Does Not Exist" });
    } else if (result === "Password Reset Email Was Sent Successfully") {
        res.status(200).json({ message: "Password Reset Email Was Sent Successfully"})
    } else {
        res.status.json({ message: result })
    }
})

const resetPassword = catchAsyncErrors( async (req, res) => {
    
    const { token , newPassword} = req.body;

    let result = await resetPasswordData(token, newPassword);

    if (result === "Invalid or Expired Token") {
        res.status(400).json({ message: "Invalid or Expired Token"});
    } else if (result === "Token has expired") {
        res.status(400).json({ message:  "Token has expired"});
    } else if (result === "Password has been reset successfully") {
        res.status(200).json({ message: "Password has been reset successfully"});    
    } else {
        res.json({ message: result })
    }
})

const getUserProfile = catchAsyncErrors( async (req, res) => {
    
    let result = await getUserProfileData(req.userId);

    console.log(result);

    res.status(200).json({
        user: result
    });
})

export {
    registerUsers,
    loginUsers,
    forgotPassword,
    resetPassword,
    getUserProfile
}