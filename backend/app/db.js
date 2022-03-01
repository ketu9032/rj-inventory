const Pool = require('pg').Pool
exports.pool = new Pool({
  user: 'postgres',
  host: '173.208.211.61',
  database: 'rj-inventory',
  password: 'Realbotz@123',
  port: 5432,
})
