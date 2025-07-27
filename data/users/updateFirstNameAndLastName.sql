use mydatabase;

UPDATE [dbo].[Users]
SET
    [FirstName] = @firstName,
    [LastName] = @lastName
WHERE
    [UserID] = @userId

SELECT *
FROM
    [dbo].[Users]
WHERE
    [UserID] = @userId