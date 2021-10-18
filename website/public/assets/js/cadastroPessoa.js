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
btnProsseguir.addEventListener("click", async e => {
    const {validateEmail} = await import("./email.js");
    if (!validateEmail(emailInModal.value))
        return mostrarAlerta("Email inválido", "danger");
    sessionStorage.setItem("email", emailInModal.value);
    axios
        .post("/usuario/verificacao", {
            email: emailInModal.value,
            token: tokenInModal.value
        })
        .then(response => {
            if (response.data?.status == "ok") {
                mostrarAlerta("Usuário verificado com sucesso", "success");
                sessionStorage.setItem(
                    "id_usuario",
                    response.data.msg.id_usuario
                );
                import("./modal.js").then(({fecharModal}) =>
                    fecharModal("modal-verify-token")
                );
                emailCadastro.value = sessionStorage.getItem("email");
            } else {
                mostrarAlerta("Erro na verificação do usuario", "danger");
            }
        });
});
btnCancelar.addEventListener("click", async e => {
    let {cancelarModal} = await import("./modal.js");
    cancelarModal();
});

let redes = ["whatsapp", "telegram", "slack"];

for (let rede of redes) {
    document
        .getElementById(`contato-${rede}`)
        .addEventListener("change", function (a) {
            if (this.checked) {
                document.getElementById(`input-${rede}`).style.visibility =
                    "visible";
                document.getElementById(`input-${rede}`).style.width = "40%";
            } else {
                document.getElementById(`input-${rede}`).style.width = "0px";
                document.getElementById(`input-${rede}`).style.visibility =
                    "hidden";
            }
        });

    document.getElementById(`input-${rede}`).addEventListener("keypress", e => {
        if (e.key == "Enter") {
            e.preventDefault();
        }
    });
}

const nome = document.querySelector("#inp-nome");
const senha = document.querySelector("#inp-senha");
const confirmarSenha = document.querySelector("#inp-conf-senha");
const btn = document.querySelector(".btn-geral");
const form = document.querySelector("#form-cadastro");
sessionStorage.removeItem("email");

nome.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        emailCadastro.focus();
    }
});
emailCadastro.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        senha.focus();
    }
});
senha.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        confirmarSenha.focus();
    }
});
confirmarSenha.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        confirmarSenha.blur();
    }
});

form.addEventListener("submit", async e => {
    e.preventDefault();
    const {validateEmail} = await import("./email.js");
    if (!validateEmail(emailCadastro.value))
        return mostrarAlerta("Email inválido", "danger");
    if (senha.value !== confirmarSenha.value)
        return mostrarAlerta("Senhas diferentes", "danger");
    let contatos = {};
    if (document.getElementById("contato-whatsapp").checked)
        contatos.whatsapp = document.getElementById("input-whatsapp").value;
    if (document.getElementById("contato-telegram").checked)
        contatos.telegram = document.getElementById("input-telegram").value;
    if (document.getElementById("contato-slack").checked)
        contatos.slack = document.getElementById("input-slack").value;
    let id = JSON.parse(sessionStorage.getItem("id_usuario"));
    axios
        .post("/usuario/cadastro-final", {
            id,
            nome: nome.value,
            email: emailCadastro.value,
            senha: senha.value,
            contatos
        })
        .then(response => {
            if (response.data?.status == "ok") {
                console.log("Cadastro final realizado com sucesso");
                axios
                    .post("/auth/usuario", {
                        email: emailCadastro.value,
                        senha: senha.value
                    })
                    .then(resposta => {
                        sessionStorage.clear();
                        if (resposta.data.status == "ok") {
                            console.log("Usuario logado");
                            let {status, ...user} = resposta.data;
                            sessionStorage.setItem(
                                "usuario",
                                JSON.stringify(user)
                            );
                            window.location.href = "perfil";
                        }
                    });
            }
        });
});

// $(document).ready(function(){
//     $('#input-whatsapp').mask('(00) 00000-0000');
// });
