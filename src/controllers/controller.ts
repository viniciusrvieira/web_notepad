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

function createFile(req: Request, res: Response) {
  const { query } = req;
  const response: Object = service.createFile(query.url, query.name);
  res.send(response);
}
function createFolder(req: Request, res: Response) {
  const { query } = req;
  const response: Object = service.createFolder(query.url, query.name);
  res.send(response);
}

module.exports = { readPath, updatePath, createFile, createFolder };
