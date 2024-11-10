CREATE TABLE [dbo].[Orders] (
    [OrderId]         UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [UserID]          INT              NULL,
    [TotalPrice]      DECIMAL (10, 2)  NULL,
    [ShippingAddress] NVARCHAR (255)   NULL,
    [Status]          NVARCHAR (50)    NULL,
    [CreatedAt]       DATETIME         DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([OrderId] ASC),
    FOREIGN KEY ([UserID]) REFERENCES [dbo].[Users] ([UserID])
);