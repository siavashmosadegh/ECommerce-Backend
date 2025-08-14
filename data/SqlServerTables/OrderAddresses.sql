use mydatabase;

CREATE TABLE [dbo].[OrderAddresses] (
    OrderAddressID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID        UNIQUEIDENTIFIER NOT NULL,

    Line1          NVARCHAR(255) NOT NULL,
    Line2          NVARCHAR(255) NULL,
    City           NVARCHAR(120) NOT NULL,
    Province       NVARCHAR(120) NULL,
    PostalCode     NVARCHAR(20)  NULL,
    CountryCode    NCHAR(2)      NOT NULL DEFAULT 'IR',

    Latitude       DECIMAL(9,6)  NULL,
    Longitude      DECIMAL(9,6)  NULL,

    CreatedAt      DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_OrderAddresses_Orders
        FOREIGN KEY (OrderID) REFERENCES dbo.Orders(OrderID)
);