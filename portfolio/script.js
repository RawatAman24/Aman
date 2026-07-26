const themeBtn = document.getElementById("themeBtn");
themeBtn.onclick = () => {
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }else{
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
};