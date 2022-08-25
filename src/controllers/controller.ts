import { Request, Response } from 'express';

const service = require('../services/service');
const { XMLBuilder } = require('fast-xml-parser');
const builder = new XMLBuilder();

function readPath(req: Request, res: Response) {
  const { query } = req;
  const pathContent: string[] = service.readPath(`${query.url}`);
  if (query.format && query.format == 'xml')
    return res
      .set('Content-Type', 'application/xml')
      .send(builder.build(pathContent));
  res.set('Content-Type', 'application/json').send(pathContent);
}
function updatePath(req: Request, res: Response) {
  const { query } = req;
  res
    .set('Content-Type', 'application/json')
    .send(service.updatePath(query.url, query.text));
}

module.exports = { readPath, updatePath };
