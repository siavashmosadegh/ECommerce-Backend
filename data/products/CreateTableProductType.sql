use mydatabase;

CREATE Table ProductType (
    productTypeID INT IDENTITY(1,1) PRIMARY KEY,
    categoryID INT FOREIGN KEY REFERENCES Category(CategoryID) NOT NULL,
    productTypeName NVARCHAR(50) NOT NULL,
    productTypeNameFarsi NVARCHAR(50) NOT NULL
)