const mysql = require('mysql2');
const cfg = require('./db-details');
module.exports = {
  getConnection: () => mysql.createConnection(cfg)
};
