use mydatabase;

select [ProductType].[productTypeID], [ProductType].[categoryID] , [productTypeName], [productTypeNameFarsi]
from [dbo].[Product]
FULL OUTER JOIN [dbo].[ProductType] ON Product.productTypeID = ProductType.productTypeID
WHERE [ProductID] = @productId