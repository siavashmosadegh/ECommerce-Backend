CREATE TABLE [dbo].[ProductInventory] (
    [ProductInventoryID] INT      NOT NULL,
    [quantity]           INT      NOT NULL,
    [dateCreatedAt]      DATE     NULL,
    [timeCreatedAt]      TIME (7) NULL,
    [dateModifiedAt]     DATE     NULL,
    [timeModifiedAt]     TIME (7) NULL,
    [dateDeletedAt]      DATE     NULL,
    [timeDeletedAt]      TIME (7) NULL,
    PRIMARY KEY CLUSTERED ([ProductInventoryID] ASC)
);