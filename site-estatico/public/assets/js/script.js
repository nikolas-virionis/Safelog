
const link = document.createElement("link");
link.rel = "shortcut icon";
link.href = "assets/img/logo/logo-icon-branco.png";
document.getElementsByTagName("head")[0].appendChild(link);

function abrirModal(modalId){
    document.getElementById(modalId).style.display = "flex";
}

function fecharModal(modalId){
    document.getElementById(modalId).style.display = "none";
}

function cancelarModal(){
    window.history.back();
}

try {
  var currentYear = new Date().getFullYear();
  document.getElementById("footer-year").innerHTML = currentYear;
} catch (e) {
} finally {
  const link = document.createElement("link");
  link.rel = "shortcut icon";
  link.href = "assets/img/logo/logo-icon-branco.png";
  document.getElementsByTagName("head")[0].appendChild(link);
}
