use mydatabase;

UPDATE [dbo].[CartItems]
SET [Quantity] = @quantity
WHERE
    [CartItemId] = @cartItemId AND
    [CartId] = @cartId AND
    [ProductID] = @productId