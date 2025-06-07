use mydatabase;

INSERT INTO [dbo].[Cart]
    (
        [UserID]
    )
OUTPUT Inserted.CartId
VALUES (
	@UserID
)