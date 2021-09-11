
const link = document.createElement("link");
link.rel = "shortcut icon";
link.href = "assets/img/logo/logo-icon-branco.png";
document.getElementsByTagName("head")[0].appendChild(link);

function fecharModal(){
    document.getElementById("modal-verify-token").style.display = "none";
}

function cancelarModal(){
    window.history.back();
}
