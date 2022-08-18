var actualFile = '';

$(document).ready(() => {
  $.get('/api?url=/')
    .then((response) => {
      response.data.content.forEach((file) => {
        addFileToNav(file);
      });
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Ops...',
        text: 'Ocorreu um erro interno, tente recarregar a página.',
      });
    });
  $(document).on('click', '.file', (event) => {
    const file = $(event.target).text().trim();
    if (!actualFile) actualFile = window.location.pathname;
    if (event.target.id == 'back') {
      let filePath = actualFile.slice(0, actualFile.lastIndexOf('/'));
      if (!filePath) filePath = '/';
      $('#file').css('display', 'none');
      $.get(`/api?url=${filePath}`)
        .then((response) => {
          actualFile = filePath;
          $('#navigation').text('');
          if (actualFile && actualFile != '/') {
            addBackButtonToNav();
          }
          response.data.content.forEach((file) => {
            addFileToNav(file);
          });
        })
        .catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Ops...',
            text: 'Ocorreu um erro interno, tente recarregar a página.',
          });
        });
    } else {
      $.get(`/api?url=${actualFile}/${file}`)
        .then((response) => {
          if (response.data) {
            switch (response.data.kind) {
              case 'files':
                closeFile();
                actualFile =
                  actualFile == '/'
                    ? `${actualFile}${file}`
                    : `${actualFile}/${file}`;
                $('#navigation').text('');
                if (actualFile && actualFile != '/') {
                  addBackButtonToNav();
                }
                response.data.content.forEach((file) => {
                  addFileToNav(file);
                });
                break;
              case 'text':
                openFile({ name: file, content: response.data.content });
                break;
            }
          } else if (response.error) {
            switch (response.error.code) {
              case 401:
                Swal.fire({
                  icon: 'error',
                  title: 'Não autorizado',
                  text: 'O acesso ao diretório requisitado não foi permitido.',
                });
                break;
              case 404:
                Swal.fire({
                  icon: 'error',
                  title: 'Não encontrado',
                  text: 'O diretório que você tentou acessar não existe.',
                });
                break;
              case 409:
                Swal.fire({
                  icon: 'error',
                  title: 'Ocupado',
                  text: 'O diretório que você tentou acessar já está em uso.',
                });
                break;
            }
          }
        })
        .catch(() => {
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
