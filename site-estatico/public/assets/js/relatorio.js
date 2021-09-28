let { id } = JSON.parse(sessionStorage.getItem("usuario"));
let tabelaIncidentes = document.querySelector(".tabela-listrada table");
axios
    .post("medicao/relatorio-incidentes", {
        id,
    })
    .then((response) => {
        if (response.data?.status == "ok") {
            let { status, response: maquinasIncidentes } = response.data;
            let contagem = 0;
            for(let i = 0; i < maquinasIncidentes.length; i++){
                contagem += maquinasIncidentes[i].maquinas.length;
            }
            if(contagem > 0){
                for (let {
                    maquinas,
                    limite_cpu,
                    limite_ram,
                    limite_disco,
                } of maquinasIncidentes) {
                    for (let maquina of maquinas) {
                        Object.entries(maquina).forEach(([key, value]) => {
                            if (
                                key != "data_medicao" &&
                                key != "nome" &&
                                Number(value) >= eval(`limite_${key}`)
                            ) {
                                let tr = document.createElement("tr");
                                let date = new Date(maquina.data_medicao);
                                let data = `${date.toLocaleDateString("pt-BR")}
                                ${date.toTimeString().slice(0, 8)}`;
                                let tbData = document.createElement("td");
                                let tbNome = document.createElement("td");
                                let tbComponente = document.createElement("td");
                                let tbEstado = document.createElement("td");
                                let tbMedicao = document.createElement("td");
                                let tbOperacao = document.createElement("td");
                                let alertarBtnLbl = document.createElement("i");
                                let alertarBtn = document.createElement("button");
                                alertarBtnLbl.classList = "fas fa-bell";
                                alertarBtn.classList = "btn-nav-dash";
                                alertarBtn.title = "Alertar Responsável";
                                alertarBtn.appendChild(alertarBtnLbl);
                                tbNome.innerHTML = maquina.nome;
                                tbData.innerHTML = data;
                                tbComponente.innerHTML = key.toUpperCase();
                                tbMedicao.innerHTML = `${Number(value).toFixed(
                                    2
                                )}%`;
                                tbOperacao.appendChild(alertarBtn);
                                if (
                                    Number(value) >=
                                    eval(`limite_${key}`) * 0.6 + 38
                                ) {
                                    tbEstado.innerHTML = "Critico";
                                    tr.style.color = "red";
                                } else tbEstado.innerHTML = "Risco";
                                tr.appendChild(tbData);
                                tr.appendChild(tbNome);
                                tr.appendChild(tbComponente);
                                tr.appendChild(tbEstado);
                                tr.appendChild(tbMedicao);
                                tr.appendChild(tbOperacao);
                                tabelaIncidentes.appendChild(tr);
                            }
                        });
                    }
                }
            }else{
                mostrarAlerta("Ainda não há nenhum registro", "info");
            }
        } else {
            console.error(response.data.msg);
        }
    });
