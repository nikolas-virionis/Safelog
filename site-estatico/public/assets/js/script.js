var currentYear = new Date().getFullYear();
document.getElementById("footer-year").innerHTML = currentYear;
const link = document.createElement("link");
link.rel = "shortcut icon";
link.href = "assets/img/logo/logo-icon-branco.png";
document.getElementsByTagName("head")[0].appendChild(link);
