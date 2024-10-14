use mydatabase;

CREATE TABLE UserReviews (
    id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    userId INT FOREIGN KEY REFERENCES Users(UserID),
    productId INT FOREIGN KEY REFERENCES Product(ProductID),
    rating INT,
    reviewText TEXT,
    createdAtDate DATETIME DEFAULT GETDATE()
)