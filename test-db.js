const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'HungryFlyDB',
  authentication: {
    type: 'default',
    options: {
      userName: '', // empty for Windows auth
      password: ''
    }
  },
  options: {
    trustedConnection: true,
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function test() {
  try {
    await sql.connect(config);
    console.log('Connected!');
    const result = await sql.query`SELECT 1 as test`;
    console.log(result);
    await sql.close();
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
