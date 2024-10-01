use mydatabase;

INSERT INTO [dbo].[Orders]
    (
        [UserID],
        [TotalPrice],
        [ShippingAddress],
        [Status]
    )
OUTPUT Inserted.OrderId
VALUES (
    @UserID,
    @totalPrice,
    @shippingAddress,
    @status
)