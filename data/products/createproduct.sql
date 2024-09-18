INSERT INTO [dbo].[product]
    (
        [ProductName],
        [Description],
        [SKU],
        [CategoryID],
        [Price],
        [DiscountID]
    )
VALUES (
    @ProductName,
    @Description,
    @SKU,
    @CategoryID,
    @Price,
    @DiscountID
)

SELECT SCOPE_IDENTITY() AS ProductID