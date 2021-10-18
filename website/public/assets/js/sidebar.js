let arrow = document.querySelectorAll(".arrow");
arrow.forEach((arr) => {
    arr.addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
    });
});
let sidebar = document.querySelector(".sidebar");
sidebar.addEventListener("click", () => sidebar.classList.toggle("close"));

let homeSection = document.querySelector(".home-section");
homeSection.addEventListener("click", () => sidebar.classList.add("close"));
document.addEventListener("click", (e) => {
    console.log(e.target);
})
const nomeUser = document.querySelector(".profile_name");
nomeUser.innerText =
    JSON.parse(sessionStorage.getItem("usuario"))?.nome?.split(" ").shift() ??
    JSON.parse(sessionStorage.getItem("staff"))?.nome?.split(" ").shift() ??
    "Nome usuario";

document.querySelector(".icon-exit").addEventListener("click", function () {
    sessionStorage.clear();
    window.location = "index.html";
});
