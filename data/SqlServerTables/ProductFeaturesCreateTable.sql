use mydatabase;

CREATE TABLE [dbo].[ProductFeatures] (
	ProductFeaturesID UNIQUEIDENTIFIER Primary Key DEFAULT (newid()) NOT NULL,
	ProductID Int REFERENCES Product(ProductID),
	Title Nvarchar(255) Not Null,
	Explanation Nvarchar(255) Not null
);