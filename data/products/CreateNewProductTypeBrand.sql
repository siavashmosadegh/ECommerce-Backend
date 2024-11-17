use mydatabase;

INSERT INTO [dbo].[ProductTypeBrand]
    (
        [ProductTypeID],
        [ProductTypeBrandName],
        [ProductTypeBrandNameFarsi]
    )
VALUES (
    @ProductTypeID,
    @ProductTypeBrandName,
    @ProductTypeBrandNameFarsi
)