const idUser = JSON.parse(sessionStorage.getItem("usuario")).id;
const {nome, email} = JSON.parse(sessionStorage.getItem("usuario"));
const cargoPessoa = JSON.parse(sessionStorage.getItem("usuario")).cargo;
const maquinas = document.querySelector("#maquinas");

const data = {
    labels: [
        'Críticas',
        'Risco',
        'Normal'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [1,0,0],
        backgroundColor: [
            '#ff0000',
            '#ff8000',
            '#0071ce'
        ],
        hoverOffset: 4
    }]
};

const config = {
    type: 'doughnut',
    data: data,
};

const graficoMetricas = new Chart(
    document.getElementById('chartDoughnut'),
    config
);



    
    
const getTipo = tipo => {
    let metrica = tipo.split("_");
    metrica = `${metrica[0].toUpperCase()} - ${
        metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
    }`;
    return metrica;
};
    



metricas.addEventListener("change", () => {
    mostrarInfoMedicoes()
    mostrarInfoChamado()
    mostrarInfoTrendline()
});

const attMetricas = () => {
    console.log(metricas)
    metricas.innerHTML = "";
    if (maquinas.value) {
        axios.post("/maquina/lista-componentes", {
            id: maquinaInfo.pk_maquina
        }).then(({data: {status, msg}}) => {
                if (status === "ok") {
                    option = document.createElement("option");
                    option.innerText = "Todas";
                    option.value = "0";
                    metricas.appendChild(option);
                    msg.forEach(({id_categoria_medicao, tipo}) => {
                        option = document.createElement("option");
                        option.value = id_categoria_medicao;
                        option.setAttribute("id",`medicao${id_categoria_medicao}`)
                        option.innerText = getTipo(tipo);
                        metricas.appendChild(option);
                    });
                }
            });
    } else {
        metricas.disabled = true;
    }
}

const mostrarInfoMedicoes = () => {

    if(metricas.value == 0){
        axios.post("/medicao/stats", {
            maquina: maquinas.value,
            // idCategoriaMedicao: metricas.value  
            
        }).then(({data: {status, msg}}) => {
            if(status == "ok"){
                document.querySelector("#medicoesTotais").innerHTML = msg.medicoesTotais
                document.querySelector("#medicaoCritica").innerHTML = msg.medicoesCriticas
                document.querySelector("#medicaoRisco").innerHTML = msg.medicoesDeRisco
                document.querySelector("#medicaoNormal").innerHTML = msg.medicoesNormais

                let percCrit = (msg.medicoesCriticas*100/msg.medicoesTotais).toFixed(2);
                let percRisc = (msg.medicoesDeRisco*100/msg.medicoesTotais).toFixed(2);
                let percNorm = (msg.medicoesNormais*100/msg.medicoesTotais).toFixed(2);

                graficoMetricas.data.datasets[0].data = [percCrit, percRisc, percNorm]
                graficoMetricas.update()
            }else{
                console.log(status)
            }
        })
    }else{
        axios.post("/medicao/stats", {
            idCategoriaMedicao: metricas.value              
        }).then(({data: {status, msg}}) => {
            if(status == "ok"){
                document.querySelector("#medicoesTotais").innerHTML = msg.medicoesTotais
                document.querySelector("#medicaoCritica").innerHTML = msg.medicoesCriticas
                document.querySelector("#medicaoRisco").innerHTML = msg.medicoesDeRisco
                document.querySelector("#medicaoNormal").innerHTML = msg.medicoesNormais
    
                let percCrit = (msg.medicoesCriticas*100/msg.medicoesTotais).toFixed(2);
                let percRisc = (msg.medicoesDeRisco*100/msg.medicoesTotais).toFixed(2);
                let percNorm = (msg.medicoesNormais*100/msg.medicoesTotais).toFixed(2);
    
                graficoMetricas.data.datasets[0].data = [percCrit, percRisc, percNorm]
                graficoMetricas.update()
            }else{
                console.log(status)
            }
        })
    }

}


const mostrarInfoChamado = () => {
    axios.post("/chamado/stats", {
        maquina: maquinas.value
    }).then(({data: {status, msg}}) => {
        if(status == "ok"){
            document.querySelector("#totalChamados").innerHTML = msg.chamadosTotais
            document.querySelector("#chamadosAbertos").innerHTML = msg.chamadosAbertos
            document.querySelector("#chamadosFechados").innerHTML = msg.chamadosFechados
            
            document.querySelector("#totalSolucoes").innerHTML = msg.solucoesTotais
            document.querySelector("#eficaciaTotal").innerHTML = msg.solucoesEficazes
            document.querySelector("#eficaciaParcial").innerHTML = msg.solucoesParciais

        }else{
            console.log(status)
        }
    })
}


const mostrarInfoTrendline = () => {
    document.querySelector("#tableTrendline").innerHTML = "";
    if(metricas.value > 0){
        axios.post("/analytics/trend", {
            idCategoriaMedicao: metricas.value
        }).then(({data: {msg, status}}) => {
            console.log(status)
            console.log(msg)
            let tr = document.createElement("tr");
            let tdMetrica = document.createElement("td");
            let tdTendencia = document.createElement("td");
            tr.appendChild(tdMetrica);
            tr.appendChild(tdTendencia);

            tdMetrica.innerHTML = document.getElementById(`medicao${metricas.value}`).innerHTML;
            tdTendencia.innerHTML = `${msg.orientacao} ${msg.comportamento}`
            document.querySelector("#tableTrendline").appendChild(tr);
        });
    }else{
        axios.post("/maquina/lista-componentes", {
            id: Number(maquinas.value)
        }).then(({data: {status, msg}}) => {
                if (status == "ok") {
                    
                    msg.forEach(({id_categoria_medicao}) => {
                        let tr = document.createElement("tr");
                        let tdMetrica = document.createElement("td");
                        let tdTendencia = document.createElement("td");
                        tr.appendChild(tdMetrica);
                        tr.appendChild(tdTendencia);
            
                        tdMetrica.innerHTML = document.getElementById(`medicao${id_categoria_medicao}`).innerHTML;
                        

                        axios.post("/analytics/trend", {
                            idCategoriaMedicao: id_categoria_medicao
                        }).then(({data: {msg, status}}) => {
                            tdTendencia.innerHTML = `${msg.orientacao} ${msg.comportamento}`
                        });


                        document.querySelector("#tableTrendline").appendChild(tr);
                    });
                }
            });
    }
}

attMetricas()
mostrarInfoMedicoes()
mostrarInfoChamado()
mostrarInfoTrendline()