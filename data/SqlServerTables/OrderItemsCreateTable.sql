use mydatabase

CREATE TABLE [dbo].[OrderItems] (
    [OrderItemId] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [OrderId]     UNIQUEIDENTIFIER NOT NULL,
    [ProductId]   UNIQUEIDENTIFIER NOT NULL,
    [Quantity]    INT              NOT NULL,
    [Price]       DECIMAL (10, 2)  NULL,
    FOREIGN KEY ([OrderId]) REFERENCES [dbo].[Orders] ([OrderId])
);