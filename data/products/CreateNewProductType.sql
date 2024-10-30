use mydatabase;

INSERT INTO [dbo].[ProductType]
    (
        [categoryID],
        [productTypeName],
        [productTypeNameFarsi]
    )
VALUES (
    @categoryID,
    @productTypeName,
    @productTypeNameFarsi
)