use mydatabase;

CREATE TABLE [dbo].[ProductTypeBrand] (
    [ProductTypeBrandID]        INT           IDENTITY (1, 1) NOT NULL,
    [ProductTypeBrandName]      NVARCHAR (50) NOT NULL,
    [ProductTypeBrandNameFarsi] NVARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([ProductTypeBrandID] ASC)
);

