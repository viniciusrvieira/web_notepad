function addFolderToNav(folder) {
  $('#navigation').append(
    `<div class='folder'>
        <i class="fa-solid fa-folder"></i>${folder}\n</div>`
  );
}
function addBackButtonToNav() {
  $('#navigation').append(`<div class='folder' id='back'>
  <i class="fa-solid fa-ellipsis"></i></div>`);
}
function openFile(file) {
  if (!file.name || !file.content) return Swal.fire('Error opening file');
  $('#file').css('display', 'flex');
  $('#file #filename').text(file.name);
  $('#file #content').text('').append(file.content);
}
function closeFile() {
  $('#file').css('display', 'none');
  $('#file #filename').text('');
  $('#file #content').text('');
}
