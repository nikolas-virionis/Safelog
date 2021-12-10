const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const form = document.querySelector("#form_login");
const btn = document.querySelector(".btn-geral");
const btnEsqSenha = document.querySelector("#spanEsqueciSenha");
const btnFecharModal = document.querySelector("#btn-cancelar-modal");

email.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        senha.focus();
    }
});
senha.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        btn.click();
    }
});

form.addEventListener("submit", e => {
    e.preventDefault();
    validarLogin();
});

btnEsqSenha.addEventListener("click", e => {
    import("./modal.js").then(({abrirModal}) => {
        abrirModal("modal-esqueci-senha");
    });
});

btnFecharModal.addEventListener("click", e => {
    import("./modal.js").then(({fecharModal}) => {
        fecharModal("modal-esqueci-senha");
    });
});

const validarLogin = () => {
    axios
        .post("/auth/staff", {
            email: email.value,
            senha: senha.value
        })
        .then(({data: {status, msg, ...user}}) => {
            if (status == "ok") {
                mostrarAlerta(msg, "success");
                sessionStorage.setItem("staff", JSON.stringify(user));
                window.location.href = "company-register";
            } else {
                axios
                    .post("/auth/usuario", {
                        email: email.value,
                        senha: senha.value
                    })
                    .then(({data: {status, msg, ...user}}) => {
                        if (status == "ok") {
                            mostrarAlerta(msg, "success");
                            sessionStorage.setItem(
                                "usuario",
                                JSON.stringify(user)
                            );
                            window.location.href = "dashboard";
                        } else if (status === "alerta") {
                            mostrarAlerta(msg, "danger");
                        }
                    });
            }
        });
};

const emailInModal = document.querySelector("#idInputEmail");
const btnModal = document.querySelector("#btn-prosseguir-modal");

emailInModal.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnModal.click();
    }
});
btnModal.addEventListener("click", async e => {
    e.preventDefault();
    if (!emailInModal.value) {
        mostrarAlerta("Digite um email", "danger");
        return;
    }
    const {validateEmail} = await import("./email.js");
    if (!validateEmail(emailInModal.value))
        return mostrarAlerta("Email inválido", "danger");
    axios
        .post("/user/email-redefinir-senha", {
            email: emailInModal.value
        })
        .then(response => {
            if (response.data?.status == "ok") {
                email.value = "";
                mostrarAlerta(response.data?.msg, "success");
            } else {
                mostrarAlerta(response.data?.msg, "danger");
            }
        });
});
