use mydatabase;

select *
	from (
			select
				ProductID,
				ProductName,
				CarModel,
				CarName,
				ROW_NUMBER() Over (PARTITION BY CarModel,CarName ORDER BY ProductID) As rn,
				CarModelFarsi,
				CarNameFarsi
			From Product
			Inner JOIN Car ON Product.CarID = Car.CarID
			Where productTypeID = @productTypeID
		) AS subquery
where rn = 1
