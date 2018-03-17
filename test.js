const path = require('path');
const winstonServer = require('./src/index');

winstonServer({
  path: path.join(__dirname, '/logs'),
  logFiles: '/**/*.log',
  port: 8000
});