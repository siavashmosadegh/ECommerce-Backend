import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import {
    updateProfileNameData,
} from "../data/users/index.js";

const updateProfileName = catchAsyncErrors(async (req, res) => {

    const {firstName , lastName} = req.body;

    const userId = req.userId;

    const result = await updateProfileNameData(firstName, lastName, userId);

    res.json({
        updatedRecord: result
    });

});

export {
    updateProfileName
}