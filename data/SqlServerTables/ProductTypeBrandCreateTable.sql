use mydatabase;

CREATE TABLE [dbo].[ProductTypeBrand] (
	[ProductTypeBrandID]        INT PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[ProductTypeID]             INT REFERENCES ProductType(productTypeID) NOT NULL,
	[ProductTypeBrandName]      NVARCHAR(50) NOT NULL,
	[ProductTypeBrandNameFarsi] NVARCHAR(50) NOT NULL
)