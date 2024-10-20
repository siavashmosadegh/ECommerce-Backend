use mydatabase;

ALTER TABLE Product
ADD CONSTRAINT FK_Product_Category 
    FOREIGN KEY (CategoryID) 
    REFERENCES Category (CategoryID)
    ON DELETE CASCADE
    ON UPDATE CASCADE;