use mydatabase;

CREATE TABLE OrderItems (
    OrderItemId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Orders(OrderId),
    ProductId INT,
    Quantity INT,
    Price DECIMAL(10,2)
)