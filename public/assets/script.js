var actualFolder = '';

$(document).ready(() => {
  $.get('/api?url=/')
    .then((content) => {
      content.data.forEach((folder) => {
        addFolderToNav(folder);
      });
    })
    .catch((err) => {
      alert(err);
    });
  $(document).on('click', '.folder', (event) => {
    if (!actualFolder) actualFolder = window.location.pathname;
    const folder = $(event.target).text().trim();
    if (event.target.id == 'back') {
      let folderPath = actualFolder.slice(0, actualFolder.lastIndexOf('/'));
      if (!folderPath) folderPath = '/';
      $('#file').css('display', 'none');
      $.get(`/api?url=${folderPath}`)
        .then((res) => {
          actualFolder = folderPath;
          $('#navigation').text('');
          if (actualFolder && actualFolder != '/') {
            addBackButtonToNav();
          }
          res.data.forEach((folder) => {
            addFolderToNav(folder);
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Ops...',
            text: 'Ocorreu um erro interno, tente recarregar a página.',
          });
        });
    } else {
      $.get(`/api?url=${actualFolder}/${folder}`)
        .then((res) => {
          if (res.type == 'files') {
            closeFile();
            actualFolder =
              actualFolder == '/'
                ? `${actualFolder}${folder}`
                : `${actualFolder}/${folder}`;
            $('#navigation').text('');
            if (actualFolder && actualFolder != '/') {
              addBackButtonToNav();
            }
            res.data.forEach((folder) => {
              addFolderToNav(folder);
            });
          } else if (res.type == 'text') {
            openFile({ name: folder, content: res.data });
          } else if (res.code == 401) {
            Swal.fire({
              icon: 'error',
              title: 'Não autorizado',
              text: 'O acesso ao diretório requisitado não foi permitido.',
            });
          } else if (res.code == 404) {
            Swal.fire({
              icon: 'error',
              title: 'Não encontrado',
              text: 'O diretório que você tentou acessar não existe.',
            });
          } else if (res.code == 409) {
            Swal.fire({
              icon: 'error',
              title: 'Ocupado',
              text: 'O diretório que você tentou acessar já está em uso.',
            });
          }
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Ops...',
            text: 'Ocorreu um erro interno, tente recarregar a página.',
          });
        });
    }
  });
  $('#close').on('click', () => {
    closeFile();
  });
});
