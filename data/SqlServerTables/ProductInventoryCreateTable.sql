CREATE TABLE [dbo].[ProductInventory] (
    [ProductInventoryID] INT      NOT NULL,
    [quantity]           INT      NOT NULL,
    [CreatedAt]          DATETIME NULL,
    [ModifiedAt]         DATETIME NULL,
    [DeletedAt]          DATETIME NULL,
    PRIMARY KEY CLUSTERED ([ProductInventoryID] ASC)
);