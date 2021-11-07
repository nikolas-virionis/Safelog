const urlParams = new URLSearchParams(window.location.search);
console.log(urlParams);
const token = urlParams.get("token");
const email = urlParams.get("email");
const emailInModal = document.querySelector("#inp-email");
const tokenInModal = document.querySelector("#inp-token");
tokenInModal.value = token;
emailInModal.value = email;

const btnProsseguir = document.querySelector("#btn-prosseguir-modal");
const btnCancelarModal = document.querySelector("#btn-cancelar-modal");

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
btnCancelarModal.addEventListener("click", async e => {
    e.preventDefault();
    let {cancelarModal} = await import("./modal.js");
    cancelarModal();
});
btnProsseguir.addEventListener("click", async e => {
    e.preventDefault();
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
                        if (status === "ok") {
                            sessionStorage.setItem(
                                "usuario",
                                JSON.stringify({...msg})
                            );
                            nomeUser.innerText = msg.nome.split(" ").shift();
                            import("./modal.js").then(({fecharModal}) =>
                                fecharModal("modal-verify-token")
                            );
                        }
                    })
                    .catch(err => console.error(err));
                import("./modal.js").then(({fecharModal}) =>
                    fecharModal("modal-verify-token")
                );
            } else {
                mostrarAlerta(msg, "danger");
            }
        });
});

const emailResp = document.querySelector("#email-inp");
const btnConvidar = document.querySelector(".btn-geral");
const btnCancelar = document.querySelector(".cancelar");
const nomeMaquina = document.querySelector("#nome-maq");

axios
    .post("/maquina/dados", {
        maquina: urlParams.get("maquina")
    })
    .then(({data: {status, msg}}) => {
        if (status === "ok") {
            nomeMaquina.innerText = msg.nome;
        } else {
            console.error(msg);
        }
    })
    .catch(err => console.error(err));

emailResp.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        btnConvidar.click();
    }
});

btnCancelar.addEventListener("click", e => {
    mostrarAlerta(
        "Um novo responsável deve ser atribuído à essa máquina",
        "danger"
    );
    setTimeout(() => {
        import("./modal.js").then(({abrirModal}) =>
            abrirModal("modal-log-certeza-sair")
        );                 
    }, 3000);
});
document.getElementById("btn-cancelar-sair").addEventListener("click", e => {
    import("./modal.js").then(({fecharModal}) =>
        fecharModal("modal-log-certeza-sair")
    )
});


document.getElementById("btn-sair").addEventListener("click", e => {
    window.location.href = "dependentes";
});


btnConvidar.addEventListener("click", async e => {
    e.preventDefault();
    const {validateEmail} = await import("./email.js");
    if (!emailResp.value) return;
    if (!validateEmail(emailResp.value))
        return mostrarAlerta("Email inválido", "danger");
    axios
        .post("/usuario/transferencia-responsavel", {
            email: emailResp.value,
            maquina: urlParams.get("maquina"),
            del: urlParams.get("del_type") == "usuario",
            delType: urlParams.get("del_type")
        })
        .then(({data: {status, msg}}) => {
            if (status === "ok") {
                mostrarAlerta(msg, "success");
                setTimeout(() => (window.location.href = "dependentes"));
            } else if (status === "alerta") {
                mostrarAlerta(msg, "danger");
            } else {
                console.error(msg);
            }
        });
});
