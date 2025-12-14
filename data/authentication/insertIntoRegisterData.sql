use mydatabase;

INSERT INTO [dbo].[RegisterOTPs] (
    [otpCode],
	[PhoneNumber],
	[FirstName],
	[LastName],
	[PasswordHash],
    [expiresAt]
)

OUTPUT Inserted.RegisterOTPsId

VALUES (
    @otpCode,
    @PhoneNumber,
    @FirstName,
    @LastName,
    @PasswordHash,
    @expiresAt
);