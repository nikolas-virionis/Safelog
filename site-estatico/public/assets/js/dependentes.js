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
                id: JSON.parse(sessionStorage.getItem("usuario"))?.id,
            })
            .then((response) => {
                let { status, res: dependentes } = response.data;
                if (status == "ok") {
                    if (dependentes.length > 0) {
                        dependentes.forEach((dependente) => {
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
                        });
                    } else {
                        let div = document.createElement("div");
                        div.innerHTML =
                            "Nenhum dependente cadastrado, adicione um apertando no + acima";
                        let tr = document.createElement("tr");
                        tr.appendChild(div);
                        tabelaDependentes.appendChild(tr);
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
                id: JSON.parse(sessionStorage.getItem("usuario"))?.id,
            })
            .then((response) => {
                let { status, res: dependentes } = response.data;
                if (status == "ok") {
                    if (dependentes.length > 0) {
                        dependentes.forEach((dependente) => {
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
                        });
                    } else {
                        let div = document.createElement("div");
                        div.innerHTML =
                            "Nenhum dependente cadastrado, adicione um apertando no + acima";
                        let tr = document.createElement("tr");
                        tr.appendChild(div);
                        tabelaDependentes.appendChild(tr);
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
const btnAbrirConvite = document.querySelector(".convite-email");
btnAbrirConvite.title = "Adicionar dependentes";

btnAbrirConvite.addEventListener("click", (e) => {
    if (JSON.parse(sessionStorage.getItem("usuario")).cargo != "analista")
        import("./modal.js").then(({ abrirModal }) =>
            abrirModal("modal-send-email")
        );
    else window.location.href = "cadastro-maquina.html";
});
btnCancelar.addEventListener("click", (e) =>
    import("./modal.js").then(({ fecharModal }) =>
        fecharModal("modal-send-email")
    )
);

email.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnConfirmar.click();
    }
});
const validateEmail = (email) => {
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
};

btnConfirmar.addEventListener("click", (e) => {
    if (!email.value) return;
    if (!validateEmail(email.value)) return mostrarAlerta("Email inválido", "danger");;
    let { cargo, id, id_empresa } = JSON.parse(
        sessionStorage.getItem("usuario")
    );
    axios
        .post("/usuario/convite", {
            email: email.value,
            cargo: cargo == "admin" ? "gestor" : "analista",
            fk_empresa: id_empresa,
            fk_supervisor: id,
        })
        .then((res) => {
            if (res.data?.status == "ok") {
                mostrarAlerta("Email convidado e inserido no banco (parcialmente)", "success");
                email.value = "";
            } else{
                mostrarAlerta("Erro no convite do usuario", "danger");
            }
        });
});
