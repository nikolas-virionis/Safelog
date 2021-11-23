const {id, nome, email} = JSON.parse(sessionStorage.getItem("usuario"));
const cargoPessoa = JSON.parse(sessionStorage.getItem("usuario")).cargo;
const maquinas = document.querySelector("#maquinas");

axios.post(`/maquina/lista-dependentes/${cargoPessoa}`, {
    id
    }).then(({data: {status, msg}}) => {
        if (status == "ok") {
            msg.forEach(({pk_maquina, maquina}) => {
                option = document.createElement("option");
                option.value = pk_maquina;
                option.innerText = maquina;
                maquinas.appendChild(option);
            });
        } else {
            console.error(msg);
        }
        attMetricas()
        
});
    
    
    const getTipo = tipo => {
        let metrica = tipo.split("_");
        metrica = `${metrica[0].toUpperCase()} - ${
            metrica[1].charAt(0).toUpperCase() + metrica[1].slice(1)
        }`;
        return metrica;
    };
    
maquinas.addEventListener("change", () => {

        attMetricas()
})

const attMetricas = () => {
    metricas.innerHTML = "";
    if (maquinas.value) {
        axios.post("/maquina/lista-componentes", {
            id: Number(maquinas.value)
        }).then(({data: {status, msg}}) => {
                if (status === "ok") {
                    option = document.createElement("option");
                    option.innerText = "Todas";
                    option.value = "0";
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
}


const data = {
        labels: [
            'Críticas',
            'Risco',
            'Normal'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [46, 100, 200],
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
    
    const myChart = new Chart(
        document.getElementById('chartDoughnut'),
        config
    );