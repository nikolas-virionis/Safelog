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
                    setTimeout(() => (window.location.href = "chamados"), 4000);
                } else if (status === "alerta") {
                    mostrarAlerta(msg, "info");
                    if (continuar) {
                        // mostrar modal
                        // modal deve conter um select de eficacia da solução para o
                        // ultimo chamado aberto para aquela metrica
                    }
                } else {
                    console.error(msg);
                }
            });
    } else {
        mostrarAlerta("Preencha todos os campos para continuar", "info");
    }
});
