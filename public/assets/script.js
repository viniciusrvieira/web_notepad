$(document).ready(() => {
  $.get('/read?url=/')
    .then((content) => {
      $('#navigation').append(`<div class='folder' id='back'>
      <i class="fa-solid fa-folder"></i>...\n</div>`);
      content.forEach((folder) => {
        $('#navigation').append(`<div class='folder'>
        <i class="fa-solid fa-folder"></i>${folder}\n</div>`);
      });
    })
    .catch((err) => {
      alert(err);
    });
  $(document).on('click', '.folder', (event) => {
    const actualFolder = window.location.pathname;
    const folder = $(event.target).text().trim();
    $.post(`${actualFolder}${folder}`)
      .then((res) => {
        $('#navigation').text('');
        $('#navigation').append(`<div class='folder' id='back'>
        <i class="fa-solid fa-folder"></i>...\n</div>`);
        res.forEach((folder) => {
          $('#navigation').append(`<div class='folder'>
          <i class="fa-solid fa-folder"></i>${folder}</div>`);
        });
      })
      .catch((err) => {
        alert(err);
      });
  });
});
