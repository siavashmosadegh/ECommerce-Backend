use mydatabase;

SELECT 
    *
FROM CartItems CI
JOIN Product P ON CI.ProductID = P.ProductID
WHERE CI.CartId = @cartId