import { createRef, memo } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function File(props) {
  const content = createRef();
  const closeFile = () => {
    props.setFileDisplay('none');
    props.setFileDetails({ name: '', content: '' });
  };

  const saveContent = () => {
    const newContent = content.current.innerText;
    const filePath =
      props.url == '/'
        ? `${props.url}${props.fileDetails.name}`
        : `${props.url}/${props.fileDetails.name}`;
    fetch(`http://localhost:4000/api?url=${filePath}&text=${newContent}`, {
      method: 'PATCH',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) throw data;
        MySwal.mixin({
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
      })
      .catch((response) => {
        if (!response.error) {
          return MySwal.fire({
            icon: 'error',
            title: 'Ops...',
            text: 'Ocorreu um erro interno, tente recarregar a página.',
          });
        }
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
      });
  };

  return (
    <div style={{ display: props.fileDisplay }} id="file">
      <div id="header">
        <div id="filename">{props.fileDetails.name}</div>
        <div onClick={closeFile} id="close"></div>
      </div>
      <div
        ref={content}
        suppressContentEditableWarning="true"
        contentEditable="true"
        id="content"
      >
        {props.fileDetails.content}
      </div>
      <div onClick={saveContent} id="save">
        <button>Salvar</button>
      </div>
    </div>
  );
}

export default memo(File);
