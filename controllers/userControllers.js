import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {
    updateProfileNameData,
    getUserProfileData,
    addAddressData,
    updateBirthInfoData,
    updateNationalCodeData
} from "../data/users/index.js";

const updateProfileName = catchAsyncErrors(async (req, res) => {

    const {firstName , lastName} = req.body;

    const userId = req.userId;

    const result = await updateProfileNameData(firstName, lastName, userId);

    res.json({
        updatedRecord: result
    });

});

const getUserProfile = catchAsyncErrors( async (req, res) => {
    
    let result = await getUserProfileData(req.userId);

    console.log(result);

    res.status(200).json({
        user: result
    });
});

const addAddress = catchAsyncErrors( async (req, res) => {

    // const {
    //     postalAddress, // آدرس پستی
    //     addressHouseNumber, // پلاک
    //     addressUnitNumber, // واحد
    //     zipCode // کد پستی
    // } = req.body;

    const data = req.body;

    const userId = req.userId || null;

    const guestId = req.guestId || null;

    if (!userId && !guestId) {
        return res.status(400).json({
            success: false,
            message: 'UserID یا GuestID الزامی هست'
        });
    }

    let result = await addAddressData(data, userId, guestId);

    res.status(201).json({
        success: true,
        message: 'آدرس با موفقیت ثبت شد',
        data: result
    });
});

const updateBirthInfo = catchAsyncErrors( async (req, res) => {

    const {
        birthDay, // روز تولد
        birthMonth, // ماه تولد
        birthYear // سال تولد
    } = req.body;

    const userId = req.userId;

    let result = await updateBirthInfoData(birthDay, birthMonth, birthYear, userId);

    res.json({
        result
    });
});

const updateNationalCode = catchAsyncErrors( async (req, res) => {

    const {
        nationalCode 
    } = req.body;

    const userId = req.userId;

    let result = await updateNationalCodeData(nationalCode, userId);

    res.json({
        result
    })
})

export {
    updateProfileName,
    getUserProfile,
    addAddress,
    updateBirthInfo,
    updateNationalCode
}