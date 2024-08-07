INSERT INTO [dbo].[product]
    (
        [ProductName],
        [Description],
        [SKU],
        [CategoryID],
        [InventoryID],
        [Price],
        [DiscountID]
    )
VALUES (
    @ProductName,
    @Description,
    @SKU,
    @CategoryID,
    @InventoryId,
    @Price,
    @DiscountID
)

SELECT SCOPE_IDENTITY() AS ProductID