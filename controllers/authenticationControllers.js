import {
    registerUsersData,
    loginUsersData,
    forgotPasswordData
} from "../data/authentication/index.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

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
    }
})

export {
    registerUsers,
    loginUsers,
    forgotPassword
}