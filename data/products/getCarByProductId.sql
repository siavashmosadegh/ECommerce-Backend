use mydatabase;

SELECT [dbo].[Car].[CarID],[CarBrandID],[CarModel],[CarModelFarsi],[TrimLevel],[TrimLevelFarsi],[SubTrimLevel],[SubTrimLevelFarsi],[Year],[CarName],[CarNameFarsi],[Engine]
FROM [dbo].[Product]
INNER JOIN [dbo].[Car] ON Product.CarID = Car.CarID
WHERE [ProductID] = @productId