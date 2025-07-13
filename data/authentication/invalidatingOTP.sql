use mydatabase;

UPDATE [dbo].[OTPs]
SET isUsed = 1
WHERE otpId = @otpId