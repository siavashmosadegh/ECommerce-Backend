use mydatabase;

UPDATE [dbo].[Users]
SET [PasswordHash] = @hashedPassword,
    [reset_token] = NULL,
    [reset_token_expiry] = NULL
WHERE Email = @email