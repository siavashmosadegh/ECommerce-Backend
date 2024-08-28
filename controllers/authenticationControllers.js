import {
    registerUsersData
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

export {
    registerUsers
}