use mydatabase

SELECT [Email], [reset_token_expiry]
FROM [dbo].[Users]
WHERE reset_token = @token