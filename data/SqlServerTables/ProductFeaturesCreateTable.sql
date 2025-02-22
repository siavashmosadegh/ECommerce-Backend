use mydatabase;

CREATE TABLE [dbo].[ProductFeatures] (
    [ProductFeaturesID] UNIQUEIDENTIFIER Primary Key DEFAULT (newid()) NOT NULL,
    [ProductID]         UNIQUEIDENTIFIER NOT NULL,
    [Title]             NVARCHAR (255)   NOT NULL,
    [Explanation]       NVARCHAR (255)   NOT NULL,
    FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Product] ([ProductID])
);