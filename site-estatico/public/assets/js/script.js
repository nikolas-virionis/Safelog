const link = document.createElement("link");
link.rel = "shortcut icon";
link.href = "assets/img/logo/logo-icon-branco.png";
document.getElementsByTagName("head")[0].appendChild(link);

if (
    window.location.pathname != "/login.html" &&
    window.location.pathname != "/index.html" &&
    window.location.pathname != "/cadastro-pessoa.html" &&
    window.location.pathname != "/" &&
    !sessionStorage.usuario &&
    !sessionStorage.staff
) {
    window.location.href = "login.html";
}


function mostrarAlerta(msg, type){

    
    var alerta = document.createElement("div");
    var icone = document.createElement("i");

    alerta.classList.add("alerta");
    
    if(type == "danger"){
        alerta.classList.add("danger");
        icone.classList.add("fas","fa-times");
    }else if(type == "success"){
        alerta.classList.add("success");
        icone.classList.add("fas","fa-check-circle");
    }else if(type == "warning"){
        alerta.classList.add("warning");
        icone.classList.add("fas","fa-exclamation-triangle");
    }else if(type == "info"){
        alerta.classList.add("info");
        icone.classList.add("fas","fa-question-circle");
    }else{
        return;
    }
    
    let elementoAlerta = document.querySelector("#alerta")
    elementoAlerta.appendChild(alerta)
    alerta.appendChild(icone)
    alerta.innerHTML += msg; // Mensagem de erro
    alerta.style.right = "0px";

    setTimeout(function(){
        alerta.style.right = "-500px";
    }, 6000);

}
let num = JSON.parse(localStorage.getItem("img")) ?? Math.floor(Math.random() * 11);
let imagemAleatoria = `./assets/img/profile-pic/default${num}.png`;
localStorage.setItem("img", num)
let imgs = document.querySelectorAll("img.profilePic")
for ( let img of imgs) {
    img.src = imagemAleatoria;    
}