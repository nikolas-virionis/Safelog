let emailCadastro = document.querySelector("#inp-email");
let contatos = document.querySelectorAll(".checkbox-contato");
for (let contato of contatos) {
    let [label, input] = contato.children;
    label.title = input.title = input.id.slice(8);
}

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
const email = urlParams.get("email");
const emailInModal = document.querySelector("#idInputEmail");
const tokenInModal = document.querySelector("#idInputToken");
tokenInModal.value = token;
emailInModal.value = email;

const btnProsseguir = document.querySelector("#btn-prosseguir-modal");
const btnCancelar = document.querySelector("#btn-cancelar-modal");

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
    let {cancelarModal} = await import("./modal.js");
    cancelarModal();
});

btnProsseguir.addEventListener("click", e => {
    e.preventDefault();
    axios
        .post("/usuario/verificacao", {
            email: emailInModal.value,
            token: tokenInModal.value
        })
        .then(async response => {
            if (response.data?.status == "ok") {
                sessionStorage.setItem(
                    `id_${response.data.user}`,
                    response.data.msg[`id_${response.data.user}`]
                );
                await import("./modal.js").then(({fecharModal}) =>
                    fecharModal("modal-verify-token")
                );
            } else {
                mostrarAlerta(response.data?.msg, "danger");
            }
        });
});

const senha = document.querySelector("#inp-senha");
const confSenha = document.querySelector("#inp-conf-senha");
const btnConcluir = document.querySelector(".btn-geral");

senha.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        confSenha.focus();
    }
});
confSenha.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnConcluir.click();
    }
});

btnConcluir.addEventListener("click", e => {
    e.preventDefault();
    if (!senha.value || !confSenha.value) return;
    if (senha.value != confSenha.value)
        return mostrarAlerta("Senhas diferentes", "danger");
    let id, tb;
    if (JSON.parse(sessionStorage.getItem("id_usuario"))) {
        id = JSON.parse(sessionStorage.getItem("id_usuario"));
        tb = "usuario";
    } else {
        id = JSON.parse(sessionStorage.getItem("id_staff"));
        tb = "staff";
    }
    axios
        .post("/usuario/redefinir-senha", {
            id,
            senha: senha.value,
            tb
        })
        .then(response => {
            if (response.data?.status == "ok") {
                mostrarAlerta(response.data?.msg, "success");
                window.location.href = "login";
            } else {
                mostrarAlerta(response.data?.msg, "danger");
            }
        });
});
