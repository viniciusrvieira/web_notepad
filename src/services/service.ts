import { Stats } from 'fs';

const fs = require('fs');

function readPath(path: string): Object {
  try {
    let stat: Stats = fs.lstatSync(decodeURI(path));
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
        items: fs.readdirSync(path).map((file: string) => {
          try {
            let stat: Stats = fs.lstatSync(decodeURI(`${path}/${file}`));
            if (stat.isFile()) return { kind: 'file', name: file };
            if (stat.isDirectory()) return { kind: 'folder', name: file };
            return { kind: 'unknown', name: file };
          } catch (err: any) {
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
  } catch (err: any) {
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
        return err;
    }
  }
}
function updatePath(url: string, text: string): Object {
  try {
    fs.writeFileSync(url, text, 'utf8');
    return { data: { message: 'Successfully updated!' } };
  } catch (err: any) {
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
        return err;
    }
  }
}
module.exports = { readPath, updatePath };
