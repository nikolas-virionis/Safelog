let { id, cargo } = JSON.parse(sessionStorage.getItem("usuario"));
let tabelaIncidentes = document.querySelector(".tabela-listrada table");
axios
    .post(`/medicao/relatorio-incidentes/${cargo}`, {
        id,
    })
    .then((response) => {
        if (response.data?.status == "ok") {
            let { status, response: maquinas } = response.data;
            if (maquinas.length > 0 && maquinas[0].length > 0) {
                for (let maquina of maquinas) {
                    for (let incidente of maquina) {
                        let tr = document.createElement("tr");
                        let tbData = document.createElement("td");
                        let tbNome = document.createElement("td");
                        let tbComponente = document.createElement("td");
                        let tbTipo = document.createElement("td");
                        let tbEstado = document.createElement("td");
                        if (cargo == "analista") {
                            medicao.style.display = "";
                            operacao.style.display = "";
                            let {
                                tipo_categoria: tipoMedicao,
                                nome,
                                valor,
                                unidade,
                                data_medicao: dataMedicao,
                                estado,
                            } = incidente;
                            let date = new Date(dataMedicao);
                            let [componente, tipo] = tipoMedicao.split("_");
                            let data = `${date.toLocaleDateString("pt-BR")}
                            ${date.toTimeString().slice(0, 8)}`;
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
                            tbEstado.innerHTML =
                                estado.charAt(0).toUpperCase() +
                                estado.slice(1);
                            if (estado.toLowerCase() == "critico") {
                                tr.style.color = "red";
                            }
                            // x * 0.6 + 38 => %
                            // 0.65x + 28.5 => °C
                            // 0.409x + 0.08 => ram livre
                            // 0.26x + 21 => disco livre
                            // 0.8x + 33.5 => cpu Mhz (%)
                            tr.appendChild(tbData);
                            tr.appendChild(tbNome);
                            tr.appendChild(tbComponente);
                            tr.appendChild(tbTipo);
                            tr.appendChild(tbEstado);
                            tr.appendChild(tbMedicao);
                            tr.appendChild(tbOperacao);
                        } else {
                            responsavel.style.display = "";
                            let {
                                tipo_categoria: tipoMedicao,
                                resp,
                                nome,
                                data_medicao: dataMedicao,
                                estado,
                            } = incidente;
                            let date = new Date(dataMedicao);
                            let [componente, tipo] = tipoMedicao.split("_");
                            let data = `${date.toLocaleDateString("pt-BR")}
                            ${date.toTimeString().slice(0, 8)}`;
                            if (estado.toLowerCase() == "critico") {
                                let tbResp = document.createElement("td");
                                tbNome.innerHTML = nome;
                                tbData.innerHTML = data;
                                tbComponente.innerHTML =
                                    componente.toUpperCase();
                                tbTipo.innerHTML =
                                    tipo.charAt(0).toUpperCase() +
                                    tipo.slice(1);
                                tbResp.innerHTML = resp;
                                tbEstado.innerHTML =
                                    estado.charAt(0).toUpperCase() +
                                    estado.slice(1);
                                tr.appendChild(tbData);
                                tr.appendChild(tbResp);
                                tr.appendChild(tbNome);
                                tr.appendChild(tbComponente);
                                tr.appendChild(tbTipo);
                                tr.appendChild(tbEstado);
                            }
                        }
                        tabelaIncidentes.appendChild(tr);
                    }
                }
            } else {
                mostrarAlerta(
                    "Ainda não há registros de incidentes em maquinas de seu acesso",
                    "info"
                );
            }
        } else {
            console.error(response.data);
        }
    });
