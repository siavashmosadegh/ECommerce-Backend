 use mydatabase;

SELECT TrimLevel
FROM [dbo].[Car]
WHERE CarName = (
    SELECT CarName
    FROM Car
    WHERE CarID = @carId
)
AND CarModel = (
    SELECT CarModel
    FROM Car
    WHERE CarID = @carId
);