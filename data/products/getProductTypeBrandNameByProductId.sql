use mydatabase;

SELECT [ProductTypeBrandNameFarsi]
FROM [dbo].[Product]
FULL OUTER JOIN [dbo].[ProductTypeBrand] ON Product.ProductTypeBrandID = ProductTypeBrand.ProductTypeBrandID
WHERE [ProductId] = @productId