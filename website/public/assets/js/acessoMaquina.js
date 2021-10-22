const urlParams = new URLSearchParams(window.location.search);
const pkMaquina = Number(urlParams.get("pk_maquina"));
const btnCancelar = document.querySelector("#btn-cancelar-modal");
const btnConvidar = document.querySelector("#btn-prosseguir-modal");
const emailConvite = document.querySelector("#email-convite");
let reload = false;

axios
    .post("/maquina/dados", {
        maquina: pkMaquina
    })
    .then(({data: {status, msg}}) => {
        if (status === "ok") {
            document.querySelector(".titulo-acesso").innerHTML = msg.nome;
        } else {
            console.error("Erro: ", msg);
        }
    });

axios
    .post("/maquina/lista-usuarios", {
        id: pkMaquina
    })
    .then(({data: {status, msg}}) => {
        if (status === "ok") {
            let tbUsuarios = document.querySelector("#tblAcessoMaq");

            msg.forEach(({nome, email, id_usuario}) => {
                let tr = document.createElement("tr");
                let tdNome = document.createElement("td");
                let tdEmail = document.createElement("td");
                let tdOperacoes = document.createElement("td");

                let btnResp = document.createElement("button");
                btnResp.classList.add("btn-nav-dash-yellow");
                let btnDelete = document.createElement("button");
                btnDelete.classList.add("btn-nav-dash-red");

                let lblResp = document.createElement("i");
                lblResp.classList = "fas fa-star";
                let lblDelete = document.createElement("i");
                lblDelete.classList = "fas fa-times";

                btnResp.appendChild(lblResp);
                btnDelete.appendChild(lblDelete);

                tdOperacoes.appendChild(btnResp);
                tdOperacoes.appendChild(btnDelete);

                tdNome.innerHTML = nome;
                tdEmail.innerHTML = email;

                tr.appendChild(tdNome);
                tr.appendChild(tdEmail);
                tr.appendChild(tdOperacoes);

                tbUsuarios.appendChild(tr);

                btnDelete.addEventListener("click", e => {
                    let confirmar = confirm(
                        `Você realmente deseja tirar o acesso de ${nome}`
                    );
                    if (confirmar) {
                        axios
                            .post("/usuario/remocao-acesso", {
                                id: id_usuario,
                                maquina: pkMaquina
                            })
                            .then(({data: {status, msg}}) => {
                                if (status === "ok") {
                                    mostrarAlerta(msg, "success");
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 2000);
                                } else {
                                    console.error(msg);
                                }
                            });
                    }
                });

                btnResp.addEventListener("click", e => {
                    let confirmar = confirm(
                        `Você realmente deseja tornar ${nome} o responsável pela máquina? 
                        Você se tornará um usuário comum dela`
                    );
                    if (confirmar) {
                        axios
                            .post("/usuario/dados", {
                                id: id_usuario
                            })
                            .then(({data: {status, msg}}) => {
                                if (status === "ok") {
                                    axios
                                        .post(
                                            "/usuario/transferencia-responsavel",
                                            {
                                                email: msg.email,
                                                maquina: pkMaquina,
                                                del: false
                                            }
                                        )
                                        .then(({data: {status, msg}}) => {
                                            if (status === "ok") {
                                                mostrarAlerta(msg, "success");
                                                setTimeout(() => {
                                                    window.location.href =
                                                        "dependentes";
                                                }, 2000);
                                            } else {
                                                mostrarAlerta(msg, "danger");
                                            }
                                        });
                                } else {
                                    console.error(msg);
                                }
                            });
                    }
                });
            });
        } else {
            mostrarAlerta("Erro no gerenciamento de usuario", "danger");
        }
    });

document.querySelector("#btnAddUser").addEventListener("click", () => {
    import("./modal.js").then(({abrirModal}) =>
        abrirModal("modal-invite-user")
    );
});

btnCancelar.addEventListener("click", e =>
    import("./modal.js").then(({fecharModal}) => {
        fecharModal("modal-invite-user");
        if (reload) window.location.reload();
    })
);

emailConvite.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnConvidar.click();
    }
});

btnConvidar.addEventListener("click", async e => {
    const {validateEmail} = await import("./email.js");
    if (!emailConvite.value) return;
    if (!validateEmail(emailConvite.value))
        return mostrarAlerta("Email inválido", "danger");
    axios
        .post("/maquina/convite", {
            email: emailConvite.value,
            maquina: pkMaquina
        })
        .then(({data: {status, msg}}) => {
            if (status == "ok") {
                mostrarAlerta(msg, "success");
                emailConvite.value = "";
                reload = true;
            } else if(status == "alerta") {
                mostrarAlerta(msg, "danger");
            }
        });
});
