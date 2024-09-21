use mydatabase;

UPDATE [dbo].[Users]
SET [PasswordHash] = @hashedPassword
WHERE UserID = @userId