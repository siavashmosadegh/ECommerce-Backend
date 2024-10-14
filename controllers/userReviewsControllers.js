import {
    placeNewReviewData
} from '../data/userReviews/index.js';

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";

const placeNewReview = catchAsyncErrors( async (req, res, next) => {

    const userId = req.userId;
    const { productId, rating, reviewText } = req.body;

    const result = await placeNewReviewData(userId, productId, rating, reviewText);

    res.json({
        result
    });
})

export {
    placeNewReview
}