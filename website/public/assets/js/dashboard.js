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
                        data.msg.forEach(componente => {
                            let divChart = document.createElement("div");
                            divChart.classList = "canvas-destaque";

                            //canvas
                            let canvasChart = document.createElement("canvas");
                            canvasChart.setAttribute("id", `${componente.tipo}${maq.pk_maquina}`);
                            divChart.appendChild(canvasChart);
                            
                            document.querySelector("#graficosDash").innerHTML += `<h2>${componente.tipo}</h2>`;
                            document.querySelector("#graficosDash").appendChild(divChart);
                            setTimeout(()=>{
                                mostrarGraficos(`${componente.tipo}${maq.pk_maquina}`);
                            },10);
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
