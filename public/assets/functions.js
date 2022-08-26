function addItemToNav(item) {
  switch (item.kind) {
    case 'file':
      addFileToNav(item.name);
      break;
    case 'folder':
      addFolderToNav(item.name);
      break;
    case 'busy_file':
      addBusyFileToNav(item.name);
      break;
    case 'restricted_file':
      addRestrictedFileToNav(item.name);
      break;
    case 'unknown':
      addUnknownFileToNav(item.name);
      break;
  }
}
function updatePath(path) {
  $('#path').text(path);
}
function addUnknownFileToNav(file) {
  $('#navigation-content').append(
    `<div class='file'>
        <i class="fa-solid fa-circle-question"></i>${file}\n</div>`
  );
}
function addFileToNav(file) {
  $('#navigation-content').append(
    `<div class='file'>
        <i class="fa-solid fa-file"></i>${file}\n</div>`
  );
}
function addBusyFileToNav(file) {
  $('#navigation-content').append(
    `<div class='file'>
        <i class="fa-solid fa-rotate"></i>${file}\n</div>`
  );
}
function addRestrictedFileToNav(file) {
  $('#navigation-content').append(
    `<div class='file'>
        <i class="fa-solid fa-ban"></i>${file}\n</div>`
  );
}
function addFolderToNav(folder) {
  $('#navigation-content').append(
    `<div class='file'>
        <i class="fa-solid fa-folder"></i>${folder}\n</div>`
  );
}
function addBackButtonToNav() {
  $('#navigation-content').append(`<div class='file' id='back'>
  <i class="fa-solid fa-ellipsis"></i></div>`);
}
function openFile(file) {
  if (!file.name) return Swal.fire('Error opening file');
  $('#file').css('display', 'flex');
  $('#file #filename').text(file.name);
  $('#file #content').text('').append(file.content);
}
function closeFile() {
  $('#file').css('display', 'none');
  $('#file #filename').text('');
  $('#file #content').text('');
}
