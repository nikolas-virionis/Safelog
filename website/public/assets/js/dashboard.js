axios.post("/maquina/lista-dependentes", {
    id: JSON.parse(sessionStorage.getItem("usuario"))?.id
}).then((response) => {
    let { status, res: dependentes } = response.data;
    if (status == "ok") {

        if (dependentes.length > 0) {
            let titulo = document.createElement("h2");
            if (dependentes.length == 1) {
                titulo.innerHTML = "Máquina";
            } else {
                titulo.innerHTML = "Máquinas";
            }
            contSite.prepend(titulo);
            contSite.prepend(document.createElement("br"));
        } else {
            mostrarAlerta("Nenhuma máquina foi encontrada", "warning");
        }
        dependentes.forEach(maq => {

            //input radio
            let inputMaq = document.createElement("input");
            inputMaq.setAttribute("type", "radio");
            inputMaq.setAttribute("id", maq.id_maquina);
            inputMaq.setAttribute("name", "forma-contato");
            

            //label
            let labelMaq = document.createElement("label");
            labelMaq.setAttribute("for", maq.id_maquina)
            labelMaq.classList = "card-maquina";

            //div1
            let divIcon = document.createElement("div");
            let iconMaq = document.createElement("i");
            iconMaq.classList = "fas fa-server";
            divIcon.appendChild(iconMaq);
            labelMaq.appendChild(divIcon);

            //div2
            let divName = document.createElement("div");
            let spanMaq = document.createElement("span");
            spanMaq.innerHTML = maq.nome;
            divName.appendChild(spanMaq);
            labelMaq.appendChild(divName);

            document.querySelector("#listaMaq").appendChild(inputMaq)
            document.querySelector("#listaMaq").appendChild(labelMaq)



            

            const resgatarComponentes = () => {
                axios.post("/maquina/lista-componentes", {
                    id: maq.pk_maquina
                }).then(({ data }) => {
                    if (data.status == "ok") {                        
                        axios.post("medicao/medicoes-componente", {
                            id: maq.pk_maquina
                        }).then((res) => {
                            console.log(res.data.msg.length);
                            let contadorComponente = 0;
                            data.msg.forEach(componente => {
                                let listaMedicao = [];
                                let listaDatas = [];

                                for(var i = res.data.msg[contadorComponente].length - 1; i >= 0 ; i--) {
                                    listaMedicao.push(res.data.msg[contadorComponente][i].valor);
                                    let data = res.data.msg[contadorComponente][i].data_medicao;
                                    listaDatas.push(data.slice(data.length - 13, data.length - 5));
                                };
                                


                                let divChart = document.createElement("div");
                                divChart.classList = "canvas-destaque";
    
                                //canvas
                                let canvasChart = document.createElement("canvas");
                                canvasChart.setAttribute("id", `${componente.tipo}${maq.pk_maquina}`);
                                divChart.appendChild(canvasChart);
                                
                                let tituloChart = document.createElement("h3")
                                tituloChart.innerHTML = componente.tipo;
    
                                document.querySelector("#graficosDash").appendChild(tituloChart);
                                document.querySelector("#graficosDash").appendChild(divChart);
    
                                setTimeout(()=>{
                                    console.log(listaDatas)
                                    aa(listaDatas)
                                    mostrarGraficos(`${componente.tipo}`,`${maq.pk_maquina}`, listaMedicao, listaDatas);
                                },10);
                                // console.log(res.data.msg[contador])
                                contadorComponente++;
                            });
                        }); 
                    } else {
                        mostrarAlerta("Ocorreu um erro ao resgatar os componentes dessa máquina", "danger");
                    }
                });
            }

            if (response.data.res[0].id_maquina == maq.id_maquina) {
                inputMaq.setAttribute("checked", "checked");
                resgatarComponentes();
            }

            labelMaq.addEventListener("click", (e) => {
                document.querySelector("#graficosDash").innerHTML = "";
                resgatarComponentes();
            });
            
            inputMaq.addEventListener("change", (e) => {
                document.querySelector("#graficosDash").innerHTML = "";
                // apagarGraficos();
            });
        });
    } else {
        mostrarAlerta("Ocorreu um erro", "danger");
    }
});


// setInterval(()=>{
//     axios.post("", {

//     }).then(() => {

//     });
// }, 3000);
const aa = (listaDatas) => {
    console.log(listaDatas)
}


const mostrarGraficos = (componente,idMaq,medicoes,listaDatas) => {
    var canvasChart = document.getElementById(`${componente}${idMaq}`).getContext('2d');
  
    var colors = ['#0071ce', '#0071ee', '#0fe1fe', '#ccbbcc', '#123445', '#654321', '#666666'];
    var color = Math.floor(Math.random() * colors.length)
    const chartData = {
      labels: listaDatas,
      datasets: [{
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
      type: 'line',
      data: chartData,
      options: {
        maintainAspectRatio: false
      }
    };
    
    var myChart = new Chart(canvasChart, chartConfig);
  }
  