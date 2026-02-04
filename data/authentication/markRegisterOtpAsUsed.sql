use mydatabase;

UPDATE [dbo].[RegisterOTPs]
SET [isUsed] = 1
WHERE [RegisterOTPsId] = @RegisterOTPsId