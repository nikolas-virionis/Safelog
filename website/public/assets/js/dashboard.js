let {id, cargo} = JSON.parse(sessionStorage.getItem("usuario"));
let maq1,
    nMaq = 0;

let canvasChart1 = document.getElementById(`idChart1`);

let colors = [
    "#0071ce",
    "#F8481C",
    "#FDB147",
    "#730039",
    "#343837",
    "#32BF84",
    "#6D5ACF"
];
colors = colors.sort(() => Math.random() - 0.5);
const chartData = {
    labels: [
        1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1, 1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1, 1, 2,
        3, 4, 3, 6, 3, 6, 4, 2, 1
    ],
    datasets: [
        {
            label: "",
            data: [
                1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1, 1, 2, 3, 4, 3, 6, 3, 6, 4, 2,
                1, 1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1
            ],
            fill: false,
            backgroundColor: colors[0],
            borderColor: colors[0],
            // fill: true,
            tension: 0.3
        },
        {
            label: "componente",
            data: [
                10, 23, 35, 74, 93, 60, 32, 64, 47, 21, 11, 10, 23, 35, 74, 93,
                60, 32, 64, 47, 21, 11, 10, 23, 35, 74, 93, 60, 32, 64, 47, 21,
                11
            ],
            fill: false,
            backgroundColor: colors[1],
            borderColor: colors[1],
            // fill: true,
            tension: 0.3
        },
        {
            label: "componente",
            data: [
                50, 30, 80, 80, 58, 69, 30, 60, 40, 20, 10, 50, 30, 80, 80, 58,
                69, 30, 60, 40, 20, 10, 50, 30, 80, 80, 58, 69, 30, 60, 40, 20,
                10
            ],
            fill: false,
            backgroundColor: colors[2],
            borderColor: colors[2],
            // fill: true,
            // showLine: false,
            tension: 0.3
        }
    ]
};

const chartConfig1 = {
    type: "line",
    data: chartData,
    options: {
        maintainAspectRatio: false
    }
};
const myChart = new Chart(canvasChart1, chartConfig1);

axios
    .post(`/maquina/lista-dependentes/${cargo}`, {
        id
    })
    .then(({data: {status, msg: dependentes}}) => {
        if (status == "ok") {
            if (dependentes.length) {
                let titulo = document.createElement("h2");
                titulo.innerHTML = "Máquinas";
                contSite.prepend(titulo);
                contSite.prepend(document.createElement("br"));
            } else {
                mostrarAlerta("Nenhuma máquina foi encontrada", "info");
            }

            dependentes.forEach(maq => {
                gerarCardMaquina(maq);
                // resgatarComponentes(maq);
            });
            let maquina = sessionStorage.getItem("maquina") ?? 0;
            document.querySelectorAll(".card-maquina")?.[maquina].click();
        } else {
            mostrarAlerta("Ocorreu um erro", "danger");
        }
    });

const gerarCardMaquina = maq => {
    //input radio
    let inputMaq = document.createElement("input");
    inputMaq.setAttribute("type", "radio");
    inputMaq.setAttribute("id", maq.id_maquina);
    inputMaq.setAttribute("name", "forma-contato");

    //label
    let labelMaq = document.createElement("label");
    labelMaq.setAttribute("for", maq.id_maquina);
    labelMaq.classList = "card-maquina";

    //div1
    let divIcon = document.createElement("div");
    let iconMaq = document.createElement("i");
    iconMaq.classList = "fas fa-server";
    divIcon.appendChild(iconMaq);
    labelMaq.appendChild(divIcon);
    labelMaq.maq = nMaq;

    //div2
    let divName = document.createElement("div");
    let spanMaq = document.createElement("span");
    spanMaq.innerHTML = maq.maquina;
    divName.appendChild(spanMaq);
    labelMaq.appendChild(divName);

    document.querySelector("#listaMaq").appendChild(inputMaq);
    document.querySelector("#listaMaq").appendChild(labelMaq);

    labelMaq.addEventListener("click", async e => {
        sessionStorage.setItem("maquina", labelMaq.maq);
        if (window.interval) {
            clearInterval(window.interval);
        }
        if (window.intervalSec1) {
            clearInterval(window.intervalSec1);
        }
        if (window.intervalSec2) {
            clearInterval(window.intervalSec2);
        }
        if (window.intervalSec3) {
            clearInterval(window.intervalSec3);
        }
        if (window.intervalSec4) {
            clearInterval(window.intervalSec4);
        }
        let {pk_maquina: maquina} = maq;
        document.querySelector("#graficosDash").innerHTML = "";
        // resgatarComponentes(maq);
        let componentes = await getComponentes(maquina);
        mainTypes = [];
        secTypes = [];
        componentes.forEach(({tipo, id_categoria_medicao}) => {
            if (
                tipo == "cpu_porcentagem" ||
                tipo == "ram_porcentagem" ||
                tipo == "disco_porcentagem"
            ) {
                mainTypes.push({
                    id_categoria_medicao,
                    tipo
                });
            } else {
                secTypes.push({
                    id_categoria_medicao,
                    tipo
                });
            }
        });
        // console.log(mainTypes);
        changeMachine(mainTypes);
        if (secTypes) secondaryTypes(secTypes);
    });

    inputMaq.addEventListener("change", e => {
        document.querySelector("#graficosDash").innerHTML = "";
        // apagarGraficos();
    });
    nMaq++;
};

const getComponentes = maq => {
    return axios
        .post("/maquina/lista-componentes", {
            id: maq
        })
        .then(({data: {status, msg}}) => {
            if (status === "ok") {
                return msg;
            }
        })
        .catch(err => console.error(err));
};

// update main chart
const changeMachine = types => {
    reqData(types);
    window.interval = setInterval(() => {
        reqData(types);
    }, 1000);
};

const reqData = types => {
    axios
        .post("/medicao/dados", {
            categorias: types,
            cargo
        })
        .then(response => {
            if (response.data.status == "ok") {
                // console.log(response.data.msg);
                for (let dados of response.data.msg) {
                    // console.log(dados);
                    if (dados.nome == "cpu_porcentagem") {
                        updateChart(myChart, dados.medicoes, 0);
                        myChart.data.datasets[0].label = "CPU - Uso";
                    } else if (dados.nome == "ram_porcentagem") {
                        updateChart(myChart, dados.medicoes, 1);
                        myChart.data.datasets[1].label = "RAM - Uso";
                    } else if (dados.nome == "disco_porcentagem") {
                        updateChart(myChart, dados.medicoes, 2);
                        myChart.data.datasets[2].label = "DISCO - Uso";
                    }
                }
            } else {
                console.log(response.data.msg);
            }
        });
};

const secondaryTypes = dados => {
    let dadosOrdenados = [];
    let i = 0;
    while (i < dados.length) {
        for (let dado of dados) {
            if (i == 0 && dado.tipo.endsWith("livre")) {
                dadosOrdenados.push(dado);
                i++;
            } else if (i == 1 && dado.tipo.endsWith("livre")) {
                dadosOrdenados.push(dado);
                i++;
            } else if (i == 2 && dado.tipo.endsWith("frequencia")) {
                dadosOrdenados.push(dado);
                i++;
            } else if (i == 3 && dado.tipo.endsWith("temperatura")) {
                dadosOrdenados.push(dado);
                i++;
            }
        }
    }
    // console.log(dadosOrdenados);
    secondaryCharts(dadosOrdenados);
};

const secondaryCharts = types => {
    let idChart = 2;
    let graficos = document.querySelector("#graficosDash");
    for (let {id_categoria_medicao, tipo} of types) {
        let metrica = tipo.split("_");
        metrica = `${metrica[0].toUpperCase()} - ${
            metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
        }`;
        let canvas = document.createElement("canvas");
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        let div3 = document.createElement("div");
        let titulo = document.createElement("h2");
        div1.classList = "col-md-6 col-sm-12";
        div2.classList = "graphContainer";
        canvas.id = `idChart${idChart}`;
        titulo.classList = "centralizar";
        titulo.innerText = metrica;
        div3.appendChild(canvas);
        div2.appendChild(titulo);
        div2.appendChild(div3);
        div1.appendChild(div2);
        // canvas = canvas.getContext("2d");
        graficos.appendChild(div1);

        const chartData = {
            labels: [1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1],
            datasets: [
                {
                    label: metrica,
                    data: [1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1],
                    fill: false,
                    backgroundColor: colors[idChart + 1],
                    borderColor: colors[idChart + 1],
                    // fill: true,
                    tension: 0.3
                }
            ]
        };

        const chartConfig = {
            type: "line",
            data: chartData,
            options: {
                maintainAspectRatio: false
            }
        };
        let chart = new Chart(canvas, chartConfig);
        changeMachineSec([{id_categoria_medicao, tipo}], chart, idChart - 1);
        idChart++;
    }
};

const changeMachineSec = (types, chart, num) => {
    reqDataSec(types, chart);
    window[`intervalSec${num}`] = setInterval(
        () => reqDataSec(types, chart),
        1000
    );
};

const reqDataSec = (types, chart) => {
    axios
        .post("/medicao/dados", {
            categorias: types,
            cargo: "analista"
        })
        .then(({data: {status, msg}}) => {
            if (status == "ok") {
                // for (let dados of msg) {
                updateChart(chart, msg[0].medicoes);
                // }
            } else {
                console.log(msg);
            }
        });
};
function updateChart(chart, dados, index = 0) {
    const data = [];
    const labels = [];
    for (let {valor, data_medicao} of dados) {
        data.push(Number(valor));
        labels.push(
            new Date(data_medicao)
                .toLocaleTimeString("pt-BR", {
                    timeZone: "UTC",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false
                })
                .slice(0, 8)
        );
    }
    chart.data.datasets[index].data = data.reverse();
    chart.data.labels = labels.reverse();
    chart.update();
}
