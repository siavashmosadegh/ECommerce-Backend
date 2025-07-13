use mydatabase;

SELECT TOP 1 * FROM [dbo].[OTPs]
WHERE
    phoneNumber = @phoneNumber
    AND otpCode = @otpCode
    AND isUsed = 0
    AND expiresAt >= SYSDATETIMEOFFSET()

ORDER BY otpId DESC