/*Home*/
const audio = new Audio("music/song1.mp3");
// Song List
const songs = [
{
    title: "Perfect",
    artist: "Ed Sheeran",
    file: "music/song1.mp3",
    image: "images/song1.jpg"
},
{
    title: "Believer",
    artist: "Imagine Dragons",
    file: "music/song2.mp3",
    image: "images/song2.jpg"
},
{
    title: "Blinding Lights",
    artist: "The Weeknd",
    file: "music/song3.mp3",
    image: "images/song3.jpg"
},
{
    title: "Shape of You",
    artist: "Ed Sheeran",
    file: "music/song4.mp3",
    image: "images/song4.jpg"
}
];
let currentSong = 0;
let isPlaying = false;
// Elements
const playBtn = document.getElementById("play");
const searchInput = document.querySelector(".search input");
const songCards = document.querySelectorAll(".song-card");
const playerImage = document.querySelector(".music-player img");
const playerTitle = document.querySelector(".music-player h4");
const playerArtist = document.querySelector(".music-player p");
const previousBtn =
document.querySelector(".fa-backward").parentElement;
const nextBtn =
document.querySelector(".fa-forward").parentElement;
const volumeSlider =
document.querySelector(".music-player input");
// Load Song
function loadSong(index){
audio.src = songs[index].file;
playerImage.src = songs[index].image;
playerTitle.innerHTML = songs[index].title;
playerArtist.innerHTML = songs[index].artist;
}
loadSong(currentSong);
// Play & Pause
playBtn.addEventListener("click",function(){
if(isPlaying){
audio.pause();
playBtn.innerHTML='<i class="fa-solid fa-play"></i>';
isPlaying=false;
}
else{
audio.play();
playBtn.innerHTML='<i class="fa-solid fa-pause"></i>';
isPlaying=true;
}
});
// Next Song
nextBtn.addEventListener("click",function(){
currentSong++;
if(currentSong>=songs.length){
currentSong=0;
}
loadSong(currentSong);
audio.play();
isPlaying=true;
playBtn.innerHTML='<i class="fa-solid fa-pause"></i>';
});
// Previous Song
previousBtn.addEventListener("click",function(){
currentSong--;
if(currentSong<0){
currentSong=songs.length-1;
}
loadSong(currentSong);
audio.play();
isPlaying=true;
playBtn.innerHTML='<i class="fa-solid fa-pause"></i>';
});
// Auto Next
audio.addEventListener("ended",function(){
currentSong++;
if(currentSong>=songs.length){
currentSong=0;
}
loadSong(currentSong);
audio.play();
});
// Volume
volumeSlider.addEventListener("input",function(){
audio.volume=this.value/100;
});
// Search Songs
searchInput.addEventListener("keyup",function(){
let value=this.value.toLowerCase();
songCards.forEach(function(card){
let songName=card.querySelector("h3").innerHTML.toLowerCase();
let artist=card.querySelector("p").innerHTML.toLowerCase();
if(songName.includes(value)||artist.includes(value)){
card.style.display="block";
}
else{
card.style.display="none";
}
});
});
// Click Song Card
songCards.forEach(function(card,index){
card.querySelector(".play-btn").addEventListener("click",function(){
currentSong=index;
loadSong(currentSong);
audio.play();
isPlaying=true;
playBtn.innerHTML='<i class="fa-solid fa-pause"></i>';
});
});
// Default Volume
audio.volume=0.5;
volumeSlider.value=50;

/*Login*/
const form = document.querySelector("form");

form.addEventListener("submit", function(e){

    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;

    let user = JSON.parse(localStorage.getItem("musicUser"));

    if(user && email === user.email && password === user.password){

        alert("Login Successful!");

        window.location.href = "index.html";

    }else{

        alert("Invalid Email or Password");

    }

});