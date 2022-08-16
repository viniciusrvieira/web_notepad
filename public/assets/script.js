var actualFolder = "";

$(document).ready(() => {
  $.get("/api?url=/")
    .then((content) => {
      content.data.forEach((folder) => {
        $("#navigation").append(`<div class='folder'>
        <i class="fa-solid fa-folder"></i>${folder}\n</div>`);
      });
    })
    .catch((err) => {
      alert(err);
    });
  $(document).on("click", ".folder", (event) => {
    if (!actualFolder) actualFolder = window.location.pathname;
    const folder = $(event.target).text().trim();
    if (event.target.id == "back") {
      let folderPath = actualFolder.slice(0, actualFolder.lastIndexOf("/") + 1);
      $.get(`/api?url=${folderPath}`)
        .then((res) => {
          actualFolder = folderPath;
          $("#navigation").text("");
          if (actualFolder && actualFolder != "/") {
            $("#navigation").append(`<div class='folder' id='back'>
            <i class="fa-solid fa-folder"></i>...\n</div>`);
          }
          res.data.forEach((folder) => {
            $("#navigation").append(`<div class='folder'>
          <i class="fa-solid fa-folder"></i>${folder}</div>`);
          });
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      $.get(`/api?url=${actualFolder}${folder}`)
        .then((res) => {
          if (res.type == "files") {
            actualFolder = actualFolder + folder;
            $("#navigation").text("");
            if (actualFolder && actualFolder != "/") {
              $("#navigation").append(`<div class='folder' id='back'>
            <i class="fa-solid fa-folder"></i>...\n</div>`);
            }
            res.data.forEach((folder) => {
              $("#navigation").append(`<div class='folder'>
          <i class="fa-solid fa-folder"></i>${folder}</div>`);
            });
          } else {
            $("#file").text("");
            $("#file").append(res.data);
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  });
});
