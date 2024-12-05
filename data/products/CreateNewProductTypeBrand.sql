use mydatabase;

INSERT INTO [dbo].[ProductTypeBrand]
    (
        [ProductTypeBrandName],
        [ProductTypeBrandNameFarsi]
    )
VALUES (
    @ProductTypeBrandName,
    @ProductTypeBrandNameFarsi
)