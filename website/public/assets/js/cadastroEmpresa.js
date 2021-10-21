const nome = document.querySelector("#inp-nome-empresa");
const pais = document.querySelector("#inp-pais");
const cidade = document.querySelector("#inp-cidade");
const id = document.querySelector("#inp-id");
const email = document.querySelector("#inp-email-rep");
const form = document.querySelector("#form-cadastro-empresa");
const btn = document.querySelector(".btn-geral");

nome.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        pais.focus();
    }
});
pais.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        cidade.focus();
    }
});
cidade.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        id.focus();
    }
});
id.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        email.focus();
    }
});
email.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        btn.click();
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validarEmpresa();
});

const validarEmpresa = () => {
    axios
        .post("/empresa/cadastro", {
            id: id.value,
            nome: nome.value,
            cidade: cidade.value,
            pais: pais.value,
            email: email.value,
            staff: JSON.parse(sessionStorage.getItem("staff")).id,
        })
        .then((response) => {
            console.log(response.data)
            if (response.data?.status == "ok") {
                mostrarAlerta(response.data.msg, "success")
                setTimeout(() => {
                    window.location.reload();
                },1000)
            } else if (response.data?.status === "alerta") {
                console.log(response.data.msg);
                mostrarAlerta(response.data.msg, "warning");
            };
        });
};
