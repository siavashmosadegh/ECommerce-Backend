import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {
    updateProfileNameData,
    getUserProfileData,
    addAddressData
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

    const {
        postalAddress, // آدرس پستی
        addressHouseNumber, // پلاک
        addressUnitNumber, // واحد
        zipCode // کد پستی
    } = req.body;

    const userId = req.userId;

    let result = await addAddressData(postalAddress, addressHouseNumber, addressUnitNumber, zipCode, userId);

    res.json({
        result
    });
})

export {
    updateProfileName,
    getUserProfile,
    addAddress
}