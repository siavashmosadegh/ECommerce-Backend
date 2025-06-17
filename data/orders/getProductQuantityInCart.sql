use mydatabase;

SELECT [Quantity]
FROM [dbo].[CartItems]
Where 
    [CartItemId] = @cartItemId AND
    [CartId] = @cartId AND
    [ProductID] = @productId