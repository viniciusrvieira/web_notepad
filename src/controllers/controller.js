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
        items: fs.readdirSync(path).map((file) => {
          try {
            let stat = fs.lstatSync(decodeURI(`${path}/${file}`));
            if (stat.isFile()) return { kind: 'file', name: file };
            if (stat.isDirectory()) return { kind: 'folder', name: file };
            return { kind: 'unknown', name: file };
          } catch (err) {
            switch (err.code) {
              case 'EPERM':
                return { kind: 'restricted_file', name: file };
              case 'EBUSY':
                return { kind: 'busy_file', name: file };
              default:
                return err;
            }
          }
        }),
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
