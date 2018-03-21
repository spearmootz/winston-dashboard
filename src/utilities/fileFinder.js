const path = require('path');
const Rx = require('rxjs');
const fs = require('fs-extra');
const util = require('util');
const glob = util.promisify(require('glob'));

const sort = (files, sortBy) =>
  new Promise(resolve => {
    const promises = files.map(file => fs.stat(file));
    Promise.all(promises)
      .then(stats =>
        stats.map((stat, index) => ({
          value: stat[sortBy],
          file: files[index]
        }))
      )
      .then(files => {
        resolve(files.sort(file => file.value).map(file => file.file));
      });
  });

module.exports = config => {
  const files$ = new Rx.BehaviorSubject([]);
  const getSourceFiles = () =>
    glob(config.logFiles, {
      root: config.path
    })
      .then(results => {
        switch (config.orderBy) {
          case 'creationTime':
            return sort(results, 'ctimeMs');
          case 'modifiedTime':
            return sort(results, 'mtimeMs');
          default:
            return results;
        }
      })
      .then(results => {
        files$.next(results);
      })
      .catch(console.error);

  getSourceFiles();
  setInterval(getSourceFiles, 60 * 1000);

  return files$;
};
