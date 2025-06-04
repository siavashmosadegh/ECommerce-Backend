use mydatabase;

SELECT *
	FROM (
		SELECT
			Product.ProductID,
			Product.ProductName,
			Car.CarModel,
			Car.CarName,
			Car.CarID,
			ROW_NUMBER() OVER (
				PARTITION BY Car.CarModel, Car.CarName, Product.ProductTypeID
				ORDER BY Product.ProductID
			) AS rn,
			Car.CarModelFarsi,
			Car.CarNameFarsi,
			ProductType.productTypeNameFarsi,
			ProductType.productTypeID
		FROM Product
		INNER JOIN Car ON Product.CarID = Car.CarID
		INNER JOIN ProductType ON Product.ProductTypeID = ProductType.ProductTypeID
		WHERE Product.CategoryID = @CategoryID
	) AS subquery
WHERE rn = 1;