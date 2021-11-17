const mostrarAlerta = (msg, type) => {
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

    setTimeout(() => {
        alerta.style.right = "-500px";
    }, 5000);
};

const esconderAlerta = () =>
    (document.querySelector("#alerta").style.right = "-500px");
