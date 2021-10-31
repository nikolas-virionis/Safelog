let {id, cargo} = JSON.parse(sessionStorage.getItem("usuario"));
let tabelaIncidentes = document.querySelector(".tabela-listrada table");
axios
    .post(`/medicao/relatorio-incidentes/${cargo}`, {
        id
    })
    .then(({data: {status, response: maquinas}}) => {
        if (status == "ok") {
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
                            let {
                                id_medicao,
                                tipo_categoria: tipoMedicao,
                                nome,
                                valor,
                                unidade,
                                data_medicao: dataMedicao,
                                estado,
                                fk_categoria_medicao: categoria
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
                            alertarBtn.addEventListener("click", async e => {
                                axios
                                    .post("/medicao/alertar-gestor", {
                                        id,
                                        id_medicao
                                    })
                                    .then(({data: {status, msg}}) => {
                                        if (status === "ok") {
                                            mostrarAlerta(msg, "success");
                                            setTimeout(
                                                () => window.location.reload(),
                                                4000
                                            );
                                        } else {
                                            console.error(msg);
                                        }
                                    });
                            });
                            let chamadoBtnLbl = document.createElement("i");
                            let chamadoBtn = document.createElement("button");
                            chamadoBtnLbl.classList = "fas fa-exclamation";
                            chamadoBtn.classList = "btn-nav-dash-red";
                            chamadoBtn.title = "Abrir Chamado";
                            chamadoBtn.appendChild(chamadoBtnLbl);
                            chamadoBtn.addEventListener("click", () => {
                                // abrir modal de criar chamado
                                // modal deve, além dos campos para preencher,
                                // ter os dados da medição em questão:
                                // tlvz usar uma função que abra o modal e pegue
                                // os dados da medição como parametro e renderize eles
                                // no modal
                                // ao enviar o modal ele não desaparece obrigatoriamente
                                // é necessário obter uma resposta positiva da criação do
                                // chamado, mas cancelar é permitido
                            });

                            tbNome.innerHTML = nome;
                            tbData.innerHTML = data;
                            tbComponente.innerHTML = componente.toUpperCase();
                            tbTipo.innerHTML =
                                tipo.charAt(0).toUpperCase() + tipo.slice(1);
                            tbMedicao.innerHTML = `${Number(
                                valor
                            )}${unidade.replace("┬░C", "°C")}`;
                            tbOperacao.appendChild(alertarBtn);
                            tbOperacao.appendChild(chamadoBtn);
                            tbEstado.innerHTML =
                                estado.charAt(0).toUpperCase() +
                                estado.slice(1);
                            if (estado.toLowerCase() == "critico") {
                                tr.style.color = "red";
                            }
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
                                fk_categoria_medicao: categoria
                            } = incidente;
                            let date = new Date(dataMedicao);
                            let [componente, tipo] = tipoMedicao.split("_");
                            let data = `${date.toLocaleDateString("pt-BR")}
                            ${date.toTimeString().slice(0, 8)}`;
                            if (estado.toLowerCase() == "critico") {
                                let tbResp = document.createElement("td");
                                let tbOperacao = document.createElement("td");
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
                                let chamadoBtnLbl = document.createElement("i");
                                let chamadoBtn =
                                    document.createElement("button");
                                chamadoBtnLbl.classList = "fas fa-exclamation";
                                chamadoBtn.classList = "btn-nav-dash-red";
                                chamadoBtn.title = "Abrir Chamado";
                                chamadoBtn.appendChild(chamadoBtnLbl);
                                chamadoBtn.addEventListener("click", () => {
                                    // abrir modal de criar chamado
                                    // modal deve, além dos campos para preencher,
                                    // ter os dados da medição em questão:
                                    // tlvz usar uma função que abra o modal e pegue
                                    // os dados da medição como parametro e renderize eles
                                    // no modal
                                    // ao enviar o modal ele não desaparece obrigatoriamente
                                    // é necessário obter uma resposta positiva da criação do
                                    // chamado, mas cancelar é permitido
                                });

                                tbOperacao.appendChild(chamadoBtn);
                                tr.appendChild(tbData);
                                tr.appendChild(tbResp);
                                tr.appendChild(tbNome);
                                tr.appendChild(tbComponente);
                                tr.appendChild(tbTipo);
                                tr.appendChild(tbEstado);
                                tr.appendChild(tbOperacao);
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
            console.error(maquinas);
        }
    });
