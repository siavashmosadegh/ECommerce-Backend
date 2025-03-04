use mydatabase;

CREATE TABLE [dbo].[Product] (
    [ProductID]          UNIQUEIDENTIFIER PRIMARY KEY DEFAULT (newid()) NOT NULL,
    [ProductName]        NVARCHAR (255) NOT NULL,
    [Description]        NTEXT          NOT NULL,
    [SKU]                NVARCHAR (255) NOT NULL,
    [CategoryID]         INT            NULL,
    [Price]              DECIMAL (18)   NOT NULL,
    [DiscountID]         INT            NULL,
    [ProductInventoryID] UNIQUEIDENTIFIER            NULL,
    [CarID]              INT            NOT NULL,
    [productTypeID]      INT            NOT NULL,
    [ProductTypeBrandID] INT            NOT NULL,
    [productIsOriginal]  BIT            NULL,
    [CreatedAt]          DATETIME       DEFAULT (getdate()) NULL,
    [ModifiedAt]         DATETIME       NULL,
    [DeletedAt]          DATETIME       NULL,
    FOREIGN KEY ([CarID]) REFERENCES [dbo].[Car] ([CarID]),
    FOREIGN KEY ([ProductInventoryID]) REFERENCES [dbo].[ProductInventory] ([ProductInventoryID]),
    FOREIGN KEY ([ProductTypeBrandID]) REFERENCES [dbo].[ProductTypeBrand] ([ProductTypeBrandID]),
    FOREIGN KEY ([productTypeID]) REFERENCES [dbo].[ProductType] ([productTypeID]),
    CONSTRAINT [FK_Product_Category] FOREIGN KEY ([CategoryID]) REFERENCES [dbo].[Category] ([CategoryID]) ON DELETE CASCADE ON UPDATE CASCADE
);