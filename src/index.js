const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const app = express();
const PORT = 3000;

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
app.use('/', router);
