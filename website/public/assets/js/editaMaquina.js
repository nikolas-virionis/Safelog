const urlParams = new URLSearchParams(window.location.search);
const idMaquina = urlParams.get("id_maquina");

const inpId = document.querySelector("#inp-id-maquina");
const inpNome = document.querySelector("#inp-nome-maquina");
const inpSenhaAtual = document.querySelector("#inp-senha-atual");
const inpNovaSenha = document.querySelector("#inp-nova-senha");
const inpConfSenha = document.querySelector("#inp-conf-senha");
const altSenha = document.querySelector("#input-alt-senha");
const btnEditar = document.querySelector("#btn-edit-maq");
const btnComponentes = document.querySelector("#btn-edit-comp");

axios
    .post("/maquina/dados", {
        maquina: idMaquina
    })
    .then(({data: {status, msg}}) => {
        if (status == "ok") {
            inpId.value = idMaquina;
            inpNome.value = msg.nome;
        } else {
            console.error(msg);
        }
    })
    .catch(err => console.error(err));

inpId.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        inpNome.focus();
    }
});
inpNome.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        altSenha.focus();
    }
});
inpSenhaAtual.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        inpNovaSenha.focus();
    }
});
inpNovaSenha.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        inpConfSenha.focus();
    }
});
inpConfSenha.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        inpConfSenha.blur();
    }
});

btnEditar.addEventListener("click", e => {
    e.preventDefault();
    if (inpNovaSenha.value != inpConfSenha.value)
        return mostrarAlerta("Senhas diferentes", "danger");
    editarMaquina()
        .then(res => {
            if (res) {
                window.location.href = "dependentes";
            } else {
                console.log(res);
            }
        })
        .catch(err => console.error(err));
});
btnComponentes.addEventListener("click", e => {
    e.preventDefault();
    editarMaquina()
        .then(res => {
            axios
                .post("/maquina/dados", {
                    maquina: idMaquina
                })
                .then(({data: {status, msg}}) => {
                    if (status == "ok") {
                        if (res) {
                            window.location.href = `componentes?pk_maquina=${msg.pk_maquina}`;
                        } else {
                            console.log(res);
                        }
                    } else {
                        console.error(msg);
                    }
                });
        })
        .catch(err => console.error(err));
});

const editarMaquina = async () => {
    return await axios
        .post("/maquina/update", {
            idAtual: idMaquina,
            novoId: inpId.value,
            novoNome: inpNome.value,
            senhaAtual: altSenha.checked ? inpSenhaAtual.value : "",
            novaSenha: altSenha.checked ? inpNovaSenha.value : ""
        })
        .then(({data: {status, msg}}) => {
            if (status == "ok") {
                mostrarAlerta(msg, "success");
            } else {
                console.error(msg);
            }
            return status == "ok";
        });
};
