use mydatabase;

CREATE TABLE [dbo].[ProductInventory] (
    [ProductInventoryID] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT (newid()) NOT NULL,
    [Quantity]           INT      NOT NULL,
    [CreatedAt]          DATETIME NULL       DEFAULT (getdate()),
    [ModifiedAt]         DATETIME NULL,
    [DeletedAt]          DATETIME NULL,
);