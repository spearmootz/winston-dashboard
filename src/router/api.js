const path = require('path');
const moment = require('moment');
const express = require('express');
const fileFinder = require('../utilities/fileFinder');
const getLogger = require('../utilities/getLogger');


module.exports = config => {
  const router = express.Router();
  let sources = {};
  let sourceNames;
  const validSource = (source) => source != null && sources[source] != null;

  fileFinder(config).subscribe(files => {
    sourceNames = files.map(filePath => path.relative(config.path, filePath));
    sources = {};
    sourceNames.forEach(sourceName => {
      sources[sourceName] = getLogger(path.join(config.path, sourceName));
    });
  })

  router.use('/sources', (req, res, next) => {
    res.send(sourceNames);
  });

  router.use('/query', (req, res, next) => {
    const { source, query } = req.query;

    if (!validSource(source)) {
      return res.send('did not work');
    }

    const options = JSON.parse(query);
    options.from = moment().subtract(100, 'years');
    options.until = moment().add(1, 'days');
    options.order = 'asc';

    sources[source].query(options, (error, results) => {
      if (error) {
        return res.send('did not work');
      }

      res.send(results);
    });

  });

  return router;
};