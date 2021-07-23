window.onload = function () {
  createPostsDashboard();
};

function createPostsDashboard() {
  var posts_div = document.getElementById("posts");
  const error_markup = (error_message) => {
    return `<div class="row mt-5">
        <div class="col-md-6 m-auto">
          <div class="card card-body">
          <h1 class="text-center mb-3">${error_message}</h1>
          </div>
        </div>
      </div>`};

  const Http = new XMLHttpRequest();
  const uri = window.location.pathname;
  const url = `http://localhost:5000/api${uri}/posts`;
  
  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const posts = JSON.parse(Http.responseText);
      if (!posts || posts.length == 0) {
      
        let error_message = "This User Does Not Have Any Posts!";
        posts_div.innerHTML = error_markup(error_message);
      } else {
        const markup = posts.map(({content, name, date}) => {
          return `<div class="mb-3">
                      <div class="col-md-6 m-auto">
                        <div class="card">
                        <h4 class="card-header">${name}</h4>
                        <div class="card-body">
                          <h6 class="card-subtitle mb-2 text-muted">${date}</h6>
                          <p class="card-text">${content}</p>
                        </div>
                      </div>
                    </div>
                  </div>`;
        }).join("");
        posts_div.innerHTML = markup;
      }
    }

    if (this.readyState == 4 && this.status == 500) {
      let error_message = "This User Does Not Exist!";
      posts_div.innerHTML = error_markup(error_message);
          }
  };
  Http.open("GET", url);
  Http.send();
}
