const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
const email = urlParams.get("email");
const emailInModal = document.querySelector("#idInputEmail");
const tokenInModal = document.querySelector("#idInputToken");
tokenInModal.value = token;
emailInModal.value = email;

const btnProsseguir = document.querySelector("#btn-prosseguir-modal");
const btnCancelar = document.querySelector("#btn-cancelar-modal");
const btnAceitar = document.querySelector(".botoes button.btn-geral");
const btnRecusar = document.querySelector(".botoes button.cancelar");
const msgSolicitacao = document.querySelector(".card-login div.coluna span");



msgSolicitacao.style.textAlign = "center";
emailInModal.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        tokenInModal.focus();
    }
});
tokenInModal.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnProsseguir.click();
    }
});

btnCancelar.addEventListener("click", async e => {
    e.preventDefault();
    let {cancelarModal} = await import("./modal.js");
    cancelarModal();
});

btnProsseguir.addEventListener("click", async e => {
    axios
        .post("/usuario/verificacao", {
            email: emailInModal.value,
            token: tokenInModal.value
        })
        .then(async ({data: {status, msg}}) => {
            if (status == "ok") {
                await axios
                    .post("/usuario/dados", {
                        id: msg.id_usuario
                    })
                    .then(({data: {status, msg}}) => {
                        sessionStorage.setItem(
                            "usuario",
                            JSON.stringify({...msg})
                        );
                        nomeUser.innerText = msg.nome.split(" ").shift();
                        msgSolicitacao.innerText = `${urlParams.get(
                            "nome"
                        )} está solicitando acesso à maquina ${urlParams.get(
                            "nome_maquina"
                        )}`;
                        import("./modal.js").then(({fecharModal}) =>
                            fecharModal("modal-verify-token")
                        );
                    })
                    .catch(err => console.error(err));
            } else {
                mostrarAlerta(msg, "danger");
            }
        })
        .catch(err => console.error(err));
});

btnRecusar.addEventListener("click", e => {
    e.preventDefault();
    mostrarAlerta("Solicitação recusada", "info");
    setTimeout(() => (window.location.href = "dependentes"), 3000);
});

btnAceitar.addEventListener("click", e => {
    e.preventDefault();
    axios
        .post("/usuario/permissao-acesso", {
            id: Number(urlParams.get("id")),
            pk_maquina: Number(urlParams.get("id_maquina"))
        })
        .then(({data: {status, msg}}) => {
            if (status == "ok") {
                mostrarAlerta("Solicitação aceita", "success");
                setTimeout(() => (window.location.href = "dependentes"), 3000);
            } else {
                mostrarAlerta("Erro na solicitação", "danger");
                console.error(msg);
            }
        });
});
