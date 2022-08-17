const fs = require('fs');

function readPath(path) {
  try {
    let stat = fs.lstatSync(decodeURI(path));
    if (stat.isFile())
      return {
        code: 200,
        codeStatus: 'OK',
        type: 'text',
        data: fs.readFileSync(path, 'utf-8'),
      };
    return {
      code: 200,
      codeStatus: 'OK',
      type: 'files',
      data: fs.readdirSync(path),
    };
  } catch (err) {
    if (err.code == 'EPERM') return { code: 401, codeStatus: 'Unauthorized' };
    if (err.code == 'ENOINT') return { code: 404, codeStatus: 'Not Found' };
    if (err.code == 'EBUSY') return { code: 409, codeStatus: 'Conflict' };
    console.log(err);
  }
}

module.exports = { readPath };
