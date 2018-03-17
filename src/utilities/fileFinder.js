const path = require('path');
const Rx = require('rxjs');
const util = require('util');
const glob = util.promisify(require('glob'));

module.exports = config => {
  const files$ = new Rx.BehaviorSubject([]);
  const getSourceFiles = () =>
    glob(config.logFiles, {
      root: config.path
    })
      .then(result => files$.next(result))
      .catch(console.error);

  getSourceFiles();
  setInterval(getSourceFiles, 60 * 1000);

  return files$;
};
