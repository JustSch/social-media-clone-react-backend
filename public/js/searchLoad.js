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
  var value = document.getElementById("search").value;
  if (value) {
    //use for template  
    var node = document.createElement("P");
    var textNode = document.createTextNode(value);
    node.setAttribute("tag", "result");
    node.appendChild(textNode);
    document.getElementById("results").appendChild(node);

    node = document.createElement("P");
    textNode = document.createTextNode(value);
    node.setAttribute("tag", "result");
    var n = document.createElement("a");
    n.setAttribute("href","#");
    n.appendChild(textNode);
    node.appendChild(n);
    document.getElementById("results").appendChild(node);
  }
}