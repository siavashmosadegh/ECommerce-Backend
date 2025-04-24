use mydatabase;

SELECT Quantity FROM Product
Inner JOIN ProductInventory
ON Product.ProductInventoryID = ProductInventory.ProductInventoryID
WHERE ProductID = @productId