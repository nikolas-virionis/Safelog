// let alertarSup = document.querySelectorAll(".btn-nav-dash");
// alertarSup.forEach((btn) => (btn.title = "Alertar Responsável"));
// for (let btn of alertarSup) btn.title = "Alertar Responsável";

// ////////////////////////////////////////////////////////////////////

// let estadosAlerta = document.querySelectorAll(
//   ".tabela-listrada table tr td:nth-child(4)"
// );
// estadosAlerta.forEach((estado) =>
//   estado.innerHTML == "Crítico"
//     ? (estado.parentElement.style.color = "red")
//     : ""
// );
// for (let estado of estadosAlerta) {
//   if (estado.innerHTML == "Crítico") {
//     estado.parentElement.style.color = "red";
//   }
// }
let { id } = JSON.parse(sessionStorage.getItem("usuario"));
let tabelaIncidentes = document.querySelector(".tabela-listrada table");
axios
    .post("medicao/relatorio-incidentes", {
        id,
    })
    .then((response) => {
        if (response.data?.status == "ok") {
            let { status, response: incidentes } = response.data;
            console.log(incidentes);
            for (let incidente of incidentes) {
                Object.entries(incidente).forEach(([key, value]) => {
                    if (Number(value) > 70) {
                        let tr = document.createElement("tr");
                        let date = new Date(incidente.data_medicao);
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
                        alertarBtn.appendChild(alertarBtnLbl);
                        tbNome.innerHTML = incidente.nome;
                        tbData.innerHTML = data;
                        tbComponente.innerHTML = key.toUpperCase();
                        tbMedicao.innerHTML = `${Number(value).toFixed(2)}%`;
                        tbOperacao.appendChild(alertarBtn);
                        if (Number(value) > 85) {
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
        } else {
            console.error(response.data.msg);
        }
    });
