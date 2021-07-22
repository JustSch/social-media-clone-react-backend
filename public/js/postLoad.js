window.onload = function () {
  //preLoad();
    createPostsDashboard();
};

function preLoad() {
  var elements = document.getElementById("posts");
  createPostsDashboard();
}

function createPostsDashboard() {
  const Http = new XMLHttpRequest();
  const url = "http://localhost:5000/api/tester2/posts";
  
  var post;
  
  Http.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200){
        post = Http.responseText;
        if(!post){
            console.log('no posts');
        }
        else{
            console.log(post);
        }
        
      }
  }
  Http.open("GET", url);
  Http.send();
  
}
