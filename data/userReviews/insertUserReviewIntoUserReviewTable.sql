INSERT INTO [dbo].[UserReviews]
    (
        [userId],
        [productId],
        [rating],
        [reviewText]
    )
VALUES (
    @userId,
    @productId,
    @rating,
    @reviewText
)