use mydatabase;

INSERT INTO Users (
    [FirstName],
    [LastName],
    [PhoneNumber],
    [PasswordHash],
    [RegistrationType]
)
OUTPUT Inserted.UserID
VALUES (
    @FirstName,
    @LastName,
    @PhoneNumber,
    @PasswordHash,
    @RegistrationType
);