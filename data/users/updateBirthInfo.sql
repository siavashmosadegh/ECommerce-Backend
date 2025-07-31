use mydatabase;

UPDATE [dbo].[Users]
SET
    [BirthDay] = @birthDay,
    [BirthMonth] = @birthMonth,
    [BirthYear] = @birthYear
WHERE
    [UserID] = @userId

SELECT *
FROM
    [dbo].[Users]
WHERE
    [UserID] = @userId