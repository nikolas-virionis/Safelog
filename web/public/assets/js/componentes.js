const { id, id_empresa: empresa } = JSON.parse(
    sessionStorage.getItem("usuario")
);
let cpuPercentDef,
    cpuClockDef,
    cpuTempDef,
    ramPercentDef,
    ramFreeDef,
    discoPercentDef,
    discoFreeDef;
const tipos = [
    "cpuPercent",
    "cpuClock",
    "cpuTemp",
    "ramPercent",
    "ramFree",
    "discoPercent",
    "discoFree",
];
const urlParams = new URLSearchParams(window.location.search);
let maquina = urlParams.get("id_maquina").replace(/-/g, ":");

const btn = document.querySelector(".btn-geral");
axios
    .post("maquina/verificar-usuario", {
        id,
        maquina,
    })
    .then((response) => {
        if (response.data?.status == "ok" && !response.data.msg) {
            console.log("usuario não possui acesso");
            window.location.href = "dashboard.html";
        } else if (response.data?.status == "erro") {
            console.log("Erro na verificação do usuario");
        }
    });

mostrarAlerta("Selecione um ou mais componentes para o monitoramento", "info");

let qtdComponentes = 0;
let componentes = [];

checkCpu.addEventListener("click", (e) => {
    if (checkCpu.checked) {
        document.querySelector("#componentesCpu.lista-medicoes").style.display =
            "block";
    } else {
        document.querySelector("#componentesCpu.lista-medicoes").style.display =
            "none";
    }
});
checkMem.addEventListener("click", (e) => {
    if (checkMem.checked) {
        document.querySelector("#componentesMem.lista-medicoes").style.display =
            "block";
    } else {
        document.querySelector("#componentesMem.lista-medicoes").style.display =
            "none";
    }
});
checkDis.addEventListener("click", (e) => {
    if (checkDis.checked) {
        document.querySelector("#componentesDis.lista-medicoes").style.display =
            "block";
    } else {
        document.querySelector("#componentesDis.lista-medicoes").style.display =
            "none";
    }
});

for (let i = 1; i <= 7; i++) {
    document.querySelector(`#medicao${i}`).addEventListener("click", (e) => {
        esconderAlerta();
        if (document.querySelector(`#medicao${i}`).checked) {
            qtdComponentes++;
            componentes.push(document.querySelector(`#medicao${i}`).name);
            document.querySelector(`#limite${i}`).disabled = false;
            if (i == 3 || i == 5 || i == 7) {
                document.querySelector(`#limite${i}`).style.borderBottom =
                    "3px solid #0077ff";
            }
        } else {
            qtdComponentes--;
            let index = componentes.indexOf(
                document.querySelector(`#medicao${i}`).name
            );
            componentes.splice(index, 1);
            document.querySelector(`#limite${i}`).disabled = true;
            if (i == 3 || i == 5 || i == 7) {
                document.querySelector(`#limite${i}`).style.borderBottom =
                    "3px solid #cccccc";
            }
        }

        if (qtdComponentes == 0) {
            mostrarAlerta("Nenhum componente selecionado", "info");
            btn.classList.add("cancelar");
        } else {
            btn.classList.remove("cancelar");
        }
    });
    const updateLabel = (i) => {
        let valor = Number(document.querySelector(`#limite${i}`).value);
        if (document.querySelector(`#rangeValue${i}`)) {
            let index = componentes.indexOf(
                Number(document.querySelector(`#medicao${i}`).name)
            );
            document.querySelector(`#rangeValue${i}`).innerHTML = `${valor}%`;
        }
    };
    document
        .querySelector(`#limite${i}`)
        .addEventListener("mousemove", (e) => updateLabel(i));

    document.querySelector(`#limite${i}`).addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            updateLabel(i);
        }
    });
}

// verificando lista de componentes existentes na máquina
axios.post("/maquina/lista-componentes", { id: maquina }).then((result) => {
    let components = result.data.msg;

    for (let c of components) {
        // checking and displaying boxes
        if (c.tipo.includes("cpu") && !checkCpu.checked) {
            checkCpu.click();
        }
        if (c.tipo.includes("ram") && !checkMem.checked) {
            checkMem.click();
        }
        if (c.tipo.includes("disco") && !checkDis.checked) {
            checkDis.click();
        }

        let element = document.getElementsByName(c.tipo)[0];
        element.checked = true;
        let rand = document.querySelector(
            `#${element.id.replace("medicao", "limite")}`
        );
        rand.disabled = false;
        rand.value = Number(c.medicao_limite);

        // update labels values
        let valor = Number(
            document.querySelector(`#limite${element.id.slice(7)}`).value
        );
        if (document.querySelector(`#rangeValue${element.id.slice(7)}`)) {
            let index = componentes.indexOf(
                Number(
                    document.querySelector(`#medicao${element.id.slice(7)}`)
                        .name
                )
            );
            document.querySelector(
                `#rangeValue${element.id.slice(7)}`
            ).innerHTML = `${valor}%`;
        }
        componentes.push(c.tipo);
        qtdComponentes++;
    }
    for (let index in tipos) {
        window[`${tipos[index]}`] = document.querySelector(
            `#medicao${Number(index) + 1}`
        );
        window[`${tipos[index]}Lim`] = document.querySelector(
            `#limite${Number(index) + 1}`
        );
        eval(
            `${tipos[index]}Def = ${
                window[`${tipos[index]}`].checked
                    ? Number(window[`${tipos[index]}Lim`].value)
                    : 0
            }`
        );
    }
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!btn.classList.contains("cancelar")) {
        let categorias = [];
        for (let tipo of tipos) {
            let nome = `${tipo.split(/[A-Z]\S+/).shift()}_${
                tipo.endsWith("Percent")
                    ? "porcentagem"
                    : tipo.endsWith("Free")
                    ? "livre"
                    : tipo.endsWith("Temp")
                    ? "temperatura"
                    : "frequencia"
            }`;
            let componente = window[`${tipo}`];
            let limite = window[`${tipo}Lim`];
            if (!componente.checked && Number(eval(`${tipo}Def`)) != 0) {
                categorias.push({ nome, acao: "delete", limite: 0 });
            } else if (Number(limite.value) != Number(eval(`${tipo}Def`))) {
                if (Number(eval(`${tipo}Def`)) == 0 && componente.checked) {
                    categorias.push({
                        nome,
                        acao: "insert",
                        limite: Number(limite.value),
                    });
                } else if (componente.checked) {
                    categorias.push({
                        nome,
                        acao: "update",
                        limite: Number(limite.value),
                    });
                }
            }
        }
        axios
            .post("/maquina/componentes", {
                id: maquina,
                componentes: categorias,
            })
            .then((response) => {
                console.log(response);
                if (response.data?.status == "ok") {
                    mostrarAlerta(
                        "Componentes atualizados com sucesso",
                        "success"
                    );
                    window.location.href = "dependentes.html";
                } else {
                    mostrarAlerta(
                        "Erro na atualização dos componentes",
                        "danger"
                    );
                    console.log(response.data);
                }
            });
    }
});
