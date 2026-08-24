const searchBtn = document.querySelector(".search-box button");

searchBtn.addEventListener("click", () => {

const destination =
document.querySelector(".search-box input").value;

if(destination === ""){

alert("Please enter a destination.");

}else{

alert("Searching hotels in " + destination);

}

});