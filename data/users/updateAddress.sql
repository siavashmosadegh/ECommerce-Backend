use mydatabase;

UPDATE [dbo].[Users]
SET
    [PostalAddress] = @postalAddress,
    [AddressHouseNumber] = @addressHouseNumber,
    [AddressUnitNumber] = @addressUnitNumber,
    [ZipCode] = @zipCode
WHERE
    [UserID] = @userId

SELECT *
FROM
    [dbo].[Users]
WHERE
    [UserID] = @userId