const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const form = document.querySelector("#form_login");
const btn = document.querySelector(".btn-geral");
const btnEsqSenha = document.querySelector("#spanEsqueciSenha");
const btnFecharModal = document.querySelector("#btn-cancelar-modal");

email.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        senha.focus();
    }
});
senha.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        btn.click();
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validarLogin();
});

btnEsqSenha.addEventListener("click", (e) => {
    import("./modal.js").then(({ abrirModal }) => {
        abrirModal("modal-esqueci-senha");
    });
});

btnFecharModal.addEventListener("click", (e) => {
    import("./modal.js").then(({ fecharModal }) => {
        fecharModal("modal-esqueci-senha");
    });
});

const validarLogin = () => {
    axios
        .post("/auth/staff", {
            email: email.value,
            senha: senha.value,
        })
        .then((response) => {
            if (response.data.status == "ok") {
                mostrarAlerta("Usuario logado como staff", "success");
                let { status, ...user } = response.data;
                sessionStorage.setItem("staff", JSON.stringify(user));
                window.location.href = "cadastro-empresa.html";
            } else {
                axios
                    .post("/auth/usuario", {
                        email: email.value,
                        senha: senha.value,
                    })
                    .then((res) => {
                        console.log(res);
                        if (res.data.status == "ok") {
                            mostrarAlerta(
                                "Usuario logado com sucesso",
                                "success"
                            );
                            let { status, ...user } = res.data;
                            sessionStorage.setItem(
                                "usuario",
                                JSON.stringify(user)
                            );
                            window.location.href = "dashboard.html";
                        } else {
                            mostrarAlerta(
                                "Usuário ou senha inválidos",
                                "warning"
                            );
                        }
                    });
            }
        });
};

const emailInModal = document.querySelector("#idInputEmail");
const btnModal = document.querySelector("#btn-prosseguir-modal");

emailInModal.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnModal.click();
    }
});
btnModal.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!emailInModal.value) {
        mostrarAlerta("Digite um email", "warning");
        return;
    }
    const { validateEmail } = await import("./email.js");
    if (!validateEmail(emailInModal.value))
        return mostrarAlerta("Email inválido", "danger");
    axios
        .post("/usuario/email-redefinir-senha", {
            email: emailInModal.value,
        })
        .then((response) => {
            if (response.data?.status == "ok") {
                email.value = "";
                mostrarAlerta(
                    "Verifique seu email para redefinir a senha",
                    "success"
                );
            } else {
                mostrarAlerta(
                    "Erro no processo de redefinição de senha",
                    "danger"
                );
            }
        });
});
