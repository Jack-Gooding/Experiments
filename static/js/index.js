$.get("/experiments", (response) => {
  console.log(response);

  for (let i = 0; i < Object.keys(response).length; i++) {
    let data = response[Object.keys(response)[i]];
    console.log(data);

    if (data.display == true) {
      $("#experiment-container").append(`
        <div class="experiment row">
          <div class="experiment-img col-lg-2 col-sm-6">
            <a href="/${data.alias}">
              ${
                data.thumb.split(".")[1] == "m4v"
                  ? `<video width="150px" autoplay loop>
                <source src="./experiments/${data.alias}/${data.thumb}" type="video/mp4" width="150px">
               </video>`
                  : `<img src="./experiments/${data.alias}/${data.thumb}" width="150px">`
              }
            </a>
          </div>
          <div class="experiment-title col-lg-2 col-sm-6">
            <a href="/${data.alias}">
              <p class="experiment-title">${data.title}</p>
            </a>
          </div>
          <div class="experiment-desc col-lg-7 col-sm-6">
            <p>${data.description}</p>
          </div>
        </div>
        `);
    }
  }
});

$.get("/experiments");
