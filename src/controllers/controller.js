const fs = require('fs');

function readPath(path) {
  try {
    let stat = fs.lstatSync(decodeURI(path));
    if (stat.isFile()) return fs.readFileSync(path, 'utf-8');
    return fs.readdirSync(path);
  } catch (err) {
    if (err.code == 'EPERM') return 'Access not permitted';
    if (err.code == 'ENOINT') return "Doesn't exist";
  }
}

module.exports = { readPath };
