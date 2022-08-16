const fs = require("fs");

function readPath(path) {
  try {
    let stat = fs.lstatSync(decodeURI(path));
    if (stat.isFile())
      return {
        code: 200,
        codeStatus: "OK",
        type: "text",
        data: fs.readFileSync(path, "utf-8"),
      };
    return {
      code: 200,
      codeStatus: "OK",
      type: "files",
      data: fs.readdirSync(path),
    };
  } catch (err) {
    if (err.code == "EPERM") return "Access not permitted";
    if (err.code == "ENOINT") return "Doesn't exist";
  }
}

module.exports = { readPath };
