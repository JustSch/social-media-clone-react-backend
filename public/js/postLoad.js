window.onload = function () {
  //preLoad();
  createPostsDashboard();
};

function preLoad() {
  createPostsDashboard();
}

function createPostsDashboard() {
  var elements = document.getElementById("posts");
  console.log(elements);
  const Http = new XMLHttpRequest();
  const url = "http://localhost:5000/api/tester1/posts";

  var post;

  Http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const posts = JSON.parse(Http.responseText);
      if (!posts) {
        console.log("no posts");
      } else {
        console.log(posts);

        const markup = posts.map(({content, name}) => {
            return `<ul>
                <li>name: ${name}</li>
                <li>content: ${content}</li>
            </ul>`
        }).join('');
       
        elements.innerHTML = markup;
      }
    }
  };
  Http.open("GET", url);
  Http.send();
}
