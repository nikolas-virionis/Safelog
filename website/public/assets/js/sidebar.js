let arrow = document.querySelectorAll(".seta");
arrow.forEach(arr => {
    arr.addEventListener("mouseenter", e => {
        let arrowParent = e.target; //selecting main parent of arrow
        arrowParent.classList.add("showMenu");
    });
    arr.addEventListener("mouseleave", e => {
        let arrowParent = e.target; //selecting main parent of arrow
        arrowParent.classList.remove("showMenu");
    });
});
let sidebar = document.querySelector(".sidebar");
sidebar.addEventListener("click", () => sidebar.classList.toggle("close"));

let homeSection = document.querySelector(".home-section");
homeSection.addEventListener("click", () => sidebar.classList.add("close"));

const nomeUser = document.querySelector(".profile_name");
const profilePic = document.querySelector(".profilePic");

[nomeUser, profilePic].forEach(el => {
    el.addEventListener("click", (evt => {
        redirectTo("perfil");
    }))
    el.classList.add("clickble");
    el.title = "Perfil";
})

nomeUser.innerText =
    JSON.parse(sessionStorage.getItem("usuario"))?.nome?.split(" ").shift() ??
    JSON.parse(sessionStorage.getItem("staff"))?.nome?.split(" ").shift() ??
    "Nome usuario";

document.querySelector(".icon-exit").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "/";
});

const redirectTo = (url) => {
    window.location.href = "./" + url;
}