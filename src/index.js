const express = require('express');
const app = express();

module.exports = config => {
  const port = config.port || 8000;

  app.use('/api', require('./router/api')(config));
  app.use('/', require('./router/app'));

  app.use(require('./errorHandler'));

  app.listen(port, () => console.log(`listening to port ${port}`));
};
