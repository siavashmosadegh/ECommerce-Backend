import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {
    updateProfileNameData,
    getUserProfileData
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
})

export {
    updateProfileName,
    getUserProfile
}