CREATE TABLE Car (
    CarID INT IDENTITY(1,1) PRIMARY KEY,
    CarBrandID INT REFERENCES CarBrands(CarBrandID) NOT NULL,
    CarModel NVARCHAR(50) NOT NULL,
    CarModelFarsi NVARCHAR(50) NOT Null,
    TrimLevel NVARCHAR(50),
    TrimLevelFarsi NVARCHAR(50),
    SubTrimLevel NVARCHAR(50),
    SubTrimLevelFarsi NVARCHAR(50),
    Year Int
)