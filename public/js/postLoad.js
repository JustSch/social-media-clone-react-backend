window.onload = function () {
  const error_markup = error_message => {
    return `<div class="row mt-5">
        <div class="col-md-6 m-auto">
          <div class="card card-body">
          <h1 class="text-center mb-3">${error_message}</h1>
          </div>
        </div>
      </div>`;
  };

  createProfileHeader(error_markup);
  createPostsDashboard(error_markup);
};

function createPostsDashboard(error_markup) {
  var posts_div = document.getElementById("posts");

  const Http = new XMLHttpRequest();
  const url = `${window.location.protocol}//${window.location.host}/api${window.location.pathname}/posts`;
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
      let error_message = `${
      window.location.pathname.split("/")[1]}'s Profile Does Not Exist`;
      posts_div.innerHTML = error_markup(error_message);
    }
  };
  Http.open("GET", url);
  Http.send();
}

function createProfileHeader(error_markup) {
  var header_div = document.getElementById("profile_header");
  const Http = new XMLHttpRequest();
  const url = `${window.location.protocol}//${window.location.host}/api${window.location.pathname}`;
  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const user = JSON.parse(Http.responseText);

      if (!user || user.length == 0) {
        header_div.innerHTML = `<h1>Error Displaying ${
        window.location.pathname.split("/")[1]}'s Profile</h1>`;
      } else {
        let header = `<div class="card">
        <div class="card-body">
          <h1 class="card-title">${user.name}'s Profile</h1>
          <h6 class="card-subtitle mb-2 text-muted">Following: ${user.following.length}  Followers: ${user.followers.length}
            <button type="button" class="btn btn-outline-primary float-end" id="follow_btn">Follow</button>
          </h6>  
        </div>
      </div>`;
        header_div.innerHTML = header;
      }
    }
  };
  Http.open("GET", url);
  Http.send();
}
