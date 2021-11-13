const urlParams = new URLSearchParams(window.location.search);
const pkMaquina = Number(urlParams.get("pk_maquina"));
const btnCancelar = document.querySelector("#btn-cancelar-modal");
const btnConvidar = document.querySelector("#btn-prosseguir-modal");
const emailConvite = document.querySelector("#email-convite");
const searchBar = document.querySelector(".barra-pesquisa input");
const tbUsuarios = document.querySelector("#tblAcessoMaq");
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

getUsuarios();
searchBar.addEventListener("keyup", e => getUsuarios(searchBar.value.trim()));

function getUsuarios(search) {
    tbUsuarios.innerHTML = "";
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let nome = document.createElement("th");
    let email = document.createElement("th");
    let operacoes = document.createElement("th");
    nome.innerHTML = "Nome";
    email.innerHTML = "Email";
    operacoes.innerHTML = "Operações";
    tr.appendChild(nome);
    tr.appendChild(email);
    tr.appendChild(operacoes);
    tbody.appendChild(tr);
    tbUsuarios.appendChild(tbody);
    const obj = {id: pkMaquina};
    if (search) obj.search = search;
    axios.post("/maquina/lista-usuarios", obj).then(({data: {status, msg}}) => {
        if (status === "ok") {
            if (msg.length) {
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
                    btnResp.title = "Tornar responsável da máquina";
                    btnDelete.appendChild(lblDelete);
                    btnDelete.title = "Remover acesso";

                    tdOperacoes.appendChild(btnResp);
                    tdOperacoes.appendChild(btnDelete);

                    tdNome.innerHTML = nome;
                    tdEmail.innerHTML = email;

                    tr.appendChild(tdNome);
                    tr.appendChild(tdEmail);
                    tr.appendChild(tdOperacoes);

                    tbUsuarios.appendChild(tr);

                    btnDelete.addEventListener("click", e => {
                        document.getElementById(
                            "nome-usuario-acesso"
                        ).innerHTML = nome;
                        document
                            .getElementById("btn-deletar-acesso")
                            .setAttribute("id_usuario", id_usuario);
                        document
                            .getElementById("btn-deletar-acesso")
                            .setAttribute("maquina", pkMaquina);

                        import("./modal.js").then(({abrirModal}) =>
                            abrirModal("modal-log-del-acesso")
                        );
                    });

                    btnResp.addEventListener("click", e => {
                        document.getElementById(
                            "nome-usuario-responsavel"
                        ).innerHTML = nome;
                        document
                            .getElementById("btn-tornar-responsavel")
                            .setAttribute("id_usuario", id_usuario);
                        document
                            .getElementById("btn-tornar-responsavel")
                            .setAttribute("maquina", pkMaquina);

                        import("./modal.js").then(({abrirModal}) =>
                            abrirModal("modal-log-tornar-responsavel")
                        );
                    });
                });

                document
                    .getElementById("btn-cancelar-deletar-acesso")
                    .addEventListener("click", e => {
                        import("./modal.js").then(({fecharModal}) =>
                            fecharModal("modal-log-del-acesso")
                        );
                    });

                document
                    .getElementById("btn-deletar-acesso")
                    .addEventListener("click", e => {
                        axios
                            .post("/usuario/remocao-acesso", {
                                id: document
                                    .getElementById("btn-deletar-acesso")
                                    .getAttribute("id_usuario"),
                                maquina: document
                                    .getElementById("btn-deletar-acesso")
                                    .getAttribute("maquina")
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
                    });

                document
                    .getElementById("btn-cancelar-tornar-responsavel")
                    .addEventListener("click", e => {
                        import("./modal.js").then(({fecharModal}) =>
                            fecharModal("modal-log-tornar-responsavel")
                        );
                    });

                document
                    .getElementById("btn-tornar-responsavel")
                    .addEventListener("click", e => {
                        axios
                            .post("/usuario/dados", {
                                id: document
                                    .getElementById("btn-tornar-responsavel")
                                    .getAttribute("id_usuario")
                            })
                            .then(({data: {status, msg}}) => {
                                if (status === "ok") {
                                    axios
                                        .post(
                                            "/usuario/transferencia-responsavel",
                                            {
                                                email: msg.email,
                                                maquina: document
                                                    .getElementById(
                                                        "btn-tornar-responsavel"
                                                    )
                                                    .getAttribute("maquina"),
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
                    });
            } else {
                mostrarAlerta(
                    "Máquina não possui usuários\nOs adicione no icone +",
                    "info"
                );
            }
        } else {
            mostrarAlerta("Erro no gerenciamento de usuario", "danger");
        }
    });
}

document.querySelector("#btnAddUser").title = "Convidar novo usuário";
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
            } else if (status == "alerta") {
                mostrarAlerta(msg, "danger");
            }
        });
});
