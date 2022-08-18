function addFileToNav(file) {
  $('#navigation').append(
    `<div class='file'>
        <i class="fa-solid fa-file"></i>${file}\n</div>`
  );
}
function addBackButtonToNav() {
  $('#navigation').append(`<div class='file' id='back'>
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
