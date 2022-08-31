import { useState, useEffect, createRef, memo } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function FileIcon(props) {
  switch (props.kind) {
    case 'file':
      return <i className="fa-solid fa-file"></i>;
    case 'folder':
      return <i className="fa-solid fa-folder"></i>;
    case 'busy_file':
      return <i className="fa-solid fa-rotate"></i>;
    case 'restricted_file':
      return <i className="fa-solid fa-ban"></i>;
    case 'unknown':
      return <i className="fa-solid fa-circle-question"></i>;
    default:
      return;
  }
}

function Navigation(props) {
  const [files, setFiles] = useState([]);
  const [filePath, setFilePath] = useState('/');
  const [fileName, setFileName] = useState('');
  const [addFileFieldDisplay, setAddFileFieldDisplay] = useState('none');
  const [addFileFieldPlaceholder, setAddFileFieldPlaceholder] = useState('');
  const [action, setAction] = useState('');
  const newFileName = createRef();

  const addFile = (event) => {
    const parent = event.currentTarget.parentElement;
    const type =
      parent.getAttribute('action') == 'add-file' ? 'file' : 'folder';
    fetch(
      `http://localhost:4000/api/${type}?url=${filePath}&name=${newFileName.current.value}`,
      {
        method: 'POST',
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const createString = type == 'file' ? 'Arquivo criado' : 'Pasta criada';
        if (data.error) throw data;
        setFiles([...files, { kind: type, name: newFileName.current.value }]);
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
        }).fire({
          icon: 'success',
          title: `${createString} com sucesso!`,
        });
      })
      .catch((response) => {
        const typeString = type == 'file' ? 'o arquivo' : 'a pasta';
        if (!response.error) {
          return MySwal.fire({
            icon: 'error',
            title: 'Ops...',
            text: 'Ocorreu um erro interno, tente recarregar a página.',
          });
        }
        switch (response.error.code) {
          case 401:
            MySwal.fire({
              icon: 'error',
              title: 'Não autorizado',
              text: `Você não tem permissão para criar ${typeString}.`,
            });
            break;
          case 404:
            MySwal.fire({
              icon: 'error',
              title: 'Não encontrado',
              text: `O diretório que você tentou criar ${typeString} não existe.`,
            });
            break;
          case 409:
            MySwal.fire({
              icon: 'error',
              title: 'Já existente',
              text: `O nome que você tentou utilizar já está em uso.`,
            });
            break;
        }
      });
  };

  const readPath = (event) => {
    setFileName(event.currentTarget.innerText);
    if (props.url == '/')
      return setFilePath(`${props.url}${event.currentTarget.innerText}`);
    setFilePath(`${props.url}/${event.currentTarget.innerText}`);
  };
  const returnPath = () => {
    let backPath = props.url.slice(0, props.url.lastIndexOf('/'));
    if (!backPath) return setFilePath('/');
    setFilePath(backPath);
  };
  const updateAddFileField = (event) => {
    const fieldAction = event.currentTarget.id;
    const placeholder =
      fieldAction == 'add-file' ? 'Nome do arquivo' : 'Nome da pasta';
    newFileName.current.value = '';
    if (action == fieldAction) {
      setAddFileFieldPlaceholder('');
      setAction('');
      setAddFileFieldDisplay('none');
      return;
    }
    setAction(fieldAction);
    setAddFileFieldPlaceholder(placeholder);
    setAddFileFieldDisplay('flex');
  };

  useEffect(() => {
    fetch(`http://localhost:4000/api?url=${filePath}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.error) throw data;
        if (data.data.kind == 'files') {
          setFiles(data.data.items);
          props.setUrl(filePath);
          props.setFileDetails({ name: '', content: '' });
          props.setFileDisplay('none');
        } else if (data.data.kind == 'text') {
          props.setFileDetails({ name: fileName, content: data.data.content });
          props.setFileDisplay('flex');
        }
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
            MySwal.fire({
              icon: 'error',
              title: 'Não autorizado',
              text: 'O acesso ao diretório requisitado não foi permitido.',
            });
            break;
          case 404:
            MySwal.fire({
              icon: 'error',
              title: 'Não encontrado',
              text: 'O diretório que você tentou acessar não existe.',
            });
            break;
          case 409:
            MySwal.fire({
              icon: 'error',
              title: 'Ocupado',
              text: 'O diretório que você tentou acessar já está em uso.',
            });
            break;
        }
      });
  }, [filePath]);

  return (
    <div id="navigation">
      <div id="navigation-header">
        <div id="disk">
          <i className="fa-solid fa-hard-drive"></i>
        </div>
        <div id="path">{props.url}</div>
      </div>
      <div id="navigation-functions">
        <div onClick={updateAddFileField} id="add-file">
          <i className="fa-solid fa-file-medical"></i>
        </div>
        <div onClick={updateAddFileField} id="add-folder">
          <i className="fa-solid fa-folder-plus"></i>
        </div>
        <div
          style={{ display: addFileFieldDisplay }}
          action={action}
          id="add-file-field"
        >
          <input
            ref={newFileName}
            type="text"
            placeholder={addFileFieldPlaceholder}
          ></input>
          <button onClick={addFile} id="add-file-confirm">
            Adicionar
          </button>
        </div>
      </div>
      ;
      <div id="navigation-content">
        {props.url == '/' ? (
          ''
        ) : (
          <div onClick={returnPath} className="file" id="back">
            <i className="fa-solid fa-ellipsis"></i>
          </div>
        )}
        {files.map((file, index) => {
          return (
            <div key={index} className="file" onClick={readPath}>
              <FileIcon kind={file.kind} />
              {file.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default memo(Navigation);
