use mydatabase;

INSERT INTO [dbo].[CartItems]
    (
        [CartId],
        [ProductID],
        [Quantity]
    )
VALUES (
    @cartId,
    @productId,
    @quantity
)