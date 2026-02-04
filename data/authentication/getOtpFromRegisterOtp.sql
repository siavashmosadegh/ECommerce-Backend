use mydatabase;

select * FROM [dbo].[RegisterOTPs]
WHERE
        [PhoneNumber] = @mobile
    AND
        [otpCode] = @otp