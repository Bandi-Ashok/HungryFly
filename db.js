const sql = require('mssql/msnodesqlv8');
require('dotenv').config();

const config = {
  server: 'localhost',
  database: 'HungryFlyDB',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    encrypt: false,
    trustServerCertificate: true
  }
};

let pool = null;
async function getConnection() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('? Connected to SQL Server');
    } catch (err) {
      console.error('? Database connection failed:', err.message);
      throw err;
    }
  }
  return pool;
}
module.exports = { getConnection, sql };
