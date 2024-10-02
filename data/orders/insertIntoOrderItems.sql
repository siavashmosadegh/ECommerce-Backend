use mydatabase;

INSERT INTO [dbo].[OrderItems]
    (
        [OrderId],
        [ProductId],
        [Quantity],
        [Price]
    )
VALUES (
    @OrderId,
    @ProductId,
    @Quantity,
    @Price
)