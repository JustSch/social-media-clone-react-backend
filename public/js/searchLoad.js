window.onload = function(){
    search();
};
function search() {
  var s = document.getElementById("search");
  s.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searching();
    }
  });

  document.getElementById("search-btn").addEventListener("click", function (){
      searching();
  });
}

function searching(){
    console.log(document.getElementById("search").value);
}