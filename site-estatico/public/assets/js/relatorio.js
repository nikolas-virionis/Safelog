let { id } = JSON.parse(sessionStorage.getItem("usuario"));
let tabelaIncidentes = document.querySelector(".tabela-listrada table");
axios
    .post("medicao/relatorio-incidentes", {
        id,
    })
    .then((response) => {
        if (response.data?.status == "ok") {
            let { status, response: maquinas } = response.data;
            // let contagem = 0;
            // for (let i of maquinas) {
            //     contagem += i.maquinas.length;
            // }
            if (maquinas.length > 0 && maquinas[0].length > 0) {
                for (let maquina of maquinas) {
                    for (let incidente of maquina) {
                        let {
                            tipo: tipoMedicao,
                            nome,
                            valor,
                            unidade,
                            data_medicao: dataMedicao,
                            medicao_limite: limite,
                        } = incidente;
                        let [componente, tipo] = tipoMedicao.split("_");
                        let tr = document.createElement("tr");
                        let date = new Date(dataMedicao);
                        let data = `${date.toLocaleDateString("pt-BR")}
                                ${date.toTimeString().slice(0, 8)}`;
                        let tbData = document.createElement("td");
                        let tbNome = document.createElement("td");
                        let tbComponente = document.createElement("td");
                        let tbTipo = document.createElement("td");
                        let tbEstado = document.createElement("td");
                        let tbMedicao = document.createElement("td");
                        let tbOperacao = document.createElement("td");
                        let alertarBtnLbl = document.createElement("i");
                        let alertarBtn = document.createElement("button");
                        alertarBtnLbl.classList = "fas fa-bell";
                        alertarBtn.classList = "btn-nav-dash";
                        alertarBtn.title = "Alertar Responsável";
                        alertarBtn.appendChild(alertarBtnLbl);
                        tbNome.innerHTML = nome;
                        tbData.innerHTML = data;
                        tbComponente.innerHTML = componente.toUpperCase();
                        tbTipo.innerHTML =
                            tipo.charAt(0).toUpperCase() + tipo.slice(1);
                        tbMedicao.innerHTML = `${Number(
                            valor
                        )}${unidade.replace("┬░C", "°C")}`;
                        tbOperacao.appendChild(alertarBtn);
                        // x * 0.6 + 38 => %
                        // 0.65x + 28.5 => °C
                        // 0.409x + 0.08 => ram livre
                        // 0.26x + 21 => disco livre
                        // 0.8x + 33.5 => cpu Mhz (%
                        if (
                            (tipo.toLowerCase() == "porcentagem" &&
                                Number(valor) >= Number(limite) * 0.6 + 38) ||
                            (tipo.toLowerCase() == "temperatura" &&
                                Number(valor) >= Number(limite) * 0.65 + 28) ||
                            (tipo.toLowerCase() == "livre" &&
                                componente.toLowerCase() == "ram" &&
                                Number(valor) <=
                                    Number(limite) * 0.409 + 0.08) ||
                            (tipo.toLowerCase() == "livre" &&
                                componente.toLowerCase() == "disco" &&
                                Number(valor) <= Number(limite) * 0.26 + 21) ||
                            (tipo.toLowerCase() == "frequencia" &&
                                Number(valor) >= Number(limite) * 0.8 + 33.5)
                        ) {
                            tbEstado.innerHTML = "Critico";
                            tr.style.color = "red";
                        } else {
                            tbEstado.innerHTML = "Risco";
                        }
                        tr.appendChild(tbData);
                        tr.appendChild(tbNome);
                        tr.appendChild(tbComponente);
                        tr.appendChild(tbTipo);
                        tr.appendChild(tbEstado);
                        tr.appendChild(tbMedicao);
                        tr.appendChild(tbOperacao);
                        tabelaIncidentes.appendChild(tr);

                        // Object.entries(maquina).forEach(([key, value]) => {
                        //     if (
                        //         key != "data_medicao" &&
                        //         key != "nome" &&
                        //         Number(value) >= eval(`limite_${key}`)
                        //     ) {
                        //         let tr = document.createElement("tr");
                        //         let date = new Date(maquina.data_medicao);
                        //         let data = `${date.toLocaleDateString("pt-BR")}
                        //         ${date.toTimeString().slice(0, 8)}`;
                        //         let tbData = document.createElement("td");
                        //         let tbNome = document.createElement("td");
                        //         let tbComponente = document.createElement("td");
                        //         let tbEstado = document.createElement("td");
                        //         let tbMedicao = document.createElement("td");
                        //         let tbOperacao = document.createElement("td");
                        //         let alertarBtnLbl = document.createElement("i");
                        //         let alertarBtn =
                        //             document.createElement("button");
                        //         alertarBtnLbl.classList = "fas fa-bell";
                        //         alertarBtn.classList = "btn-nav-dash";
                        //         alertarBtn.title = "Alertar Responsável";
                        //         alertarBtn.appendChild(alertarBtnLbl);
                        //         tbNome.innerHTML = maquina.nome;
                        //         tbData.innerHTML = data;
                        //         tbComponente.innerHTML = key.toUpperCase();
                        //         tbMedicao.innerHTML = `${Number(value).toFixed(
                        //             2
                        //         )}%`;
                        //         tbOperacao.appendChild(alertarBtn);
                        //         if (
                        //             Number(value) >=
                        //             eval(`limite_${key}`) * 0.6 + 38
                        //         ) {
                        //             tbEstado.innerHTML = "Critico";
                        //             tr.style.color = "red";
                        //         } else tbEstado.innerHTML = "Risco";
                        //         tr.appendChild(tbData);
                        //         tr.appendChild(tbNome);
                        //         tr.appendChild(tbComponente);
                        //         tr.appendChild(tbEstado);
                        //         tr.appendChild(tbMedicao);
                        //         tr.appendChild(tbOperacao);
                        //         tabelaIncidentes.appendChild(tr);
                        //     }
                        // });
                    }
                }
            } else {
                mostrarAlerta(
                    "Ainda não há registros de incidentes em maquinas de seu acesso",
                    "info"
                );
            }
        } else {
            console.error(response.data.msg);
        }
    });
