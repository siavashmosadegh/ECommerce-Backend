use mydatabase;

INSERT INTO [dbo].[OTPs] (
    otpCode,
    phoneNumber,
    expiresAt,
    userId,
    guestId,
    isUsed
) Values (
    @otpCode,
    @phoneNumber,
    @expiresAt,
    @userId,
    @guestId,
    0
)