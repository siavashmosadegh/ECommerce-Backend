use mydatabase;

SELECT *
FROM [dbo].[Product]
INNER JOIN [dbo].[Car] ON Product.CarID = Car.CarID
WHERE [productTypeID] = @productTypeId
AND CarName = (
    SELECT CarName
    FROM Car
    WHERE CarID = @carId
)
AND CarModel = (
    SELECT CarModel
    FROM Car
    WHERE CarID = @carId
);