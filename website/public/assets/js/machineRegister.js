const {id, id_empresa: empresa} = JSON.parse(sessionStorage.getItem("usuario"));
const id_maquina = document.querySelector("#inp-id-maquina");
const nome = document.querySelector("#inp-nome-maquina");
const senha = document.querySelector("#inp-senha-maquina");
const confirmarSenha = document.querySelector("#inp-conf-senha-maquina");
const btn = document.querySelector("#btnCadastroMaq");

id_maquina.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        nome.focus();
    }
});
nome.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        senha.focus();
    }
});
senha.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        confirmarSenha.focus();
    }
});
confirmarSenha.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        btn.click();
    }
});

btn.addEventListener("click", e => {
    e.preventDefault();
    if (
        id_maquina.value == "" ||
        nome.value == "" ||
        senha.value == "" ||
        confirmarSenha.value == ""
    ) {
        mostrarAlerta("Preencha todos os campos para prosseguir", "danger");
        return;
    }
    if (senha.value !== confirmarSenha.value) {
        mostrarAlerta("As senhas são diferentes", "warning");
        return;
    }
    axios
        .post("/machine/cadastro", {
            id,
            id_maquina: id_maquina.value,
            nome: nome.value,
            senha: senha.value,
            empresa
        })
        .then(response => {
            console.log(response);
            if (response.data?.status == "ok") {
                mostrarAlerta(response.data?.msg, "success");
                window.location.href = `components?pk_maquina=${response.data.pk_maquina}`;
            } else if (response.data?.status == "alerta") {
                mostrarAlerta(response.data?.msg, "danger");
            }
        });
});
