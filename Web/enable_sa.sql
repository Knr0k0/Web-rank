USE [master]
GO
sp_configure 'show advanced options', 1;
GO
RECONFIGURE;
GO
sp_configure 'mixed mode authentication', 1;
GO
RECONFIGURE;
GO
ALTER LOGIN [sa] ENABLE;
GO
ALTER LOGIN [sa] WITH PASSWORD = '123456';
GO
