let arrow = document.querySelectorAll(".arrow");
arrow.forEach((arr) => {
  arr.addEventListener("click", (e) => {
    let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
    arrowParent.classList.toggle("showMenu");
  });
});
// for (let arr of arrow) {
//   arr.addEventListener("click", (e) => {
//     let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
//     arrowParent.classList.toggle("showMenu");
//   });
// }
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".logo-details");
sidebarBtn.addEventListener("click", () => sidebar.classList.toggle("close"));
