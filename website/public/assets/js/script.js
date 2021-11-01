const link = document.createElement("link");
link.rel = "shortcut icon";
link.href = "assets/img/logo/logo-icon-branco.png";
document.getElementsByTagName("head")[0].appendChild(link);

const pages = [
    "/login",
    "/index",
    "/cadastro-pessoa",
    "/redefinir-senha",
    "/responsavel-gestor",
    "/convidar-responsavel",
    "/delete-maquina",
    "/permissao-acesso",
    "/"
];

if (
    !pages.includes(window.location.pathname.replace(".html", "")) &&
    !sessionStorage.usuario &&
    !sessionStorage.staff
) {
    window.location.href = "login";
}

function mostrarAlerta(msg, type) {
    var alerta = document.createElement("div");
    var icone = document.createElement("i");

    alerta.classList.add("alerta");

    if (type == "danger") {
        alerta.classList.add("danger");
        icone.classList.add("fas", "fa-times");
    } else if (type == "success") {
        alerta.classList.add("success");
        icone.classList.add("fas", "fa-check-circle");
    } else if (type == "warning") {
        alerta.classList.add("warning");
        icone.classList.add("fas", "fa-exclamation-triangle");
    } else if (type == "info") {
        alerta.classList.add("info");
        icone.classList.add("fas", "fa-question-circle");
    } else {
        return;
    }

    let elementoAlerta = document.querySelector("#alerta");
    elementoAlerta.appendChild(alerta);
    alerta.appendChild(icone);
    alerta.innerHTML += msg; // Mensagem de erro
    alerta.style.right = "0px";

    setTimeout(function () {
        alerta.style.right = "-500px";
    }, 5000);
}

function esconderAlerta() {
    document.querySelector("#alerta").style.right = "-500px";
}

let num =
    JSON.parse(localStorage.getItem("img")) ?? Math.floor(Math.random() * 11);
let imagemAleatoria = `./assets/img/profile-pic/default${num}.png`;
localStorage.setItem("img", num);
let imgs = document.querySelectorAll("img.profilePic");
for (let img of imgs) {
    img.src = imagemAleatoria;
}




var btnVerSenha = document.getElementById("btn-ver-senha");
function mostrarSenha(){
    btnVerSenha.classList.remove('fa-eye');
    btnVerSenha.classList.add('fa-eye-slash');
    btnVerSenha.previousElementSibling.type = 'text';
}
function esconderSenha(){
    btnVerSenha.classList.remove('fa-eye-slash');
    btnVerSenha.classList.add('fa-eye');
    btnVerSenha.previousElementSibling.type = 'password';
}
if (btnVerSenha)
    btnVerSenha.addEventListener(() => {
        if (btnVerSenha.previousElementSibling.type == "text") {
            esconderSenha();
        } else {
            mostrarSenha();
        }
    });
