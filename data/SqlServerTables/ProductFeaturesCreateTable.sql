use mydatabase;

CREATE TABLE [dbo].[ProductFeatures] (
    [ProductFeaturesID] UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [ProductID]         INT              NOT NULL,
    [Title]             NVARCHAR (255)   NOT NULL,
    [Explanation]       NVARCHAR (255)   NOT NULL,
    PRIMARY KEY CLUSTERED ([ProductFeaturesID] ASC),
    FOREIGN KEY ([ProductID]) REFERENCES [dbo].[Product] ([ProductID])
);

