import {
    registerUsersData,
    loginUsersData,
    forgotPasswordData,
    resetPasswordData,
    updatePasswordData,
    getAllUsersData,
    getUserData,
    deleteUserData,
    updateUserData,
    loginUsersWithPhoneData,
    loginRequestOTPData,
    loginVerifyOTPData,
    getUserByPhone,
    getGuestByPhone,
    createGuest,
    insertOtp,
    getOtpViaMobileAndOtp,
    markOtpAsUsed,
    createUserViaPhone,
    insertRegisterDataAndGenerateOTP,
    getOtpFromRegisterOTP
} from "../data/authentication/index.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import pkg3 from 'jsonwebtoken';
import {
    sendOtpForLogin,
    sendOtpForRegister
} from "../utils/smsService.js";
const {verify,sign} = pkg3;
import pkg2 from 'bcryptjs';
const {hash, compare, compareSync} = pkg2;

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

const loginViaPhoneRequestOtp = catchAsyncErrors(async (req, res) => {

    const { mobile } = req.body;

    // create or reuse guest if user doesn't exist
    let user = await getUserByPhone(mobile);
    let guest = await getGuestByPhone(mobile);

    if (!user && !guest) {
        await createGuest( mobile );
        guest = await getGuestByPhone(mobile);
    }

    let ownerType , ownerRef;

    if (user) {
        ownerType = 'U';
        ownerRef = user.UserID;
    } else {
        ownerType = 'G';
        ownerRef = guest.GuestID;
    }

    const otpCode = await insertOtp( mobile, ownerType, ownerRef );

    console.log(`otpCode stored in DB Successfully : ${otpCode}`);

    // send SMS here
    const smsResult = await sendOtpForLogin(mobile, otpCode);

    if (!smsResult.success) {
        console.error("SMS sending failed : ",smsResult.message);
        res.status(500).json({
            message: "ارسال پیامک با خطا مواجه شد",
            error: smsResult.message
        }); 
    }

    res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        //guest
        //mobile,
        // // فقط برای تست | در تولید حذف کن
    });

})

const verifyOtpCode = catchAsyncErrors(async (req, res) => {

    const {
        otp,
        mobile
    } = req.body;

    // ۱. پیدا کردن OTP معتبر و استفاده‌نشده و تاریخ معتبر
    
    const otpCodeResult = await getOtpViaMobileAndOtp ( mobile, otp );

    if (!otpCodeResult) {
        res.status(400).json({ message: "کد وارد شده اشتباه است" });
    }

    // 2. بررسی تاریخ انقضا

    const now = new Date();

    // دیتابیس ساعت رو بدون درنظر گرفتن تایم زون ذخیره میکنه 
    // ولی
    // نود جی اس تاریخ رو با توجه به تایم زون تغییر میده

    const realDate = new Date(otpCodeResult.expiresAt.getTime() + otpCodeResult.expiresAt.getTimezoneOffset() * 60000);

    if (realDate < now) {
        res.status(400).json({ message: "کد تایید منقضی شده است " })
    }

    // 3. بررسی اینکه کد قبلا استفاده شده یا نه
    if (otpCodeResult.isUsed == 1) {
        res.status(400).json({ message: "کد قبلا استفاده شده است"})
    }

    // 4. مشخص میکنیم کاربره یا مهمان

    let tokenPayload;

    if (otpCodeResult.userId) {
        tokenPayload = {
            type: "user",
            id: otpCodeResult.userId
        }
    } else {
        tokenPayload = {
            type: "guest",
            id: otpCodeResult.guestId
        }
    }

    // 5. آپدیت کن که OTP استفاده شده

    await markOtpAsUsed(otpCodeResult.otpId);

    // 6. ساخت JWT

    const token = sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn : "1h"
    });

    // 7. پاسخ نهایی

    res.status(200).json({
        message: "OTP Verified Successfully",
        token,
        ownerType: tokenPayload.type,
        ownerId : tokenPayload.id
    });

})

const registerViaPhoneRequestOtp = catchAsyncErrors(async (req, res) => {
    try {
        const {
            mobile,
            firstName,
            lastName,
            password
        } = req.body;

        if ( !mobile ) {
            res.status(400).json({
                success: false,
                message: "موبایل وارد نشده"
            });
        } else if ( !firstName ) {
            res.status(400).json({
                success: false,
                message: "نام وارد نشده"
            });
        } else if ( !lastName ) {
            res.status(400).json({
                success: false,
                message: "نام خانوادگی"
            });
        } else if ( !password ) {
            res.status(400).json({
                success: false,
                message: "پسورد وارد نشده"
            });
        } else {
            console.log("everything is sent")
        }

        // 1. آیا User ای با این شماره ثبت نام کرده قبلا ؟|
    
        const existingUser = await getUserByPhone(mobile);

        console.log(existingUser);

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "این شماره قبلا ثبت نام کرده است. لطفا وارد شوید"
            })
        }

        // 2. آیا guest وجود دارد ؟

        const existingGuest = await getGuestByPhone(mobile);

        if (existingGuest) {
            // Turn existingGuest to 
            
            console.log('ding ding ding we have a winner');

            console.log('this number exists as guests');

            let newUserId;
        } else {
            // 1. insert Register Data temporarily

            const hashedPassword = await hash(password,10);

            const otpCode = await insertRegisterDataAndGenerateOTP(
                mobile,
                firstName,
                lastName,
                hashedPassword
            );

            console.log(`otpCode stored in DB Successfully : ${otpCode}`);

            // 2. send otp via sms.ir

            const smsResult = await sendOtpForRegister(mobile, otpCode);

            if (!smsResult.success) {
                console.error("SMS sending failed : ",smsResult.message);
                res.status(500).json({
                    message: "ارسال پیامک با خطا مواجه شد",
                    error: smsResult.message
                }); 
            }

            res.status(200).json({
                success: true,
                message: "OTP sent successfully",
                //guest
                //mobile,
                // // فقط برای تست | در تولید حذف کن
            });

        }

    } catch (error) {
        console.error("REGISTER ERROR: ", error);

        res.status(500).json({
            success: false,
            message: "خطای سرور"
        })
    }
})

const registerViaPhoneVerifyOtp = catchAsyncErrors(async (req, res) => {
    try {

        const {
            mobile,
            otp
        } = req.body;

        // 1. پیدا کردن OTP معتبر و استفاده نشده و دارای تاریخ معتبر

        const otpCode = await getOtpFromRegisterOTP (mobile, otp);

        if (!otpCode) {
            res.status(400).json({ message: "کد وارد شده اشتباه است" });
        }

        // 2. بررسی تاریخ انقضا

        const now = new Date();

        // دیتابیس ساعت رو بدون درنظر گرفتن تایم زون ذخیره میکنه 
        // ولی
        // نود جی اس تاریخ رو با توجه به تایم زون تغییر میده

        const realDate = new Date(otpCode.expiresAt.getTime() + otpCode.expiresAt.getTimezoneOffset() * 60000);

        if (realDate < now) {
            res.status(400).json({ message: "کد تایید منقضی شده است " })
        }

        // 3. بررسی اینکه کد قبلا استفاده شده یا نه

        if (otpCode.isUsed == 1) {
            res.status(400).json({ message: "کد قبلا استفاده شده است"})
        }

    } catch (error) {
        console.error("REGISTER ERROR: ", error);

        res.status(500).json({
            success: false,
            message: "خطای سرور"
        })
    }    
})

export {
    registerUsers,
    loginUsers,
    forgotPassword,
    resetPassword,
    updatePassword,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    loginUsersWithPhone,
    loginRequestOTP,
    loginVerifyOTP,
    loginViaPhoneRequestOtp,
    verifyOtpCode,
    registerViaPhoneRequestOtp,
    registerViaPhoneVerifyOtp
}