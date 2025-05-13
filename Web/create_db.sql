USE [master]
GO

-- Create the BikeRankings database if it doesn't exist
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'BikeRankings')
BEGIN
    CREATE DATABASE [BikeRankings]
END
GO

USE [BikeRankings]
GO

-- Create the Bikes table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Bikes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Bikes](
        [id] [int] IDENTITY(1,1) PRIMARY KEY,
        [rank] [int] NOT NULL,
        [bikerName] [nvarchar](max) NOT NULL,
        [bikerImage] [nvarchar](max) NULL,
        [bikeImage] [nvarchar](max) NULL,
        [bikeBrand] [nvarchar](max) NOT NULL,
        [age] [int] NOT NULL,
        [keyFeature] [nvarchar](max) NULL,
        [overallScore] [int] NOT NULL
    )
END
GO
