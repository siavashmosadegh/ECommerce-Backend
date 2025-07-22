use mydatabase;

INSERT INTO [dbo].[OTPs] 
    (
        [otpCode],
        [phoneNumber],
        [expiresAt],
        [UserID]
)
VALUES
    (
        @otpCode,
        @phoneNumber,
        @expiresAt,
        @userId
)