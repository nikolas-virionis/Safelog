let {id, cargo} = JSON.parse(sessionStorage.getItem("usuario"));
const tabelaIncidentes = document.querySelector(".tabela-listrada table");
const searchBar = document.querySelector(".barra-pesquisa input");
gerarRelatorioIncidentes();
searchBar.addEventListener("keyup", e => {
    gerarRelatorioIncidentes(searchBar.value.trim());
    console.log(searchBar.value.trim());
});

function gerarRelatorioIncidentes(search) {
    tabelaIncidentes.innerHTML = "";
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let data = document.createElement("th");
    let responsavel = document.createElement("th");
    let operacoes = document.createElement("th");
    let componente = document.createElement("th");
    let metrica = document.createElement("th");
    let maquina = document.createElement("th");
    let estado = document.createElement("th");
    let medicao = document.createElement("th");
    data.innerHTML = "Data";
    maquina.innerHTML = "Máquina";
    componente.innerHTML = "Componente";
    metrica.innerHTML = "Métrica";
    estado.innerHTML = "Estado";
    operacoes.innerHTML = "Operações";
    tr.appendChild(data);
    if (cargo != "analista") {
        responsavel.innerHTML = "Responsavel";
        tr.appendChild(responsavel);
    }
    tr.appendChild(maquina);
    tr.appendChild(componente);
    tr.appendChild(metrica);
    tr.appendChild(estado);
    if (cargo == "analista") {
        medicao.innerHTML = "Medição";
        tr.appendChild(medicao);
    }
    tr.appendChild(operacoes);
    tbody.appendChild(tr);
    tabelaIncidentes.appendChild(tbody);
    const bodyObj = {id};
    if (search) bodyObj.search = search;
    axios
        .post(`/medicao/relatorio-incidentes/${cargo}`, bodyObj)
        .then(({data: {status, response: maquinas}}) => {
            if (status != "ok") return console.error(maquinas);
            if (!maquinas.length || !maquinas[0].length)
                return mostrarAlerta(
                    "Ainda não há registros de incidentes em maquinas de seu acesso",
                    "info"
                );
            for (let maquina of maquinas) {
                for (let incidente of maquina) {
                    let tr = document.createElement("tr");
                    let tbData = document.createElement("td");
                    let tbNome = document.createElement("td");
                    let tbComponente = document.createElement("td");
                    let tbTipo = document.createElement("td");
                    let tbEstado = document.createElement("td");
                    if (cargo == "analista") {
                        document
                            .querySelectorAll(".medicao")
                            .forEach(element => (element.style.display = ""));
                        let {
                            id_medicao,
                            tipo_categoria: tipoMedicao,
                            nome,
                            valor,
                            unidade,
                            data_medicao: dataMedicao,
                            estado,
                            fk_categoria_medicao: categoria
                        } = incidente;
                        let date = new Date(dataMedicao);
                        let [componente, tipo] = tipoMedicao.split("_");
                        let data = `${date.toLocaleDateString("pt-BR")}
                            ${date.toTimeString().slice(0, 8)}`;
                        let tbMedicao = document.createElement("td");
                        let tbOperacao = document.createElement("td");
                        let alertarBtnLbl = document.createElement("i");
                        let alertarBtn = document.createElement("button");
                        alertarBtnLbl.classList = "fas fa-bell";
                        alertarBtn.classList = "btn-nav-dash";
                        alertarBtn.title = "Alertar Responsável";
                        alertarBtn.appendChild(alertarBtnLbl);
                        alertarBtn.addEventListener("click", async e => {
                            axios
                                .post("/medicao/alertar-gestor", {
                                    id,
                                    id_medicao
                                })
                                .then(({data: {status, msg}}) => {
                                    if (status === "ok") {
                                        mostrarAlerta(msg, "success");
                                        setTimeout(
                                            () => window.location.reload(),
                                            4000
                                        );
                                    } else {
                                        console.error(msg);
                                    }
                                });
                        });
                        let chamadoBtnLbl = document.createElement("i");
                        let chamadoBtn = document.createElement("button");
                        chamadoBtnLbl.classList = "fas fa-exclamation";
                        chamadoBtn.classList = "btn-nav-dash-red";
                        chamadoBtn.title = "Abrir Chamado";
                        chamadoBtn.appendChild(chamadoBtnLbl);

                        tbNome.innerHTML = nome;
                        tbData.innerHTML = data;
                        tbComponente.innerHTML = componente.toUpperCase();
                        tbTipo.innerHTML =
                            tipo.charAt(0).toUpperCase() + tipo.slice(1);
                        tbMedicao.innerHTML = `${Number(
                            valor
                        )}${unidade.replace("┬░C", "°C")}`;
                        tbOperacao.appendChild(alertarBtn);
                        tbOperacao.appendChild(chamadoBtn);
                        tbEstado.innerHTML =
                            estado.charAt(0).toUpperCase() + estado.slice(1);
                        if (estado.toLowerCase() == "critico") {
                            tr.style.color = "red";
                        }
                        tr.appendChild(tbData);
                        tr.appendChild(tbNome);
                        tr.appendChild(tbComponente);
                        tr.appendChild(tbTipo);
                        tr.appendChild(tbEstado);
                        tr.appendChild(tbMedicao);
                        tr.appendChild(tbOperacao);
                        chamadoBtn.addEventListener("click", () => {
                            let trModal = tr;
                            trModal.removeChild(tbOperacao);
                            document.getElementById(
                                "modal-abrir-chamado"
                            ).style.display = "flex";
                            const tabela = document.querySelector(
                                ".modal-body .tabela-listrada table"
                            );
                            tabela.appendChild(trModal);

                            const btn = document.querySelector(".btn-geral");
                            const btnCancelar =
                                document.querySelector(".cancelar");

                            btnCancelar.addEventListener("click", () =>
                                window.location.reload()
                            );

                            btn.addEventListener("click", e => {
                                e.preventDefault();
                                if (
                                    titulo.value &&
                                    descricao.value &&
                                    prioridade.value
                                ) {
                                    axios
                                        .post("/chamado/criar", {
                                            titulo: titulo.value,
                                            desc: descricao.value,
                                            prioridade: prioridade.value,
                                            idCategoriaMedicao:
                                                Number(categoria),
                                            idUsuario: id,
                                            automatico: "n"
                                        })
                                        .then(
                                            ({
                                                data: {status, msg, continuar}
                                            }) => {
                                                if (status === "ok") {
                                                    mostrarAlerta(
                                                        "Chamado criado com sucesso",
                                                        "success"
                                                    );
                                                    setTimeout(
                                                        () =>
                                                            (window.location.href =
                                                                "chamados"),
                                                        3000
                                                    );
                                                } else if (
                                                    status === "alerta"
                                                ) {
                                                    mostrarAlerta(msg, "info");
                                                    if (continuar) {
                                                        setTimeout(() => {
                                                            document.getElementById(
                                                                "modal-reabrir-chamado"
                                                            ).style.display =
                                                                "flex";
                                                            const btnCriar =
                                                                document.getElementById(
                                                                    "btn-reabrir-chamado"
                                                                );
                                                            const btnCancelar =
                                                                document.querySelector(
                                                                    "#btn-cancelar-reabertura"
                                                                );
                                                            const eficacia =
                                                                document.querySelector(
                                                                    "#eficacia"
                                                                );
                                                            eficacia.addEventListener(
                                                                "change",
                                                                () => {
                                                                    if (
                                                                        eficacia.value
                                                                    ) {
                                                                        btnCriar.classList.remove(
                                                                            "cancelar"
                                                                        );
                                                                        btnCriar.disabled = false;
                                                                    } else {
                                                                        btnCriar.classList.add(
                                                                            "cancelar"
                                                                        );
                                                                        btnCriar.disabled = true;
                                                                    }
                                                                }
                                                            );

                                                            btnCancelar.addEventListener(
                                                                "click",
                                                                () =>
                                                                    window.location.reload()
                                                            );

                                                            btnCriar.addEventListener(
                                                                "click",
                                                                e => {
                                                                    e.preventDefault();
                                                                    if (
                                                                        !eficacia.value
                                                                    )
                                                                        return mostrarAlerta(
                                                                            "Especifique a eficacia da solução interior",
                                                                            "info"
                                                                        );
                                                                    axios
                                                                        .post(
                                                                            "/chamado/criar",
                                                                            {
                                                                                titulo: titulo.value,
                                                                                desc: descricao.value,
                                                                                prioridade:
                                                                                    prioridade.value,
                                                                                idCategoriaMedicao:
                                                                                    Number(
                                                                                        categoria
                                                                                    ),
                                                                                idUsuario:
                                                                                    id,
                                                                                automatico:
                                                                                    "n",
                                                                                eficaciaSolucoes:
                                                                                    eficacia.value
                                                                            }
                                                                        )
                                                                        .then(
                                                                            ({
                                                                                data: {
                                                                                    status,
                                                                                    msg,
                                                                                    continuar
                                                                                }
                                                                            }) => {
                                                                                if (
                                                                                    status ===
                                                                                    "ok"
                                                                                ) {
                                                                                    mostrarAlerta(
                                                                                        "Chamado criado com sucesso",
                                                                                        "success"
                                                                                    );
                                                                                    setTimeout(
                                                                                        () =>
                                                                                            (window.location.href =
                                                                                                "chamados"),
                                                                                        3000
                                                                                    );
                                                                                } else if (
                                                                                    status ===
                                                                                    "alerta"
                                                                                ) {
                                                                                    if (
                                                                                        continuar
                                                                                    ) {
                                                                                        console.error(
                                                                                            msg
                                                                                        );
                                                                                    } else {
                                                                                        mostrarAlerta(
                                                                                            msg,
                                                                                            "info"
                                                                                        );
                                                                                    }
                                                                                } else {
                                                                                    console.error(
                                                                                        msg
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                }
                                                            );
                                                        });
                                                    }
                                                } else {
                                                    console.error(msg);
                                                }
                                            }
                                        );
                                } else {
                                    mostrarAlerta(
                                        "Preencha todos os campos para continuar",
                                        "info"
                                    );
                                }
                            });
                        });
                    } else {
                        document
                            .querySelectorAll(".responsavel")
                            .forEach(element => (element.style.display = ""));
                        let {
                            tipo_categoria: tipoMedicao,
                            resp,
                            nome,
                            data_medicao: dataMedicao,
                            estado,
                            fk_categoria_medicao: categoria
                        } = incidente;
                        let date = new Date(dataMedicao);
                        let [componente, tipo] = tipoMedicao.split("_");
                        let data = `${date.toLocaleDateString("pt-BR")}
                            ${date.toTimeString().slice(0, 8)}`;
                        if (estado.toLowerCase() == "critico") {
                            let tbResp = document.createElement("td");
                            let tbOperacao = document.createElement("td");
                            tbNome.innerHTML = nome;
                            tbData.innerHTML = data;
                            tbComponente.innerHTML = componente.toUpperCase();
                            tbTipo.innerHTML =
                                tipo.charAt(0).toUpperCase() + tipo.slice(1);
                            tbResp.innerHTML = resp;
                            tbEstado.innerHTML =
                                estado.charAt(0).toUpperCase() +
                                estado.slice(1);
                            let chamadoBtnLbl = document.createElement("i");
                            let chamadoBtn = document.createElement("button");
                            chamadoBtnLbl.classList = "fas fa-exclamation";
                            chamadoBtn.classList = "btn-nav-dash-red";
                            chamadoBtn.title = "Abrir Chamado";
                            chamadoBtn.appendChild(chamadoBtnLbl);

                            tbOperacao.appendChild(chamadoBtn);
                            tr.appendChild(tbData);
                            tr.appendChild(tbResp);
                            tr.appendChild(tbNome);
                            tr.appendChild(tbComponente);
                            tr.appendChild(tbTipo);
                            tr.appendChild(tbEstado);
                            tr.appendChild(tbOperacao);
                            chamadoBtn.addEventListener("click", () => {
                                let trModal = tr;
                                trModal.removeChild(tbOperacao);
                                document.getElementById(
                                    "modal-abrir-chamado"
                                ).style.display = "flex";
                                const tabela = document.querySelector(
                                    ".modal-body .tabela-listrada table"
                                );
                                tabela.appendChild(trModal);

                                const btn =
                                    document.querySelector(".btn-geral");
                                const btnCancelar =
                                    document.querySelector(".cancelar");

                                btnCancelar.addEventListener("click", () =>
                                    window.location.reload()
                                );

                                btn.addEventListener("click", e => {
                                    e.preventDefault();
                                    if (
                                        titulo.value &&
                                        descricao.value &&
                                        prioridade.value
                                    ) {
                                        axios
                                            .post("/chamado/criar", {
                                                titulo: titulo.value,
                                                desc: descricao.value,
                                                prioridade: prioridade.value,
                                                idCategoriaMedicao:
                                                    Number(categoria),
                                                idUsuario: id,
                                                automatico: "n"
                                            })
                                            .then(
                                                ({
                                                    data: {
                                                        status,
                                                        msg,
                                                        continuar
                                                    }
                                                }) => {
                                                    if (status === "ok") {
                                                        mostrarAlerta(
                                                            "Chamado criado com sucesso",
                                                            "success"
                                                        );
                                                        setTimeout(
                                                            () =>
                                                                (window.location.href =
                                                                    "chamados"),
                                                            3000
                                                        );
                                                    } else if (
                                                        status === "alerta"
                                                    ) {
                                                        mostrarAlerta(
                                                            msg,
                                                            "info"
                                                        );
                                                        if (continuar) {
                                                            setTimeout(() => {
                                                                document.getElementById(
                                                                    "modal-reabrir-chamado"
                                                                ).style.display =
                                                                    "flex";
                                                                const btnCriar =
                                                                    document.getElementById(
                                                                        "btn-reabrir-chamado"
                                                                    );
                                                                const btnCancelar =
                                                                    document.querySelector(
                                                                        "#btn-cancelar-reabertura"
                                                                    );
                                                                const eficacia =
                                                                    document.querySelector(
                                                                        "#eficacia"
                                                                    );
                                                                eficacia.addEventListener(
                                                                    "change",
                                                                    () => {
                                                                        if (
                                                                            eficacia.value
                                                                        ) {
                                                                            btnCriar.classList.remove(
                                                                                "cancelar"
                                                                            );
                                                                            btnCriar.disabled = false;
                                                                        } else {
                                                                            btnCriar.classList.add(
                                                                                "cancelar"
                                                                            );
                                                                            btnCriar.disabled = true;
                                                                        }
                                                                    }
                                                                );

                                                                btnCancelar.addEventListener(
                                                                    "click",
                                                                    () =>
                                                                        window.location.reload()
                                                                );

                                                                btnCriar.addEventListener(
                                                                    "click",
                                                                    e => {
                                                                        e.preventDefault();
                                                                        if (
                                                                            !eficacia.value
                                                                        )
                                                                            return mostrarAlerta(
                                                                                "Especifique a eficacia da solução interior",
                                                                                "info"
                                                                            );
                                                                        axios
                                                                            .post(
                                                                                "/chamado/criar",
                                                                                {
                                                                                    titulo: titulo.value,
                                                                                    desc: descricao.value,
                                                                                    prioridade:
                                                                                        prioridade.value,
                                                                                    idCategoriaMedicao:
                                                                                        Number(
                                                                                            categoria
                                                                                        ),
                                                                                    idUsuario:
                                                                                        id,
                                                                                    automatico:
                                                                                        "n",
                                                                                    eficaciaSolucoes:
                                                                                        eficacia.value
                                                                                }
                                                                            )
                                                                            .then(
                                                                                ({
                                                                                    data: {
                                                                                        status,
                                                                                        msg,
                                                                                        continuar
                                                                                    }
                                                                                }) => {
                                                                                    if (
                                                                                        status ===
                                                                                        "ok"
                                                                                    ) {
                                                                                        mostrarAlerta(
                                                                                            "Chamado criado com sucesso",
                                                                                            "success"
                                                                                        );
                                                                                        setTimeout(
                                                                                            () =>
                                                                                                (window.location.href =
                                                                                                    "chamados"),
                                                                                            3000
                                                                                        );
                                                                                    } else if (
                                                                                        status ===
                                                                                        "alerta"
                                                                                    ) {
                                                                                        if (
                                                                                            continuar
                                                                                        ) {
                                                                                            console.error(
                                                                                                msg
                                                                                            );
                                                                                        } else {
                                                                                            mostrarAlerta(
                                                                                                msg,
                                                                                                "info"
                                                                                            );
                                                                                        }
                                                                                    } else {
                                                                                        console.error(
                                                                                            msg
                                                                                        );
                                                                                    }
                                                                                }
                                                                            );
                                                                    }
                                                                );
                                                            });
                                                        }
                                                    } else {
                                                        console.error(msg);
                                                    }
                                                }
                                            );
                                    } else {
                                        mostrarAlerta(
                                            "Preencha todos os campos para continuar",
                                            "info"
                                        );
                                    }
                                });
                            });
                        }
                    }
                    tabelaIncidentes.appendChild(tr);
                }
            }
        });
}
