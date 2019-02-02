$.get("/experiments", (response) => {
  console.log(response);
  for (let i = 0; i < Object.keys(response).length; i++) {
    let data = response[Object.keys(response)[i]];
    $("#experiment-container").append(`
      <div class="experiment row">
        <div class="experiment-img col-lg-2 col-sm-6">
          <a href="/${data.alias}">
            <img src="./experiments/${data.alias}/${data.alias}.png"/ width="150px">
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
      /*$("#experiment-table").append(`
        <tr class="experiment-row">
          <td class="experiment-img">
            <a href="/${data.alias}">
              <img src="./experiments/${data.alias}/${data.alias}.png"/ width="150px">
            </a>
          </td>
          <td class="experiment-title">
            <a href="/${data.alias}">
              <p class="experiment-title">${data.title}</p>
            </a>
          </td>
          <td class="experiment-desc">
            <p>${data.description}</p>
          </td>
        </tr>

        `);*/

  };

});
