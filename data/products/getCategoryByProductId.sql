use mydatabase;

SELECT
        [dbo].[Category].[CategoryID],
        [CategoryName],
		[FarsiCategoryName],
		[dbo].[Category].[Description],
		[CreatedDate]
FROM [dbo].[Category]
JOIN [dbo].[Product]
ON Product.CategoryID = Category.CategoryID
WHERE [ProductID]=@productId