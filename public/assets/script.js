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
    if ($('#add-file-field').is(':visible')) {
      $('#add-file-field').css('display', 'none').children('input').val('');
    }
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
      .then((response) => {
        if (response.data) {
          Swal.mixin({
            toast: true,
            position: 'bottom-right',
            iconColor: 'white',
            customClass: {
              popup: 'colored-toast',
            },
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          }).fire({ icon: 'success', title: 'Arquivo alterado com sucesso!' });
        } else if (response.error) {
          switch (response.error.code) {
            case 401:
              Swal.fire({
                icon: 'error',
                title: 'Não autorizado',
                text: 'Você não tem permissão para alterar esse arquivo.',
              });
              break;
            case 404:
              Swal.fire({
                icon: 'error',
                title: 'Não encontrado',
                text: 'O arquivo que você tentou alterar não existe.',
              });
              break;
            case 409:
              Swal.fire({
                icon: 'error',
                title: 'Ocupado',
                text: 'O arquivo que você tentou alterar está em uso.',
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
  });
  $('#close').on('click', () => {
    closeFile();
  });
  $('#add-file, #add-folder').on('click', (event) => {
    const fieldType = event.currentTarget.id;
    const currentFieldType = $('#add-file-field').attr('action');
    const fieldIsVisible = $('#add-file-field').is(':visible');
    $('#add-file-field input').attr(
      'placeholder',
      fieldType == 'add-file' ? 'Nome do arquivo' : 'Nome da pasta'
    );
    if (fieldIsVisible && currentFieldType != fieldType)
      return $('#add-file-field')
        .attr('action', fieldType)
        .children('input')
        .val('');
    if (fieldIsVisible) $('#add-file-field input').val('');
    $('#add-file-field').toggleClass('d-flex');
    $('#add-file-field').attr('action', fieldType);
  });
  $('#add-file-confirm').on('click', () => {
    const value = $('#add-file-field input').val();
    const action = $('#add-file-field').attr('action');
    const path = $('#path').text();
    if (action == 'add-file') {
      $.post(`/api/file?url=${path}&name=${value}`)
        .then((response) => {
          if (response.data) {
            Swal.mixin({
              toast: true,
              position: 'bottom-right',
              iconColor: 'white',
              customClass: {
                popup: 'colored-toast',
              },
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            }).fire({
              icon: 'success',
              title: 'Arquivo criado com sucesso!',
            });
          } else if (response.error) {
            switch (response.error.code) {
              case 401:
                Swal.fire({
                  icon: 'error',
                  title: 'Não autorizado',
                  text: 'Você não tem permissão para criar o arquivo.',
                });
                break;
              case 404:
                Swal.fire({
                  icon: 'error',
                  title: 'Não encontrado',
                  text: 'O diretório que você tentou criar o arquivo não existe.',
                });
                break;
              case 409:
                Swal.fire({
                  icon: 'error',
                  title: 'Já existente',
                  text: 'O nome do arquivo que você tentou criar já está em uso.',
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
    } else if (action == 'add-folder') {
      $.post(`/api/folder?url=${path}&name=${value}`)
        .then((response) => {
          if (response.data) {
            Swal.mixin({
              toast: true,
              position: 'bottom-right',
              iconColor: 'white',
              customClass: {
                popup: 'colored-toast',
              },
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            }).fire({
              icon: 'success',
              title: 'Pasta criada com sucesso!',
            });
          } else if (response.error) {
            switch (response.error.code) {
              case 401:
                Swal.fire({
                  icon: 'error',
                  title: 'Não autorizado',
                  text: 'Você não tem permissão para criar a pasta.',
                });
                break;
              case 404:
                Swal.fire({
                  icon: 'error',
                  title: 'Não encontrado',
                  text: 'O diretório que você tentou criar a pasta não existe.',
                });
                break;
              case 409:
                Swal.fire({
                  icon: 'error',
                  title: 'Já existente',
                  text: 'O nome da pasta que você tentou criar já está em uso.',
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
});
