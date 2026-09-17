use mydatabase;

CREATE TABLE [dbo].[OTPs] (
    otpId       INT PRIMARY KEY IDENTITY,
    userId      INT NULL,
    guestId     INT NULL,
    otpCode     NVARCHAR(10) NOT NULL,
    phoneNumber NVARCHAR(20) NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT GETDATE(),
    expiresAt   DATETIME NOT NULL,
    isUsed      BIT DEFAULT 0,

    FOREIGN KEY (userId) REFERENCES Users(UserID),
    FOREIGN KEY (guestId) REFERENCES GuestUsers(GuestID),

    CONSTRAINT CK_OTPs_Owner
      CHECK (
        (userId IS NOT NULL AND guestId IS NULL) OR
        (userId IS NULL AND guestId IS NOT NULL)
      )
);