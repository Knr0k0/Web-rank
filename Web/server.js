const express = require('express');
const mssql = require('mssql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Cấu hình để sử dụng body-parser - tăng giới hạn kích thước để xử lý ảnh
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Cấu hình kết nối SQL Server
const sqlConfig = {
  server: 'localhost',
  database: 'BikeRankings',
  user: 'sa',
  password: '123456',
  options: {
    trustServerCertificate: true,
    encrypt: false,
    enableArithAbort: true,
    instanceName: 'LETAI'
  }
};

// Đảm bảo Express phục vụ các tệp tĩnh như HTML, CSS, JS
app.use(express.static(path.join(__dirname, 'track-bike-ranking')));

// Định nghĩa route cho trang chủ
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'track-bike-ranking', 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error loading index.html');
    }
  });
});

// Create a connection pool
const pool = new mssql.ConnectionPool(sqlConfig);
const poolConnect = pool.connect();

// Định nghĩa route để thêm xe đạp vào cơ sở dữ liệu
app.post('/add-bike', async (req, res) => {
  const { rank, bikerName, bikerImage, bikeImage, bikeBrand, age, keyFeature, overallScore } = req.body;

  try {
    // Ensure pool is connected
    await poolConnect;

    // Create Request object
    const request = pool.request();

    // Add parameters
    request.input('rank', mssql.Int, rank);
    request.input('bikerName', mssql.NVarChar, bikerName);
    request.input('bikerImage', mssql.NVarChar(mssql.MAX), bikerImage);
    request.input('bikeImage', mssql.NVarChar(mssql.MAX), bikeImage);
    request.input('bikeBrand', mssql.NVarChar, bikeBrand);
    request.input('age', mssql.Int, age);
    request.input('keyFeature', mssql.NVarChar, keyFeature);
    request.input('overallScore', mssql.Int, overallScore);

    // Execute query
    const query = `
      INSERT INTO Bikes (rank, bikerName, bikerImage, bikeImage, bikeBrand, age, keyFeature, overallScore)
      VALUES (@rank, @bikerName, @bikerImage, @bikeImage, @bikeBrand, @age, @keyFeature, @overallScore)
    `;
    
    await request.query(query);

    res.status(200).send({ message: 'Bike added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error adding bike.' });
  }
});

// Định nghĩa route để lấy danh sách xe đạp
app.get('/api/bikes', async (req, res) => {
  try {
    // Ensure pool is connected
    await poolConnect;

    // Create Request object
    const request = pool.request();

    // Execute query to get all bikes, ordered by rank
    const result = await request.query(`
      SELECT id, rank, bikerName, bikerImage, bikeImage, bikeBrand, age, keyFeature, overallScore 
      FROM Bikes 
      ORDER BY rank ASC
    `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching bikes:', error);
    res.status(500).json({ message: 'Error fetching bikes data.' });
  }
});

// Lắng nghe yêu cầu tại cổng 3000
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
