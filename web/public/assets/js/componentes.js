const { id, id_empresa: empresa } = JSON.parse(
    sessionStorage.getItem("usuario")
);

const urlParams = new URLSearchParams(window.location.search);
const maquina = urlParams.get("id_maquina");
const btn = document.querySelector(".btn-geral");
axios
    .post("maquina/verificar-usuario", {
        id,
        maquina,
    })
    .then((response) => {
        if (response.data?.status == "ok" && !response.data.msg) {
            console.log("usuario não possui acesso");
            window.location.href = "dashboard.html";
        } else if (response.data?.status == "erro") {
            console.log("Erro na verificação do usuario");
        }
    });


mostrarAlerta("Selecione um ou mais componentes para o monitoramento", "info");

let qtdComponentes = 0;
let componentes = [];
let limites = [];

checkCpu.addEventListener("click", (e) => {
    if (checkCpu.checked) {
        document.querySelector("#componentesCpu.lista-medicoes").style.display =
            "block";
    } else {
        document.querySelector("#componentesCpu.lista-medicoes").style.display =
            "none";
    }
});
checkMem.addEventListener("click", (e) => {
    if (checkMem.checked) {
        document.querySelector("#componentesMem.lista-medicoes").style.display =
            "block";
    } else {
        document.querySelector("#componentesMem.lista-medicoes").style.display =
            "none";
    }
});
checkDis.addEventListener("click", (e) => {
    if (checkDis.checked) {
        document.querySelector("#componentesDis.lista-medicoes").style.display =
            "block";
    } else {
        document.querySelector("#componentesDis.lista-medicoes").style.display =
            "none";
    }
});

for (let i = 1; i <= 7; i++) {
    document.querySelector(`#medicao${i}`).addEventListener("click", (e) => {
        esconderAlerta();
        if (document.querySelector(`#medicao${i}`).checked) {
            qtdComponentes++;
            componentes.push(document.querySelector(`#medicao${i}`).name);
            limites.push(Number(document.querySelector(`#limite${i}`).value));
            document.querySelector(`#limite${i}`).disabled = false;
            if (i == 3 || i == 5 || i == 7) {
                document.querySelector(`#limite${i}`).style.borderBottom =
                    "3px solid #0077ff";
            }
        } else {
            qtdComponentes--;
            let index = componentes.indexOf(
                document.querySelector(`#medicao${i}`).name
            );
            componentes.splice(index, 1);
            limites.splice(index, 1);
            document.querySelector(`#limite${i}`).disabled = true;
            if (i == 3 || i == 5 || i == 7) {
                document.querySelector(`#limite${i}`).style.borderBottom =
                    "3px solid #cccccc";
            }
        }

        if (qtdComponentes == 0) {
            mostrarAlerta("Nenhum componente selecionado", "info");
        }
        btn.classList.toggle("cancelar");
    });

    document.querySelector(`#limite${i}`).addEventListener("mousemove", (e) => {
        let valor = Number(document.querySelector(`#limite${i}`).value);
        if (document.querySelector(`#rangeValue${i}`)) {
            let index = componentes.indexOf(
                Number(document.querySelector(`#medicao${i}`).name)
            );
            limites.splice(index, 1, valor);
            document.querySelector(`#rangeValue${i}`).innerHTML = `${valor}%`;
        }
    });
}

btn.addEventListener("click", (e) => {
    if (!btn.classList.contains("cancelar")) {
    }
});
