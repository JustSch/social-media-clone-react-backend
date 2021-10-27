window.onload = function () {
  search();
};

function search() {
  var s = document.getElementById("search");
  s.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searching();
    }
  });

  document.getElementById("search-btn").addEventListener("click", function () {
    searching();
  });
}

function searching() {
  const resultElement = document.getElementById("results");
  while (resultElement.children.length > 2){
    resultElement.removeChild(resultElement.lastChild);
  }

  var value = document.getElementById("search").value;
  if (value) {
    const Http = new XMLHttpRequest();
    const url = `/api/search/${value}`;
    var node;
    var textNode;
    Http.onreadystatechange = function (){
      if (this.readyState == 4 && this.status == 200){
        const users = JSON.parse(Http.responseText);
        if (users.length == 0){
          node = document.createElement("P");
          textNode = document.createTextNode("There were no users found for your search terms");
          node.appendChild(textNode);
          resultElement.appendChild(node);
        }
        else {
          users.forEach(function(user) {
            node = document.createElement("P");
            var hNode = document.createElement("a");
            hNode.setAttribute("href",`/${user.name}`);
            textNode = document.createTextNode(user.name);

            hNode.appendChild(textNode);
            node.appendChild(hNode);
            resultElement.appendChild(node);
          });
        }
      }
    }
    Http.open("GET",url);
    Http.send();

  }
}