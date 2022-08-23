const service = require('../services/service');
const { XMLBuilder } = require('fast-xml-parser');
const builder = new XMLBuilder();

function readPath(req, res) {
  const { query } = req;
  const pathContent = service.readPath(`${query.url}`);
  if (query.format && query.format == 'xml')
    return res
      .set('Content-Type', 'application/xml')
      .send(builder.build(pathContent));
  res.set('Content-Type', 'application/json').send(pathContent);
}
function updatePath(req, res) {
  const { query } = req;
  console.log(query);
}

module.exports = { readPath, updatePath };
