use mydatabase

CREATE TABLE [dbo].[UserReviews] (
    [UserReviewsID] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT (newid()) NOT NULL,
    [UserId]        INT              NULL,
    [ProductId]     UNIQUEIDENTIFIER NULL,
    [Rating]        INT              NULL,
    [ReviewText]    TEXT             NULL,
    [CreatedAtDate] DATETIME         DEFAULT (getdate()) NULL,
    FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([ProductID]),
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users] ([UserID])
);