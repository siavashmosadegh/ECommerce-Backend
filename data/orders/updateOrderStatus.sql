use mydatabase;

UPDATE [dbo].[Orders]
SET [Status] = @Status
WHERE OrderId = @OrderId