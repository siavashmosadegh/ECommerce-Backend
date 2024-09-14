use mydatabase;

UPDATE [dbo].[Users]
SET [reset_token] = @reset_token,
    [reset_token_expiry] = @reset_token_expiry
WHERE username = @username