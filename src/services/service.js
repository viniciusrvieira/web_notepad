const controller = require('../controllers/controller');

function readPath(req, res) {
  const { query } = req;
  const pathContent = controller.readPath(`${query.url}`);
  res.send(pathContent);
}
module.exports = { readPath };
