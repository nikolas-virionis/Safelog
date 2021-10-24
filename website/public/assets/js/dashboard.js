let {id, cargo} = JSON.parse(sessionStorage.getItem("usuario"));
let maq1,
    nMaq = 0;
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
                mostrarAlerta("Nenhuma máquina foi encontrada", "warning");
            }

            dependentes.forEach(maq => {
                gerarCardMaquina(maq);
                // resgatarComponentes(maq);
            });
            let maquina = sessionStorage.getItem("maquina") ?? 0;
            document.querySelectorAll(".card-maquina")[maquina].click();

            // document.getElementById(`${response.data.res[0].id_maquina}`).setAttribute("checked", "checked");
        } else {
            mostrarAlerta("Ocorreu um erro", "danger");
        }
    });
// axios
//     .post("/maquina/lista-dependentes/gestor", {
//         id: JSON.parse(sessionStorage.getItem("usuario"))?.id
//     })
//     .then(res => {
//         let msg = res.data.res;
//         if (res.data.status == "ok") {
//             if (msg.length > 0) {
//                 let titulo = document.createElement("h2");
//                 if (msg.length == 1) {
//                     titulo.innerHTML = "Máquina";
//                 } else {
//                     titulo.innerHTML = "Máquinas";
//                 }
//                 contSite.prepend(titulo);
//                 contSite.prepend(document.createElement("br"));

//                 msg.forEach(maq => {
//                     gerarCardMaquina(maq);
//                     // document.getElementById(`${res.data.res[0].id_maquina}`).setAttribute("checked", "checked");
//                     resgatarComponentes(maq);
//                     if (res.data.res[0].pk_maquina == maq.pk_maquina) {
//                         document
//                             .getElementById(`${res.data.res[0].id_maquina}`)
//                             .setAttribute("checked", "checked");
//                         resgatarComponentes(maq);
//                     }
//                 });
//                 resgatarComponentes();
//             } else {
//                 mostrarAlerta("Nenhuma máquina foi encontrada", "warning");
//             }
//         }
//     });
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
        let {pk_maquina: maquina} = maq;
        document.querySelector("#graficosDash").innerHTML = "";
        // resgatarComponentes(maq);
        let componentes = await getComponentes(maquina);
        mainTypes = [];
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
            }
        });
        console.log(mainTypes);
        changeMachine(mainTypes);
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

const resgatarComponentes = maq => {
    // console.log(maq)
    axios
        .post("/maquina/lista-componentes", {
            id: maq.pk_maquina
        })
        .then(({data}) => {
            if (data.status == "ok") {
                axios
                    .post("/medicao/medicoes-componente", {
                        id: maq.pk_maquina
                    })
                    .then(res => {
                        // console.log(res.data.msg.length);
                        let contadorComponente = 0;
                        data.msg.forEach(componente => {
                            let listaMedicao = [];
                            let listaDatas = [];

                            for (
                                var i =
                                    res.data.msg[contadorComponente].length - 1;
                                i >= 0;
                                i--
                            ) {
                                listaMedicao.push(
                                    res.data.msg[contadorComponente][i].valor
                                );
                                let data =
                                    res.data.msg[contadorComponente][i]
                                        .data_medicao;
                                listaDatas.push(
                                    data.slice(
                                        data.length - 13,
                                        data.length - 5
                                    )
                                );
                            }

                            let divChart = document.createElement("div");
                            divChart.classList = "canvas-destaque";

                            //canvas
                            let canvasChart = document.createElement("canvas");
                            canvasChart.setAttribute(
                                "id",
                                `${componente.tipo}${maq.pk_maquina}`
                            );
                            divChart.appendChild(canvasChart);

                            let tituloChart = document.createElement("h3");
                            tituloChart.innerHTML = componente.tipo;

                            document
                                .querySelector("#graficosDash")
                                .appendChild(tituloChart);
                            document
                                .querySelector("#graficosDash")
                                .appendChild(divChart);

                            setTimeout(() => {
                                // console.log(listaDatas)
                                mostrarGraficos(
                                    `${componente.tipo}`,
                                    `${maq.pk_maquina}`,
                                    listaMedicao,
                                    listaDatas
                                );
                            }, 10);
                            // console.log(res.data.msg[contador])
                            contadorComponente++;
                        });
                    });
            } else {
                mostrarAlerta(
                    "Ocorreu um erro ao resgatar os componentes dessa máquina",
                    "danger"
                );
            }
        });
};

const mostrarGraficos = (componente, idMaq, medicoes, listaDatas) => {
    var canvasChart = document
        .getElementById(`${componente}${idMaq}`)
        .getContext("2d");

    var colors = [
        "#0071ce",
        "#0071ee",
        "#0fe1fe",
        "#ccbbcc",
        "#123445",
        "#654321",
        "#666666"
    ];
    var color = Math.floor(Math.random() * colors.length);
    const chartData = {
        labels: listaDatas,
        datasets: [
            {
                label: componente,
                data: medicoes,
                fill: false,
                backgroundColor: colors[color],
                borderColor: colors[color],
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
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    };

    var myChart = new Chart(canvasChart, chartConfig);
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
            cargo: "analista"
        })
        .then(response => {
            if (response.data.status == "ok") {
                // console.log(response.data.msg)
                for (let dados of response.data.msg) {
                    // console.log(dados);
                    if (dados.nome == "cpu_porcentagem") {
                        updateChart(myChart, dados.medicoes, 0);
                    } else if (dados.nome == "ram_porcentagem") {
                        updateChart(myChart, dados.medicoes, 1);
                    } else if (dados.nome == "disco_porcentagem") {
                        updateChart(myChart, dados.medicoes, 2);
                    }
                }
            } else {
                console.log(response.data.msg);
            }
        });
};

function updateChart(chart, dados, index) {
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
