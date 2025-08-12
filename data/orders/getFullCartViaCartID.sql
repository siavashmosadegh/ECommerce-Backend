use mydatabase;

SELECT 
    CI.CartId,
    CI.CartItemId,
    CI.CreatedAt AS CartItemCreatedAt,
    CI.ProductID AS CartItemProductId,
    CI.Quantity,
    P.CarID,
    P.CategoryID,
    P.CreatedAt AS ProductCreatedAt,
    P.DeletedAt,
    P.Description,
    P.DiscountID,
    P.ModifiedAt,
    P.Price,
    P.ProductID,
    P.ProductInventoryID,
    P.ProductName,
    P.ProductTypeBrandID,
    P.SKU,
    P.productIsOriginal,
    P.productTypeID
FROM CartItems CI
JOIN Product P ON CI.ProductID = P.ProductID
WHERE CI.CartId = @cartId