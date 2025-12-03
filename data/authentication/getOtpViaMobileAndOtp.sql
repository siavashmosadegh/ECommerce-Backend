use mydatabase;

select * FROM [dbo].[OTPs]
WHERE
    [PhoneNumber] = @mobile
    AND
    [otpCode] = @otpCode