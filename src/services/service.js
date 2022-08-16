const controller = require('../controllers/controller');

function readPath(req, res) {
  const { query } = req;
  const pathContent = controller.readPath(
    `${process.cwd()}/txt_files${query.url}`
  );
  res.send(pathContent);
}
function renderPage(req, res) {
  res.render('index');
}
module.exports = { readPath, renderPage };
