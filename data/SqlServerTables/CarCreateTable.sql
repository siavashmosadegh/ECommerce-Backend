use mydatabase;

CREATE TABLE [dbo].[Car] (
    [CarID]             INT           IDENTITY (1, 1) NOT NULL,
    [CarBrandID]        INT           NOT NULL,
    [CarModel]          NVARCHAR (50) NOT NULL,
    [CarModelFarsi]     NVARCHAR (50) NOT NULL,
    [TrimLevel]         NVARCHAR (50) NULL,
    [TrimLevelFarsi]    NVARCHAR (50) NULL,
    [SubTrimLevel]      NVARCHAR (50) NULL,
    [SubTrimLevelFarsi] NVARCHAR (50) NULL,
    [Year]              INT           NULL,
    [CarName]           NVARCHAR (50) NOT NULL,
    [CarNameFarsi]      NVARCHAR (50) NOT NULL,
    PRIMARY KEY CLUSTERED ([CarID] ASC),
    FOREIGN KEY ([CarBrandID]) REFERENCES [dbo].[CarBrands] ([CarBrandID])
);