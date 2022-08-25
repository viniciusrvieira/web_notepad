const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const app = express();
const PORT = 3000;
import { Request, Response } from 'express';

app
  .use(express.urlencoded({ extended: true }))
  .use(express.static(`${process.cwd()}/public/assets`))
  .use(bodyParser.json())
  .engine('html', require('ejs').renderFile)
  .set('view engine', 'html')
  .set('views', `${process.cwd()}/public`)
  .listen(PORT, () => {
    console.log(`Web Notepad is running on ${PORT}`);
  });
app.use('/api', router);
app.get('/', (req: Request, res: Response) => {
  res.render('index');
});
