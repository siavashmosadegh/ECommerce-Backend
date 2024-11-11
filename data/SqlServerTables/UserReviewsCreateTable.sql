CREATE TABLE [dbo].[UserReviews] (
    [id]            UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    [userId]        INT              NULL,
    [productId]     INT              NULL,
    [rating]        INT              NULL,
    [reviewText]    TEXT             NULL,
    [createdAtDate] DATETIME         DEFAULT (getdate()) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    FOREIGN KEY ([productId]) REFERENCES [dbo].[Product] ([ProductID]),
    FOREIGN KEY ([userId]) REFERENCES [dbo].[Users] ([UserID])
);