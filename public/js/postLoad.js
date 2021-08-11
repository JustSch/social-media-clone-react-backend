var isAuthenticated;
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
  authenticationStatus();
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
        if (isAuthenticated){
          followStatus();
        }
        
      }
    }
  };
  Http.open("GET", url);
  Http.send();
}

function followStatus(){

  const Http = new XMLHttpRequest();
  const url = `${window.location.protocol}//${window.location.host}/api/isFollowing${window.location.pathname}`;
  var following;
  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {     
      const response = JSON.parse(Http.responseText);
      following = response.isFollowing;
      followStatusInit(following);
      
    }
  };
  Http.open("GET", url);
  Http.send();

}

function followStatusInit(following){
  var follow_status = document.getElementById("follow_btn");

  if (following){
    follow_status.innerHTML="Following";
    follow_status.addEventListener("mouseover",mouseOverEvent);
    follow_status.addEventListener("mouseout",mouseOutEvent);
    follow_status.addEventListener("click",unFollowStatusRequest);
  }
  
  else {
    follow_status.addEventListener("click",followStatusRequest);
  }
}

function followStatusRequest(){
  let follow_status = document.getElementById("follow_btn");
  var request_json = {"username": window.location.pathname.split("/")[1]};
  var request = new XMLHttpRequest();
  request.open("POST","/api/user/follow/");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(request_json));


  //change to set this only when sucessfull
  follow_status.innerHTML="Following";
  follow_status.removeEventListener("click",followStatusRequest);
  follow_status.addEventListener("mouseover",mouseOverEvent);
  follow_status.addEventListener("mouseout",mouseOutEvent);
  follow_status.addEventListener("click",unFollowStatusRequest);

  //if recieves redirect to login page display modal asking to log in
  
}

function unFollowStatusRequest(){
  let follow_status = document.getElementById("follow_btn");
  var request_json = {"username": window.location.pathname.split("/")[1]};
  var request = new XMLHttpRequest();
  request.open("POST","/api/user/unfollow/");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(request_json));

  follow_status.innerHTML="Follow";
  follow_status.removeEventListener("click",unFollowStatusRequest);
  follow_status.removeEventListener("mouseover",mouseOverEvent);
  follow_status.removeEventListener("mouseout",mouseOutEvent);
  follow_status.addEventListener("click",followStatusRequest);

}
function mouseOverEvent (){
  let follow_status = document.getElementById("follow_btn");
  follow_status.innerHTML = "Following";
}

function mouseOutEvent(){
  let follow_status = document.getElementById("follow_btn");
  follow_status.innerHTML="Unfollow";
}
function profileOwner(){
  //check if profile belongs to loggedin user
}

function updateFollowerCount(){
  //request to update follower count
}

function authenticationStatus(){
  const Http = new XMLHttpRequest();
  const url = '/api/user/isAuthenticated';
  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {     
      const response = JSON.parse(Http.responseText);
      isAuthenticated=response.isAuthenticated;
      
    }
  };
  Http.open("GET", url);
  Http.send();

}
