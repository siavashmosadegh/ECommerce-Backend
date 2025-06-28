use mydatabase;

SELECT [Quantity], [CartItemId]
FROM [dbo].[CartItems]
Where
    [CartId] = @cartId AND
    [ProductID] = @productId