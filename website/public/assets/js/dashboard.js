let {id, cargo} = JSON.parse(sessionStorage.getItem("usuario"));
let maq1,
    maquinaInfo,
    myChart,
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
    labels: [],
    datasets: []
};

const chartConfig1 = {
    type: "line",
    data: chartData,
    options: {
        maintainAspectRatio: false,
        scales: {
            y: {
                display: true,
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 7,
                    stepSize: 0.5
                }
            }
        }
    }
};

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
                mostrarAlerta("Nenhuma máquina foi encontrada", "danger");
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
        maquinaInfo = maq;
        maq1 = maq.id_maquina;
        // console.log(maquinaInfo);
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
        chartData.datasets = [];
        let iterator = 0;
        for (let {tipo, id_categoria_medicao} of mainTypes) {
            let metrica = tipo.split("_");
            metrica = `${metrica[0].toUpperCase()} - ${
                metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
            }`;
            chartData.datasets.push({
                label: metrica,
                data: [],
                fill: false,
                backgroundColor: colors[iterator],
                borderColor: colors[iterator],
                // fill: true,
                tension: 0.3
            });
            iterator++;
        }
        if (!myChart) myChart = new Chart(canvasChart1, chartConfig1);
        changeMachine(mainTypes);
        if (secTypes) secondaryTypes(secTypes);
    });

    inputMaq.addEventListener("change", e => {
        if (cargo == "gestor") {
            listaMetricasRelatorio();
            // console.log("inp maq change")
            mostrarCorrelacao();
            mostrarInfoMedicoes();
            mostrarInfoTrendline();
            mostrarInfoChamado();
            updateWordCloud();
        }
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
        mostrarInfoMedicoes();
        mostrarInfoChamado();
        reqData(types);
    }, 3000);
};

const reqData = types => {
    // console.log("types: ")
    // console.log(types)
    axios
        .post("/medicao/dados", {
            categorias: types,
            cargo
        })
        .then(({data: {status, msg}}) => {
            if (status == "ok") {
                // console.log(msg);
                for (let dados in msg) {
                    // console.log(dados);
                    if (msg[dados].nome == "cpu_porcentagem") {
                        updateChart(myChart, msg[dados].medicoes, dados);
                    } else if (msg[dados].nome == "ram_porcentagem") {
                        updateChart(myChart, msg[dados].medicoes, dados);
                    } else if (msg[dados].nome == "disco_porcentagem") {
                        updateChart(myChart, msg[dados].medicoes, dados);
                    }
                }
            } else {
                // console.log(msg);
            }
        });
};

const secondaryTypes = dados => {
    let dadosOrdenados = [];
    if (dados.length == 4) {
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
    } else {
        dadosOrdenados = [...dados];
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
                maintainAspectRatio: false,
                scales: {
                    y: {
                        display: true,
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 7,
                            stepSize: 0.5
                        }
                    }
                }
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
        3000
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
                // console.log(msg[0].medicoes[0]);
                // console.log(msg)
                if (msg[0].medicoes[0].tipo == "risco") {
                    document.querySelector(`[for="${maq1}"]`).classList =
                        "card-maquina warning";
                } else if (msg[0].medicoes[0].tipo == "critico") {
                    document.querySelector(`[for="${maq1}"]`).classList =
                        "card-maquina danger";
                } else {
                    document.querySelector(`[for="${maq1}"]`).classList =
                        "card-maquina";
                }
                // }
            } else {
                // console.log(msg.length);
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

const getTipo = tipo => {
    let metrica = tipo.split("_");
    metrica = `${metrica[0].toUpperCase()} - ${
        metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
    }`;
    return metrica;
};

// -------------------------------------------------------
// -------------------- Relatório --------------------
// -------------------------------------------------------

if (cargo == "gestor") {
    relatorio.classList.remove("display-none");
}

function updateWordCloud() {
    wordcloud.innerHTML = "";
    let processos = [
        "R",
        "Python",
        "chorme",
        "zoom",
        "opera.exe",
        "nodejs",
        "mysql",
        "discord",
        "VsCode",
        "Gerenciador de tarefas",
        "csrss.exe",
        "winlogon.exe",
        "NVIDIA Web Helper.exe",
        "Lenovo.Modern.ImControlle",
        "RuntimeBroker.exe",
        "Win32",
        "spotify",
        "TabNine.exe"
    ];
    let maq = [...listaMaq.children].filter(el => el.checked)[0]
        ?.nextElementSibling?.children?.[1]?.children?.[0]?.innerText;
    let data =
        JSON.parse(sessionStorage.getItem(`wordcloud${maq?.toLowerCase()}`)) ||
        [];
    if (!data[0]) {
        for (i in processos) {
            let max = (i + 1) * 100 - i * 45;
            let min = 50 - i * 2;
            let valor = Math.floor(Math.random() * (max - min) + min);
            let obj = {x: processos[i], value: valor};
            data.push(obj);
        }
        data = data.map((el, index) => ({
            x: processos[index],
            value: el.value
        }));
        sessionStorage.setItem(
            `wordcloud${maq?.toLowerCase()}`,
            JSON.stringify(data)
        );
    }

    // create a tag (word) cloud chart
    let chart = anychart.tagCloud(data);

    // set a chart title
    // chart.title('15 most spoken languages')
    // set an array of angles at which the words will be laid out
    chart.legend(false);
    // enable a color range
    // chart.colorRange(true);
    // set the color range length
    chart.colorRange().length("100%");
    chart.tooltip(false);
    chart.background(false);
    chart.angles([0]);
    // display the word cloud chart
    // chart.dataArea().background().enabled(false);
    if (wordcloud.innerHTML != "") wordcloud.innerHTML = "";
    chart.container("wordcloud");
    chart.draw();
}
//Wordcloud
anychart.onDocumentReady(updateWordCloud);
