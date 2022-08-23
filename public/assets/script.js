var actualFile = '';

$(document).ready(() => {
  $.get('/api?url=/')
    .then((response) => {
      updatePath('/');
      response.data.items.forEach((file) => {
        addItemToNav(file);
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
    const file = $(event.currentTarget).text().trim();
    if (!actualFile) actualFile = window.location.pathname;
    if (event.currentTarget.id == 'back') {
      let filePath = actualFile.slice(0, actualFile.lastIndexOf('/'));
      if (!filePath) filePath = '/';
      $('#file').css('display', 'none');
      $.get(`/api?url=${filePath}`)
        .then((response) => {
          actualFile = filePath;
          updatePath(actualFile);
          $('#navigation-content').text('');
          if (actualFile && actualFile != '/') {
            addBackButtonToNav();
          }
          response.data.items.forEach((file) => {
            addItemToNav(file);
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
      let url = actualFile == '/' ? `/${file}` : `${actualFile}/${file}`;
      $.get(`/api?url=${url}`)
        .then((response) => {
          if (response.data) {
            switch (response.data.kind) {
              case 'files':
                updatePath(url);
                closeFile();
                actualFile =
                  actualFile == '/'
                    ? `${actualFile}${file}`
                    : `${actualFile}/${file}`;
                $('#navigation-content').text('');
                if (actualFile && actualFile != '/') {
                  addBackButtonToNav();
                }
                response.data.items.forEach((file) => {
                  addItemToNav(file);
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
  $('#save button').on('click', () => {
    const newContent = $('#content').text();
    const path = $('#path').text() == '/' ? '' : $('#path').text();
    const filename = $('#filename').text();
    $.ajax({
      type: 'PATCH',
      url: `/api?url=${path}/${filename}&text=${newContent}`,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        alert(err);
      });
  });
  $('#close').on('click', () => {
    closeFile();
  });
});
