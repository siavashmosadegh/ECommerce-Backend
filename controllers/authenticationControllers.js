import {
    registerUsersData,
    loginUsersData,
    forgotPasswordData,
    resetPasswordData,
    getUserProfileData,
    updatePasswordData,
    getAllUsersData,
    getUserData,
    deleteUserData,
    updateUserData,
    loginUsersWithPhoneData,
    loginRequestOTPData,
    loginVerifyOTPData
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

const updatePassword = catchAsyncErrors( async (req, res) => {

    const userId = req.userId;
    const {newPassword} = req.body;

    let result = await updatePasswordData(userId, newPassword);

    if (result === "Your Password was Updated Successfully") {
        res.status(200).json({ message: "Your Password was Updated Successfully"})
    } else {
        res.json({ message: result });
    }
})

const getAllUsers = catchAsyncErrors( async (req, res) => {

    let result = await getAllUsersData();

    if (result === null || result.length === 0) {
        res.json({
            message: "There Are No Users Available"
        })
    } else {
        res.status(200).json({
            users: result
        })
    }
})

const getUser = catchAsyncErrors( async (req, res) => {

    const id = req.params.id;

    let result = await getUserData(id);

    if (result === null || result === undefined) {
        res.json({
            message: "There was no user with the provided user id !!"
        })
    } else {
        res.json({
            user: result
        })
    }
})

const deleteUser = catchAsyncErrors( async (req, res) => {

    const id = req.params.id;

    const result = await deleteUserData(id);

    if (result === "User Deleted Successfully !!!") {
        res.status(200).json({
            message: "User Deleted Successfully !!!"
        });
    } else if (result === "User Does Not Exist") {
        res.status(401).json({
            message: "User Does Not Exist"
        })
    } else {
        res.json({
            message: "There Was a Problem Deleting the User"
        });
    }
    

    res.json({
        result: result
    })
})

const updateUser = catchAsyncErrors( async (req, res) => {

    const id = req.params.id;

    const updates = req.body;

    const result = await updateUserData(id, updates);

    if (result === "Successful") {
        res.status(200).json({
            message: "successful"
        })
    } else {
        res.json({
            message: result
        })
    }
})

const loginUsersWithPhone = catchAsyncErrors( async (req, res) => {

    const phoneNumber = req.body.mobile;

    const result = await loginUsersWithPhoneData(phoneNumber);

    if (result === "User Does Not Exist") {
        res.status(404).json({
            message: "User Does Not Exist"
        })
    } else {
        res.status(200).json({
            message: result
        })
    }
});

const loginRequestOTP = catchAsyncErrors(async (req, res) => {
    const phoneNumber = req.body.mobile;

    const result = await loginRequestOTPData(phoneNumber);

    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
});

const loginVerifyOTP = catchAsyncErrors(async (req, res) => {
    const { mobile, otp } = req.body;

    const result = await loginVerifyOTPData(mobile, otp);

    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: "ورود موفق", token: result.token });
});



export {
    registerUsers,
    loginUsers,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    loginUsersWithPhone,
    loginRequestOTP,
    loginVerifyOTP
}