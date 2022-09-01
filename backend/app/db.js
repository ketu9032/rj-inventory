const Pool = require('pg').Pool
exports.pool = new Pool({
  user: 'developer',
  host: '173.208.182.211',
  database: 'rj-inventory',
  password: 'developer',
  port: 5432,
})


