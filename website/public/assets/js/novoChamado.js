const {id, nome, email, cargo} = JSON.parse(sessionStorage.getItem("usuario"));
const titulo = document.querySelector("#titulo");
const descricao = document.querySelector("#descricao");
const maquinas = document.querySelector("#maquinas");
const metricas = document.querySelector("#metricas");
const prioridade = document.querySelector("#prioridade");
const btn = document.querySelector(".btn-geral");

titulo.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        descricao.focus();
    }
});
descricao.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        e.preventDefault();
        maquinas.focus();
    }
});

axios
    .post(`/maquina/lista-dependentes/${cargo}`, {
        id
    })
    .then(({data: {status, msg}}) => {
        if (status == "ok") {
            option = document.createElement("option");
            option.innerText = "Escolha uma máquina";
            option.value = "";
            maquinas.appendChild(option);
            msg.forEach(({pk_maquina, maquina}) => {
                option = document.createElement("option");
                option.value = pk_maquina;
                option.innerText = maquina;
                maquinas.appendChild(option);
            });
        } else {
            console.error(msg);
        }
    });

maquinas.addEventListener("change", e => {
    metricas.innerHTML = "";
    if (maquinas.value) {
        metricas.disabled = false;
        axios
            .post("/maquina/lista-componentes", {id: Number(maquinas.value)})
            .then(({data: {status, msg}}) => {
                if (status === "ok") {
                    option = document.createElement("option");
                    option.innerText = "Escolha uma métrica";
                    option.value = "";
                    metricas.appendChild(option);
                    msg.forEach(({id_categoria_medicao, tipo}) => {
                        option = document.createElement("option");
                        option.value = id_categoria_medicao;
                        option.innerText = getTipo(tipo);
                        metricas.appendChild(option);
                    });
                }
            });
    } else {
        metricas.disabled = true;
    }
});

metricas.addEventListener("change", e => {
    if (metricas.value) {
        prioridade.disabled = false;
    } else {
        prioridade.disabled = true;
    }
});

const getTipo = tipo => {
    let metrica = tipo.split("_");
    metrica = `${metrica[0].toUpperCase()} - ${
        metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
    }`;
    return metrica;
};

btn.addEventListener("click", e => {
    e.preventDefault();
    if (
        titulo.value &&
        descricao.value &&
        !prioridade.disabled &&
        prioridade.value
    ) {
        axios
            .post("/chamado/criar", {
                titulo: titulo.value,
                desc: descricao.value,
                prioridade: prioridade.value,
                idCategoriaMedicao: Number(metricas.value),
                idUsuario: id
            })
            .then(({data: {status, msg, continuar}}) => {
                if (status === "ok") {
                    mostrarAlerta("Chamado criado com sucesso", "success");
                    setTimeout(() => (window.location.href = "chamados"), 3000);
                } else if (status === "alerta") {
                    mostrarAlerta(msg, "info");
                    if (continuar) {
                        setTimeout(() => {
                            document.getElementById(
                                "modal-reabrir-chamado"
                            ).style.display = "flex";
                            const btnCriar = document.getElementById(
                                "btn-prosseguir-modal"
                            );
                            const btnCancelar =
                                document.querySelector(".cancelar");
                            const eficacia =
                                document.querySelector("#eficacia");
                            eficacia.addEventListener("change", () => {
                                if (eficacia.value) {
                                    btnCriar.classList.remove("cancelar");
                                    btnCriar.disabled = false;
                                } else {
                                    btnCriar.classList.add("cancelar");
                                    btnCriar.disabled = true;
                                }
                            });

                            btnCancelar.addEventListener("click", e => {
                                e.preventDefault();
                                import("./modal.js").then(({fecharModal}) =>
                                    fecharModal("modal-verify-token")
                                );
                            });

                            btnCriar.addEventListener("click", e => {
                                e.preventDefault();
                                if (!eficacia.value)
                                    return mostrarAlerta(
                                        "Especifique a eficacia da solução interior",
                                        "info"
                                    );
                                axios
                                    .post("/chamado/criar", {
                                        titulo: titulo.value,
                                        desc: descricao.value,
                                        prioridade: prioridade.value,
                                        idCategoriaMedicao: Number(
                                            metricas.value
                                        ),
                                        idUsuario: id,
                                        eficaciaSolucoes: eficacia.value
                                    })
                                    .then(
                                        ({data: {status, msg, continuar}}) => {
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
                                            } else if (status === "alerta") {
                                                if (continuar) {
                                                    console.error(msg);
                                                } else {
                                                    mostrarAlerta(msg, "info");
                                                }
                                            } else {
                                                console.error(msg);
                                            }
                                        }
                                    );
                            });
                        });
                    }
                } else {
                    console.error(msg);
                }
            });
    } else {
        mostrarAlerta("Preencha todos os campos para continuar", "info");
    }
});
