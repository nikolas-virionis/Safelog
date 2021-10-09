const { id, id_empresa: empresa } = JSON.parse(
    sessionStorage.getItem("usuario")
);

const urlParams = new URLSearchParams(window.location.search);
const idMaquina = urlParams.get('id_maquina');

axios.post("maquina/verificarUsuario", {
    id,
    idMaquina,
}).then((response) => {
    if(response.data.resp[0].contagem ==0 || response.data.resp[0].responsavel != 's'){
        window.location = "dashboard.html";
    }
    
})

let componentes = [];
let medicoes = [];


document.querySelector("#checkCpu").addEventListener("click", (e) => {
    if(checkCpu.checked){
        document.querySelector("#componentesCpu.lista-medicoes").style.display = "block";
    }else{
        document.querySelector("#componentesCpu.lista-medicoes").style.display = "none";
    }
});
document.querySelector("#checkMem").addEventListener("click", (e) => {
    if(checkMem.checked){
        document.querySelector("#componentesMem.lista-medicoes").style.display = "block";
    }else{
        document.querySelector("#componentesMem.lista-medicoes").style.display = "none";
    }
});
document.querySelector("#checkDis").addEventListener("click", (e) => {
    if(checkDis.checked){
        document.querySelector("#componentesDis.lista-medicoes").style.display = "block";
    }else{
        document.querySelector("#componentesDis.lista-medicoes").style.display = "none";
    }
});

mostrarAlerta("Selecione um ou mais componentes para o monitoramento", "info");
let controle = 0;
for(let i = 1; i <= 7; i++){
    
    document.querySelector("#medicao"+i).addEventListener("click", (e) => {
        esconderAlerta();
        if(document.querySelector("#medicao"+i).checked){
            controle++;
            componentes.push(document.querySelector("#medicao"+i).name);
            document.querySelector("#limite"+i).disabled = false;            
            if(i == 3 || i == 5 || i == 7){
                document.querySelector("#limite"+i).style.borderBottom = '3px solid #0077ff';
            }
            
        }else{
            controle--;
            var buscar = componentes.indexOf(document.querySelector("#medicao"+i).name);
            componentes.splice(buscar, 1);
            document.querySelector("#limite"+i).disabled = true;
            if(i == 3 || i == 5 || i == 7){
                document.querySelector("#limite"+i).style.borderBottom = '3px solid #cccccc';
            }
        }

        var texto = "";
        for (let i = 0; i < componentes.length; i++) {
            texto += `${componentes[i]}: `;
            if(i + 1 < componentes.length){
                texto += ',';
            } 
        }
        alert(texto)
        
        
        if(controle == 0){
            mostrarAlerta("Nenhum componente selecionado", "info");
            document.querySelector("#btnSubmit").classList.add("cancelar");
        }else{
            document.querySelector("#btnSubmit").classList.remove("cancelar");
        }
    });

    document.querySelector("#limite"+i).addEventListener("mousemove", (e) => {
        let valor = document.querySelector("#limite"+i).value;
        document.querySelector("#rangeValue"+i).innerHTML = valor+"%";
    });
}



// axios.post("maquina/registrarMedidas", {
//     componentes,



// }).then()




