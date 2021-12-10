const urlParams = new URLSearchParams(window.location.search);
const pkMaquina = Number(urlParams.get("pk_maquina"));
const btnCancelar = document.querySelector("#btn-cancelar-modal");
const btnConvidar = document.querySelector("#btn-prosseguir-modal");
const emailConvite = document.querySelector("#email-convite");
let reload = false;

axios
    .post("/machine/dados", {
        maquina: pkMaquina
    })
    .then(({data: {status, msg}}) => {
        if (status === "ok") {
            document.querySelector(".titulo-acesso").innerHTML = msg.nome;
            document.querySelector("#spanNomeMaq").innerHTML = msg.nome;
        } else {
            console.error("Erro: ", msg);
        }
    });

axios
    .post("/machine/lista-usuarios", {
        id: pkMaquina
    })
    .then(({data: {status, msg}}) => {
        console.log(msg);
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

                btnResp.appendChild(lblResp);

                tdOperacoes.appendChild(btnResp);

                tdNome.innerHTML = nome;
                tdEmail.innerHTML = email;

                tr.appendChild(tdNome);
                tr.appendChild(tdEmail);
                tr.appendChild(tdOperacoes);

                tbUsuarios.appendChild(tr);

                btnDelete.addEventListener("click", e => {
                    document.getElementById("nome-usuario-acesso").innerHTML =
                        nome;
                    document
                        .getElementById("btn-tirar-acesso")
                        .setAttribute("id_usuario", id_usuario);
                    document
                        .getElementById("btn-tirar-acesso")
                        .setAttribute("maquina", pkMaquina);

                    import("./modal.js").then(({abrirModal}) =>
                        abrirModal("modal-log-tirar-acesso")
                    );
                });

                btnResp.addEventListener("click", e => {
                    document.getElementById(
                        "nome-usuario-dar-acesso"
                    ).innerHTML = nome;
                    document
                        .getElementById("btn-dar-acesso")
                        .setAttribute("id_usuario", id_usuario);
                    document
                        .getElementById("btn-dar-acesso")
                        .setAttribute("maquina", pkMaquina);
                });
            });

            document
                .getElementById("btn-cancelar-tirar-acesso")
                .addEventListener("click", e => {
                    import("./modal.js").then(({fecharModal}) =>
                        fecharModal("modal-log-tirar-acesso")
                    );
                });

            document
                .getElementById("btn-tirar-acesso")
                .addEventListener("click", e => {
                    axios
                        .post("/user/remocao-acesso", {
                            id: document
                                .getElementById("btn-tirar-acesso")
                                .getAttribute("id_usuario"),
                            maquina: document
                                .getElementById("btn-tirar-acesso")
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
                .getElementById("btn-cancelar-dar-acesso")
                .addEventListener("click", e => {
                    import("./modal.js").then(({fecharModal}) =>
                        fecharModal("modal-log-dar-acesso")
                    );
                });

            document
                .getElementById("btn-dar-acesso")
                .addEventListener("click", e => {
                    axios
                        .post("/user/dados", {
                            id: document
                                .getElementById("btn-dar-acesso")
                                .getAttribute("id_usuario")
                        })
                        .then(({data: {status, msg}}) => {
                            if (status === "ok") {
                                axios
                                    .post("/user/transferencia-responsavel", {
                                        email: msg.email,
                                        maquina: document
                                            .getElementById("btn-dar-acesso")
                                            .getAttribute("maquina"),
                                        del: false
                                    })
                                    .then(({data: {status, msg}}) => {
                                        if (status === "ok") {
                                            mostrarAlerta(msg, "success");
                                            setTimeout(() => {
                                                window.location.href =
                                                    "dashboard";
                                            }, 2000);
                                        } else {
                                            console.error(msg);
                                        }
                                    });
                            } else {
                                console.error(msg);
                            }
                        });
                });
        } else {
            mostrarAlerta("Erro no gerenciamento de usuario", "danger");
        }
    });
