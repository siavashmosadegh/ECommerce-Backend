use mydatabase;

SELECT UserReviews.*, Users.Email AS usersEmail, Users.UserName as username
FROM UserReviews
JOIN Users ON UserReviews.userId = Users.UserID
WHERE UserReviews.productId = @productId