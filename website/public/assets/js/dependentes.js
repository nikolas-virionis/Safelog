const tabelaDependentes = document.querySelector(".tabela-listrada table");
const nomeUsuario = document.querySelector(".sub-chefe h3");
let searchBar = document.querySelector(".barra-pesquisa input");
let main = "",
    order = "";
nomeUsuario.innerText = JSON.parse(sessionStorage.getItem("usuario")).nome;
renderDependentes();
searchBar.addEventListener("keyup", e => {
    renderDependentes(searchBar.value.trim());
});
function renderDependentes(search) {
    tabelaDependentes.innerHTML = "";
    if (JSON.parse(sessionStorage.getItem("usuario"))?.cargo != "analista") {
        let tbody = document.createElement("tbody");
        let tr = document.createElement("tr");
        let nome = document.createElement("th");
        let email = document.createElement("th");
        let operacoes = document.createElement("th");
        let columns = ["nome", "email"];
        let nomeOrder = document.createElement("span");
        let emailOrder = document.createElement("span");
        nome.innerHTML = "Nome";
        email.innerHTML = "Email";
        operacoes.innerHTML = "Operações";
        tr.appendChild(nome);
        tr.appendChild(email);
        tr.appendChild(operacoes);
        columns.forEach(th => {
            if (main) {
                eval(`${main}Order.style.display = "block"`);
                eval(
                    `${main}Order.classList = \`fas fa-angle-${
                        order == "asc" ? "up" : "down"
                    }\``
                );
            }
            eval(th).addEventListener(
                "mouseover",
                () => (eval(th).style.backgroundColor = "#BFEEF7")
            );
            eval(th).addEventListener(
                "mouseout",
                () => (eval(th).style.backgroundColor = "")
            );
            eval(th).style.position = "relative";
            eval(th).style.cursor = "pointer";
            eval(th).appendChild(eval(`${th}Order`));
            eval(th).appendChild(eval(`${th}Order`));
            eval(th).appendChild(eval(`${th}Order`));
            eval(`${th}Order`).style.position = "absolute";
            eval(`${th}Order`).style.top = "2%";
            eval(`${th}Order`).style.right = "2%";
            eval(`${th}Order`).style.color = "black";

            eval(th).addEventListener("click", e => {
                if (main == th) {
                    if (order == "desc") {
                        eval(`${th}Order`).classList = "fas fa-angle-up";
                        eval(`${th}Order`).style.display = "block";
                        order = "asc";
                    } else {
                        eval(`${th}Order`).classList = "fas fa-angle-down";
                        eval(`${th}Order`).style.display = "none";
                        order = "";
                        main = "";
                    }
                } else {
                    columns.forEach(
                        btn => (eval(`${btn}Order`).style.display = "none")
                    );
                    eval(`${th}Order`).classList = "fas fa-angle-down";
                    eval(`${th}Order`).style.display = "block";
                    main = th;
                    order = "desc";
                }
                renderDependentes(search);
            });
        });
        tbody.appendChild(tr);
        tabelaDependentes.appendChild(tbody);
        let bodyObj = {
            id: JSON.parse(sessionStorage.getItem("usuario"))?.id,
            main,
            order
        };
        if (search) bodyObj.search = search;
        axios.post("/usuario/pessoas-dependentes", bodyObj).then(response => {
            // console.log(response.data);
            let {status, res: dependentes} = response.data;
            if (status == "ok") {
                if (dependentes.length > 0) {
                    dependentes.forEach(dependente => {
                        let tr = document.createElement("tr");
                        let tbNome = document.createElement("td");
                        let tbEmail = document.createElement("td");
                        let tbBtn = document.createElement("td");
                        let excluirBtnLbl = document.createElement("i");
                        let excluirBtn = document.createElement("button");
                        excluirBtnLbl.classList = "fas fa-trash-alt";
                        excluirBtn.classList = "btn-nav-dash-red";
                        excluirBtn.appendChild(excluirBtnLbl);
                        tbBtn.appendChild(excluirBtn);
                        tbNome.innerHTML = `${dependente.nome}`;
                        tbEmail.innerHTML = `${dependente.email}`;
                        tr.appendChild(tbNome);
                        tr.appendChild(tbEmail);
                        tr.appendChild(tbBtn);
                        tabelaDependentes.appendChild(tr);

                        // evento click para deletar usuário.
                        excluirBtn.addEventListener("click", function () {
                            // solicitando confirmação do delete

                            document.getElementById("nome-usuario").innerHTML =
                                dependente.nome;
                            document
                                .getElementById("btn-deletar-usuario")
                                .setAttribute(
                                    "id_usuario",
                                    dependente.id_usuario
                                );

                            import("./modal.js").then(({abrirModal}) =>
                                abrirModal("modal-log-del-usuario")
                            );
                        });
                    });

                    document
                        .getElementById("btn-cancelar-deletar-usuario")
                        .addEventListener("click", e => {
                            import("./modal.js").then(({fecharModal}) =>
                                fecharModal("modal-log-del-usuario")
                            );
                        });

                    document
                        .getElementById("btn-deletar-usuario")
                        .addEventListener("click", e => {
                            axios
                                .post("/usuario/delete", {
                                    id: document
                                        .getElementById("btn-deletar-usuario")
                                        .getAttribute("id_usuario")
                                })
                                .then(result => {
                                    if (result.data.status == "ok") {
                                        window.location.reload();
                                    } else {
                                        console.error(result.data);
                                    }
                                });
                        });
                } else {
                    mostrarAlerta(
                        "Nenhum dependente cadastrado, adicione um apertando no + acima",
                        "info"
                    );
                }
            }
        });
    } else {
        let tbody = document.createElement("tbody");
        let tr = document.createElement("tr");
        let id = document.createElement("th");
        let nome = document.createElement("th");
        let resp = document.createElement("th");
        let operacoes = document.createElement("th");
        let columns = ["id", "nome", "resp"];
        let idOrder = document.createElement("span");
        let nomeOrder = document.createElement("span");
        let respOrder = document.createElement("span");
        id.innerHTML = "Identificação";
        nome.innerHTML = "Nome";
        resp.innerHTML = "Responsável";
        operacoes.innerHTML = "Operações";
        tr.appendChild(id);
        tr.appendChild(nome);
        tr.appendChild(resp);
        tr.appendChild(operacoes);
        columns.forEach(th => {
            if (main) {
                eval(`${main}Order.style.display = "block"`);
                eval(
                    `${main}Order.classList = \`fas fa-angle-${
                        order == "asc" ? "up" : "down"
                    }\``
                );
            }
            eval(th).addEventListener(
                "mouseover",
                () => (eval(th).style.backgroundColor = "#BFEEF7")
            );
            eval(th).addEventListener(
                "mouseout",
                () => (eval(th).style.backgroundColor = "")
            );
            eval(th).style.position = "relative";
            eval(th).style.cursor = "pointer";
            eval(th).appendChild(eval(`${th}Order`));
            eval(th).appendChild(eval(`${th}Order`));
            eval(th).appendChild(eval(`${th}Order`));
            eval(`${th}Order`).style.position = "absolute";
            eval(`${th}Order`).style.top = "2%";
            eval(`${th}Order`).style.right = "2%";
            eval(`${th}Order`).style.color = "black";

            eval(th).addEventListener("click", e => {
                if (main == th) {
                    if (order == "desc") {
                        eval(`${th}Order`).classList = "fas fa-angle-up";
                        eval(`${th}Order`).style.display = "block";
                        order = "asc";
                    } else {
                        eval(`${th}Order`).classList = "fas fa-angle-down";
                        eval(`${th}Order`).style.display = "none";
                        order = "";
                        main = "";
                    }
                } else {
                    columns.forEach(
                        btn => (eval(`${btn}Order`).style.display = "none")
                    );
                    eval(`${th}Order`).classList = "fas fa-angle-down";
                    eval(`${th}Order`).style.display = "block";
                    main = th;
                    order = "desc";
                }
                renderDependentes(search);
            });
        });
        tbody.appendChild(tr);
        tabelaDependentes.appendChild(tbody);
        let bodyObj = {
            id: JSON.parse(sessionStorage.getItem("usuario"))?.id,
            main,
            order
        };
        if (search) bodyObj.search = search;
        axios
            .post("/maquina/lista-dependentes/analista", bodyObj)
            .then(({data: {status, msg: dependentes}}) => {
                if (status == "ok") {
                    if (dependentes.length > 0) {
                        dependentes.forEach(dependente => {
                            let tr = document.createElement("tr");
                            let tbId = document.createElement("td");
                            let tbNome = document.createElement("td");
                            let tbResp = document.createElement("td");
                            let tbBtn = document.createElement("td");
                            let excluirBtnLbl = document.createElement("i");
                            let excluirBtn = document.createElement("button");
                            let acessoBtn = document.createElement("button");
                            let acessoBtnLbl = document.createElement("i");
                            excluirBtnLbl.classList = "fas fa-trash-alt";
                            excluirBtn.classList =
                                "btn-nav-dash-red excluir-btn";
                            excluirBtn.appendChild(excluirBtnLbl);
                            excluirBtn.title = "Remover acesso à máquina";

                            // evento click para deletar máquina
                            excluirBtn.addEventListener("click", e => {
                                document.getElementById(
                                    "nome-maquina"
                                ).innerHTML = dependente.maquina;
                                document
                                    .getElementById("btn-deletar-maquina")
                                    .setAttribute(
                                        "pk_maquina",
                                        dependente.pk_maquina
                                    );

                                import("./modal.js").then(({abrirModal}) =>
                                    abrirModal("modal-log-del-maquina")
                                );
                            });

                            if (
                                nomeUsuario.innerText == dependente.responsavel
                            ) {
                                let editarBtnLbl = document.createElement("i");
                                let editarBtn =
                                    document.createElement("button");
                                editarBtnLbl.classList = "fas fa-pencil-alt";
                                editarBtn.classList = "btn-nav-dash";
                                editarBtn.addEventListener("click", () => {
                                    window.location.href = `edita-maquina?id_maquina=${dependente.id_maquina}`;
                                });
                                editarBtn.appendChild(editarBtnLbl);
                                editarBtn.title = "Editar máquina";

                                acessoBtn.classList = "btn-dash-acesso";
                                acessoBtnLbl.classList = "fas fa-user-cog";
                                acessoBtn.appendChild(acessoBtnLbl);
                                acessoBtn.title = "Gerenciar acessos";
                                acessoBtn.addEventListener("click", () => {
                                    window.location.href = `acesso-maquina?pk_maquina=${dependente.pk_maquina}`;
                                });

                                tbBtn.appendChild(editarBtn);
                                tbBtn.appendChild(acessoBtn);
                            }
                            tbBtn.appendChild(excluirBtn);
                            tbId.innerHTML = `${dependente.id_maquina}`;
                            tbNome.innerHTML = `${dependente.maquina}`;
                            tbResp.innerHTML = `${dependente.responsavel}`;
                            tr.appendChild(tbId);
                            tr.appendChild(tbNome);
                            tr.appendChild(tbResp);
                            tr.appendChild(tbBtn);
                            tabelaDependentes.appendChild(tr);
                        });

                        document
                            .getElementById("btn-cancelar-deletar-maquina")
                            .addEventListener("click", e => {
                                import("./modal.js").then(({fecharModal}) =>
                                    fecharModal("modal-log-del-maquina")
                                );
                            });

                        // realizando requisição do delete
                        document
                            .getElementById("btn-deletar-maquina")
                            .addEventListener("click", e => {
                                axios
                                    .post("/usuario/remocao-proprio-acesso", {
                                        id: JSON.parse(
                                            sessionStorage.getItem("usuario")
                                        )?.id,
                                        maquina: document
                                            .getElementById(
                                                "btn-deletar-maquina"
                                            )
                                            .getAttribute("pk_maquina")
                                    })
                                    .then(({data: {status, msg}}) => {
                                        import("./modal.js").then(
                                            ({fecharModal}) =>
                                                fecharModal("modal-log-del")
                                        );

                                        if (status == "ok") {
                                            mostrarAlerta(msg, "success");
                                            setTimeout(
                                                () => window.location.reload(),
                                                3000
                                            );
                                        } else if (status == "alerta") {
                                            mostrarAlerta(msg, "danger");
                                        } else {
                                            console.error(msg);
                                        }
                                    });
                            });
                    } else {
                        mostrarAlerta(
                            "Nenhum dependente cadastrado, adicione um apertando no + acima",
                            "info"
                        );
                    }
                }
            });
    }
}

const email = document.querySelector("#email-convite");
const btnConfirmar = document.querySelector("#btn-prosseguir-modal");
const btnCancelar = document.querySelector("#btn-cancelar-modal");
const btnCancelar2 = document.querySelector("#btn-cancelar-modal2");
const btnCadastroMaq = document.querySelector("#btn-cadastro-maq");
const btnAtribuirMaq = document.querySelector("#btn-atribuir-maq");
const btnAbrirConvite = document.querySelector(".convite-email");
btnAbrirConvite.title = "Adicionar dependentes";

btnAbrirConvite.addEventListener("click", e => {
    if (JSON.parse(sessionStorage.getItem("usuario")).cargo != "analista") {
        import("./modal.js").then(({abrirModal}) =>
            abrirModal("modal-send-email")
        );
    } else
        import("./modal.js").then(({abrirModal}) =>
            abrirModal("modal-log-cad-maq")
        );
});
btnCancelar.addEventListener("click", e =>
    import("./modal.js").then(({fecharModal}) =>
        fecharModal("modal-send-email")
    )
);

btnCancelar2.addEventListener("click", e =>
    import("./modal.js").then(({fecharModal}) =>
        fecharModal("modal-log-cad-maq")
    )
);

email.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnConfirmar.click();
    }
});

btnCadastroMaq.addEventListener("click", e => {
    window.location.href = "cadastro-maquina";
});
btnAtribuirMaq.addEventListener("click", e => {
    window.location.href = "atribuir-maquina";
});
btnConfirmar.addEventListener("click", async e => {
    const {validateEmail} = await import("./email.js");
    if (!email.value) return;
    if (!validateEmail(email.value))
        return mostrarAlerta("Email inválido", "danger");
    let {cargo, id, id_empresa} = JSON.parse(sessionStorage.getItem("usuario"));
    axios
        .post("/usuario/convite", {
            email: email.value,
            cargo: cargo == "admin" ? "gestor" : "analista",
            fk_empresa: id_empresa,
            fk_supervisor: id
        })
        .then(res => {
            if (res.data?.status == "ok") {
                mostrarAlerta(
                    "Email convidado e inserido no banco (parcialmente)",
                    "success"
                );
                email.value = "";
            } else {
                mostrarAlerta("Erro no convite do usuario", "danger");
            }
        });
});
