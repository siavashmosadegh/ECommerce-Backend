CREATE TABLE [dbo].[CarBrands] (
    [CarBrandID]        INT           IDENTITY (1, 1) NOT NULL,
    [CarBrandName]      NVARCHAR (50) NOT NULL,
    [CarBrandNameFarsi] NVARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([CarBrandID] ASC)
);