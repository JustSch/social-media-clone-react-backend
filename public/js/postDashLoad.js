window.onload = function () {
 
  const error_markup = function(error_message){
    var rowDiv = document.createElement("div");
    rowDiv.setAttribute("class","row mt-5");
    var colDiv = document.createElement("div");
    colDiv.setAttribute("class","col-md-6 m-auto");
    var cardDiv = document.createElement("div");
    cardDiv.setAttribute("class","card card-body");
    var hDiv = document.createElement("h1");
    hDiv.setAttribute("class","text-center mb-3");

    hDiv.textContent = error_message;
    cardDiv.appendChild(hDiv);
    colDiv.appendChild(cardDiv);
    rowDiv.appendChild(colDiv);
    return rowDiv;
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
        posts_div.appendChild(error_markup(error_message));
      } else {
          const post_markup = function(name, content, date){
          var outerDiv = document.createElement("div");
          outerDiv.setAttribute("class","mb-3");
          var colDiv = document.createElement("div");
          colDiv.setAttribute("class","col-md-6 m-auto");
          var cardElement = document.createElement("div");
          cardElement.setAttribute("class","card");
          var hElement = document.createElement("h4");
          hElement.setAttribute("class","card-header");
          var aElement = document.createElement("a");
          aElement.setAttribute("href",`${window.location.protocol}//${window.location.host}/${name}`);
         
          aElement.textContent = name;
          var bodyElement = document.createElement("div");
          bodyElement.setAttribute("class","card-body");
          var h6Element = document.createElement("h6");
          h6Element.setAttribute("class","card-subtitle mb-2 text-muted");
          h6Element.textContent = date;

          var pElement = document.createElement("P");
          pElement.setAttribute("class","card-text");
          pElement.textContent = content;

          bodyElement.appendChild(h6Element);
          bodyElement.appendChild(pElement);

          hElement.appendChild(aElement);

          cardElement.appendChild(hElement);
          cardElement.appendChild(bodyElement);
          colDiv.appendChild(cardElement);
          outerDiv.appendChild(colDiv);

          return outerDiv;
        };

        posts.forEach(post => {
          posts_div.appendChild(post_markup(post.name,post.content,post.date));
        });
      }
    }

    if (this.readyState == 4 && this.status == 500) {
      let error_message = "There Was An Error Loading Your Dashboard!";
      
      posts_div.appendChild(error_markup(error_message));
    }
  };
  Http.open("GET", url);
  Http.send();
}

function createDashboardHeader() {
  var header_div = document.getElementById("dashboard_header");

  var header_markup = function (){
    var cardElement = document.createElement("div");
    cardElement.setAttribute("class","card");

    var bodyElement = document.createElement("div");
    bodyElement.setAttribute("class","card-body");

    var titleElement = document.createElement("h1");
    titleElement.setAttribute("class","card-title");
    titleElement.innerText = "Dashboard";

    var subtitleElement = document.createElement("h6");
    subtitleElement.setAttribute("class","card-subtitle mb-2 text-muted");

    var p0Element = document.createElement("p");
    p0Element.setAttribute("class","lead mb-3");
    p0Element.textContent = "Create a Post";

    var creatorLink = document.createElement("a");
    creatorLink.setAttribute("href","/PostCreator");
    creatorLink.textContent = "Here";

    var p1Element = document.createElement("p");
    p1Element.setAttribute("class","lead mb-3");
    p1Element.textContent = "Search For a User to Follow";

    var searchLink = document.createElement("a");
    searchLink.setAttribute("href","/PostCreator");
    searchLink.textContent = "Here";

    var logOutBtn = document.createElement("a");
    logOutBtn.setAttribute("href","/users/logout");
    logOutBtn.setAttribute("class","btn btn-outline-primary float-end");
    logOutBtn.textContent = "Logout";

    subtitleElement.appendChild(p0Element);
    subtitleElement.appendChild(p1Element);
    subtitleElement.appendChild(logOutBtn);

    bodyElement.appendChild(titleElement);
    bodyElement.appendChild(subtitleElement);

    cardElement.appendChild(bodyElement);
    return cardElement;

  };
  header_div.appendChild(header_markup());
}