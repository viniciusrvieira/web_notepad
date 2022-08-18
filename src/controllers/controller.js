const fs = require('fs');

function readPath(path) {
  try {
    let stat = fs.lstatSync(decodeURI(path));
    if (stat.isFile())
      return {
        data: {
          kind: 'text',
          charset: 'utf-8',
          content: fs.readFileSync(path, 'utf-8'),
        },
      };
    return {
      data: {
        kind: 'files',
        content: fs.readdirSync(path),
      },
    };
  } catch (err) {
    switch (err.code) {
      case 'EPERM':
        return {
          error: { code: 401, message: 'No permission to file access' },
        };
      case 'ENOENT':
        return { error: { code: 404, message: 'File not found' } };
      case 'EBUSY':
        return { error: { code: 409, message: 'File is already being used' } };
      default:
        console.log(err);
    }
  }
}

module.exports = { readPath };
