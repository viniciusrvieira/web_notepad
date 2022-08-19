const controller = require('../controllers/controller');
const { XMLBuilder } = require('fast-xml-parser');
const builder = new XMLBuilder();

function readPath(req, res) {
  const { query } = req;
  const pathContent = controller.readPath(`${query.url}`);
  if (query.format && query.format == 'xml')
    return res
      .set('Content-Type', 'application/xml')
      .send(builder.build(pathContent));
  res.set('Content-Type', 'application/json').send(pathContent);
}
module.exports = { readPath };
