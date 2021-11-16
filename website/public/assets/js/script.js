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
    "/pag-404",
    "/"
];
const pagesNotNotify = ["/relatorio", "/cadastro-empresa"];

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

// índice que compoe o título da imagem aleatória
let num =
    JSON.parse(localStorage.getItem("img")) ?? Math.floor(Math.random() * 11);
localStorage.setItem("img", num);

// imagem de perfil do usuário vinda do banco
let { foto: dbimg } = JSON.parse(sessionStorage.getItem("usuario")) ??
    JSON.parse(sessionStorage.getItem("staff")) ?? {
    foto: `./assets/img/profile-pic/default${num}.png`
};

let imagem = `./upload/user-profile/${dbimg}`;
let defaultImg = `./assets/img/profile-pic/default${num}.png`;

// renderiza imagens registradas no banco
let imgs = document.querySelectorAll("img.profilePic");

for (let img of imgs) {
    // caso imagem não seja encontrada, renderiza img padrão
    img.onerror = function () {
        img.src = defaultImg;
    };
    img.src = dbimg ? imagem : defaultImg;
}

var btnVerSenha = document.getElementById("btn-ver-senha");
function mostrarSenha() {
    btnVerSenha.classList.remove("fa-eye");
    btnVerSenha.classList.add("fa-eye-slash");
    btnVerSenha.previousElementSibling.type = "text";
}
function esconderSenha() {
    btnVerSenha.classList.remove("fa-eye-slash");
    btnVerSenha.classList.add("fa-eye");
    btnVerSenha.previousElementSibling.type = "password";
}
if (btnVerSenha)
    btnVerSenha.addEventListener("click", () => {
        if (btnVerSenha.previousElementSibling.type == "text") {
            esconderSenha();
        } else {
            mostrarSenha();
        }
    });





let notificacoesAbertas = false;
// let alerta = document.getElementById("alerta");
// let i = document.createElement("i");
// let div = document.createElement("div");





// ---------------------------------------------------------------------------------------------
// -------------------------------         Notificações          -------------------------------
// ---------------------------------------------------------------------------------------------


if (
    !pages.includes(window.location.pathname.replace(".html", "")) &&
    !pagesNotNotify.includes(
        window.location.pathname.replace(".html", "")
    )
) {

    // <div id="notificacoes" class="notificacoes">
    let notificacoes = document.createElement("div");
    notificacoes.classList = "notificacoes";
    notificacoes.setAttribute("id", "notificacoes");
    //     <div class="btn-notificacao centralizar alinhar" id="btnNotificacoes">
    let btnNotificacao = document.createElement("div");
    btnNotificacao.classList = "btn-notificacao centralizar alinhar";
    btnNotificacao.setAttribute("id", "btnNotificacoes");
    //         <i class="fas fa-bell"></i>
    let iconBell = document.createElement("i");
    iconBell.classList = "fas fa-bell";
    //     </div>
    btnNotificacao.appendChild(iconBell);
    //     <div class="nova-notificacao display-hidden" id="novaNotificacao"></div>
    let alertNotificacao = document.createElement("div");
    alertNotificacao.setAttribute("id", "novaNotificacao");
    alertNotificacao.classList = "nova-notificacao display-hidden";
    //     <div class="lista-notificacoes escondida" id="listaNotificacoes">
    let listaNotificacoes = document.createElement("div");
    listaNotificacoes.setAttribute("id", "listaNotificacoes");
    listaNotificacoes.classList = "lista-notificacoes escondida";
    //         <ul>
    let ulNotificacoes = document.createElement("ul");
    ulNotificacoes.setAttribute("id", "ulNotificacoes");


    //             <li>
    let liNot = document.createElement("li");
    //                 <span class="nao-lido">Lorem.....</span>
    let spanNot = document.createElement("span");
    //             </li>
    liNot.appendChild(spanNot);
    //         </ul>
    ulNotificacoes.appendChild(liNot);
    //     </div>
    listaNotificacoes.appendChild(ulNotificacoes);
    // </div>
    notificacoes.appendChild(btnNotificacao);
    notificacoes.appendChild(alertNotificacao);
    notificacoes.appendChild(listaNotificacoes);
    document.querySelector("body").appendChild(notificacoes);



    document.querySelector("#btnNotificacoes").addEventListener("click", () => {
        document.querySelector("#listaNotificacoes").classList.toggle("escondida");
        if (document.querySelector("#listaNotificacoes").classList.contains("escondida")) {
            iconBell.classList = "fas fa-bell";
            notificacoesAbertas = false;
        } else {
            iconBell.classList = "fas fa-times";
            notificacoesAbertas = true;
        }
    });

    document.querySelector(".home-section").addEventListener("click", () => {
        document.querySelector("#listaNotificacoes").classList.add("escondida");
        if (document.querySelector("#listaNotificacoes").classList.contains("escondida")) {
            iconBell.classList = "fas fa-bell";
            notificacoesAbertas = false;
        } else {
            iconBell.classList = "fas fa-times";
            clearInterval(timer);
            notificacoesAbertas = true;
        }
    });
}



const checarNaoLidos = i => {
    axios
        .post("/notificacao/lista", {
            idUsuario: JSON.parse(sessionStorage.getItem("usuario")).id
        })
        .then(({ data: { status, msg } }) => {
            // console.log(msg)
            if (status === "ok") {
                if (msg.naoLidos) {
                    document.querySelector("#novaNotificacao").classList.remove("display-hidden");
                }
                document.querySelector("#ulNotificacoes").innerHTML = "";
                if(msg.notificacoes.length == 0) {
                    // <h3>Lorem.....</h3>
                    let h3Not = document.createElement("h3");
                    h3Not.innerHTML = "Você ainda não tem notificações";
                    h3Not.classList = "centralizar alinhar";
                    //</ul>
                    document.querySelector("#ulNotificacoes").appendChild(h3Not);
                }
                msg.notificacoes.forEach((mens) => {
                    //<li>
                    let liNot = document.createElement("li");
                    // <span class="nao-lido">Lorem.....</span>
                    let spanNot = document.createElement("span");
                    spanNot.innerHTML = mens.titulo;
                    if (mens.lido == "n") {
                        spanNot.classList.add("nao-lido");
                    }
                    //</li>
                    liNot.appendChild(spanNot);
                    //</ul>
                    document.querySelector("#ulNotificacoes").appendChild(liNot);
                    // document.querySelector("#ulNotificacoes").innerHTML += ulNotificacoes;

                    liNot.addEventListener("click", () => {
                        document.querySelector("#ulNotificacoes").innerHTML = `
                            <div class="header-notificacao">${mens.titulo}awdad awda wawd awda dw awdaw</div>
                            <div class="msg-notificacao">${mens.mensagem}</div>
                        `;
                    });
                });
            } else {
                console.error(msg);
            }
        });
};

const receberNotificacoes = () => {
    if (
        !notificacoesAbertas &&
        !pages.includes(window.location.pathname.replace(".html", "")) &&
        !pagesNotNotify.includes(
            window.location.pathname.replace(".html", "")
        )
        
    ) {

        checarNaoLidos();
    }
};


receberNotificacoes();
let timer = setInterval(receberNotificacoes, 5000);