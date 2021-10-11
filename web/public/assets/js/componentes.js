const { id, id_empresa: empresa } = JSON.parse(
    sessionStorage.getItem("usuario")
);

const urlParams = new URLSearchParams(window.location.search);
let maquina = urlParams.get("id_maquina").replaceAll("-", ":");

// console.log(maquina);
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

// verificando lista de componentes existentes na máquina
axios.post("/maquina/lista-componentes", { id: maquina })
.then(result => {
    let components = result.data.msg;
    
    for (let c of components) {

        // checking and displaying boxes
        if (c.tipo.includes("cpu") && !checkCpu.checked) {
            checkCpu.click();
            continue;
        }
        if (c.tipo.includes("ram") && !checkMem.checked) {
            checkMem.click();
            continue;
        }
        if (c.tipo.includes("disco") && !checkDis.checked) {
            checkDis.click();
            continue;
        }

        // 
        let element = document.getElementsByName(c.tipo)[0];
        element.checked = true;
        let rand = document.querySelector(`#${element.id.replace("medicao", "limite")}`);
        rand.disabled = false;
        rand.value = Number(c.medicao_limite)

        // update labels values
        let valor = Number(document.querySelector(`#limite${element.id.slice(7)}`).value);
        if (document.querySelector(`#rangeValue${element.id.slice(7)}`)) {
            let index = componentes.indexOf(
                Number(document.querySelector(`#medicao${element.id.slice(7)}`).name)
            );
            limites.splice(index, 1, valor);
            document.querySelector(`#rangeValue${element.id.slice(7)}`).innerHTML = `${valor}%`;
        }
        console.log(c)
    }
}) 