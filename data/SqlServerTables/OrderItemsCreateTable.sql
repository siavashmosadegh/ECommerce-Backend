CREATE TABLE [dbo].[OrderItems] (
    [OrderItemId] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [OrderId]     UNIQUEIDENTIFIER NULL,
    [ProductId]   INT              NULL,
    [Quantity]    INT              NULL,
    [Price]       DECIMAL (10, 2)  NULL,
    PRIMARY KEY CLUSTERED ([OrderItemId] ASC),
    FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Orders] ([OrderId])
);