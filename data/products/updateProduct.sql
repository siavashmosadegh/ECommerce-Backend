UPDATE [dbo].[Product]
SET [ProductName]=@ProductName,
    [Description]=@Description,
    [SKU]=@SKU,
    [CategoryID]=@CategoryID,
    [InventoryID]=@InventoryID,
    [Price]=@Price,
    [DiscountID]=@DiscountID
WHERE [productId]=@productId

SELECT *
    FROM [dbo].[Product]
    WHERE [productId]=@productId