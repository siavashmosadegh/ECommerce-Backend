use mydatabase;

select *
	from (
			select
				ProductID,
				ProductName,
				CarModel,
				CarName,
				Car.CarID,
				ROW_NUMBER() Over (PARTITION BY CarModel,CarName,productTypeID ORDER BY ProductID) As rn,
				CarModelFarsi,
				CarNameFarsi
			From Product
			Inner JOIN Car ON Product.CarID = Car.CarID
			Where productTypeID = @productTypeID
		) AS subquery
where rn = 1
