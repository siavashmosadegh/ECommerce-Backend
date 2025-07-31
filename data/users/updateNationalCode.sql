use mydatabase;

UPDATE [dbo].[Users]
SET
    [NationalCode] = @nationalCode
WHERE
    [UserID] = @userId

SELECT *
FROM
    [dbo].[Users]
WHERE
    [UserID] = @userId