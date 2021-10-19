const urlParams = new URLSearchParams(window.location.search);
const pkMaquina = Number(urlParams.get("pk_maquina"));

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

const btnCancelar = document.querySelector("#btn-cancelar-modal");

btnCancelar.addEventListener("click", e =>
    import("./modal.js").then(({fecharModal}) =>
        fecharModal("modal-invite-user")
    )
);
