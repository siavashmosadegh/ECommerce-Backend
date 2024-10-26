use mydatabase;

CREATE TABLE CarBrands (
    CarBrandID INT IDENTITY(1,1) PRIMARY KEY,
    CarBrandName NVARCHAR(50) NOT NULL,
    CarBrandNameFarsi NVARCHAR(50) NOT NULL
)