const winston = require('winston');

module.exports = filePath =>
  new winston.transports.File({ filename: filePath });
