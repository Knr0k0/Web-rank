USE [master]
GO
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'BikeRankings')
BEGIN
    CREATE DATABASE BikeRankings;
END
GO
USE [BikeRankings]
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Bikes]') AND type in (N'U'))
BEGIN
    CREATE TABLE Bikes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        rank INT NOT NULL,
        bikerName NVARCHAR(MAX) NOT NULL,
        bikerImage NVARCHAR(MAX),
        bikeImage NVARCHAR(MAX),
        bikeBrand NVARCHAR(MAX) NOT NULL,
        age INT NOT NULL,
        keyFeature NVARCHAR(MAX),
        overallScore INT NOT NULL
    );
END
