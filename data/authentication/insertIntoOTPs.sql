use mydatabase;

INSERT INTO [dbo].[OTPs] 
    (
        [otpCode],
        [phoneNumber],
        [expiresAt]
)
VALUES
    (
        @otpCode,
        @phoneNumber,
        @expiresAt
)