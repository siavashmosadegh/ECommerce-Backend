use mydatabase;

INSERT INTO [dbo].[Users]
    (
        [UserName],
        [Email],
        [PasswordHash],
        [Role]
    )
VALUES (
    @username,
    @email,
    @passwordHash,
    @role
    )