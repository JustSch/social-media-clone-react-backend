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
  createDashboardHeader();
  createPostsDashboard(error_markup);
};

function createPostsDashboard(error_markup) {
  var posts_div = document.getElementById("posts");

  const Http = new XMLHttpRequest();
  const url = `/api/post/postDashboard`;
  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const posts = JSON.parse(Http.responseText);

      if (!posts || posts.length == 0) {
        let error_message = "There are no Posts! Follow Other Users To See Posts Here.";
        posts_div.innerHTML = error_markup(error_message);
      } else {
        const markup = posts.map(({content, name, date}) => {
          return `<div class="mb-3">
                        <div class="col-md-6 m-auto">
                          <div class="card">
                          <h4 class="card-header"><a href=${window.location.protocol}//${window.location.host}/${name}>${name}</a></h4>
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
      let error_message = "There Was An Error Loading Your Dashboard!";
      posts_div.innerHTML = error_markup(error_message);
    }
  };
  Http.open("GET", url);
  Http.send();
}

function createDashboardHeader(){
  var header_div = document.getElementById("dashboard_header");

  let header = `<div class="card">
        <div class="card-body">
          <h1 class="card-title">Dashboard</h1>
          <h6 class="card-subtitle mb-2 text-muted"><p class="lead mb-3">Create a Post <a href="/PostCreator">Here</a></p>
            <a href="/users/logout" class="btn btn-outline-primary float-end">Logout</a>
          </h6>  
        </div>
      </div>`;
        header_div.innerHTML = header;
}