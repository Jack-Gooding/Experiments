$.get("/experiments", (response) => {
  console.log(response);
  response.forEach(function(data) {
    $("#experiment-container").append(`<p><a href="/${data}">${data}</a></p>`);
  });

})
