use mydatabase;

INSERT INTO [dbo].[ProductFeatures] (
    [ProductID],
    [Title],
    [Explanation]
) Values (
    @ProductID,
    @Title,
    @Explanation
)