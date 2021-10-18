(() => {
    const tabelaDependentes = document.querySelector(".tabela-listrada table");
    if (JSON.parse(sessionStorage.getItem("usuario"))?.cargo != "analista") {
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
        tabelaDependentes.appendChild(tbody);
        axios
            .post("/usuario/pessoas-dependentes", {
                id: JSON.parse(sessionStorage.getItem("usuario"))?.id
            })
            .then(response => {
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
                                let sure = confirm(
                                    `Você tem certeza que deseja deletar o usuário: ${dependente.nome}?`
                                );
                                if (sure) {
                                    // requisição de delete
                                    axios
                                        .post("/usuario/delete", {
                                            id: dependente.id_usuario
                                        })
                                        .then(result => {
                                            if (result.data.status == "ok") {
                                                window.location.reload();
                                            }
                                        });
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
        id.innerHTML = "Identificação";
        nome.innerHTML = "Nome";
        resp.innerHTML = "Responsável";
        operacoes.innerHTML = "Operações";
        tr.appendChild(id);
        tr.appendChild(nome);
        tr.appendChild(resp);
        tr.appendChild(operacoes);
        tbody.appendChild(tr);
        tabelaDependentes.appendChild(tbody);
        axios
            .post("/maquina/lista-dependentes", {
                id: JSON.parse(sessionStorage.getItem("usuario"))?.id
            })
            .then(response => {
                let {status, res: dependentes} = response.data;
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
                            let editarBtnLbl = document.createElement("i");
                            let editarBtn = document.createElement("button");
                            excluirBtnLbl.classList = "fas fa-trash-alt";
                            excluirBtn.classList = "btn-nav-dash-red";
                            editarBtnLbl.classList = "fas fa-pencil-alt";
                            editarBtn.classList = "btn-nav-dash";
                            editarBtn.addEventListener(
                                "click",
                                () =>
                                    (window.location.href = `edita-maquina?id_maquina=${dependente.id_maquina}`)
                            );
                            excluirBtn.appendChild(excluirBtnLbl);
                            editarBtn.appendChild(editarBtnLbl);
                            tbBtn.appendChild(editarBtn);
                            tbBtn.appendChild(excluirBtn);
                            tbId.innerHTML = `${dependente.id_maquina}`;
                            tbNome.innerHTML = `${dependente.nome}`;
                            tbResp.innerHTML = `${dependente.responsavel}`;
                            tr.appendChild(tbId);
                            tr.appendChild(tbNome);
                            tr.appendChild(tbResp);
                            tr.appendChild(tbBtn);
                            tabelaDependentes.appendChild(tr);

                            // evento click para deletar máquina
                            excluirBtn.addEventListener("click", function () {
                                // solicitando confirmação do delete
                                let sure = confirm(
                                    `Você tem certeza de que quer deletar a máquina ${dependente.nome}?`
                                );

                                // realizando requisição do delete
                                if (sure) {
                                    axios
                                        .post("/maquina/delete", {
                                            id: dependente.pk_maquina
                                        })
                                        .then(result => {
                                            if (result.data.status == "ok") {
                                                window.location.reload();
                                            }
                                        });
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
    const nomeUsuario = document.querySelector(".sub-chefe h3");
    nomeUsuario.innerText = JSON.parse(sessionStorage.getItem("usuario")).nome;
})();

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
