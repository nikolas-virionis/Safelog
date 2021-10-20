axios.post("/maquina/lista-dependentes", {
    id: JSON.parse(sessionStorage.getItem("usuario"))?.id
}).then((response) => {
    let {status, res: dependentes} = response.data;
    if(status == "ok"){

        console.log(dependentes)
        if(dependentes.length > 0){
            let titulo = document.createElement("h2");
            if(dependentes.length == 1){
                titulo.innerHTML = "Máquina";
            }else{
                titulo.innerHTML = "Máquinas";
            }
            contSite.prepend(titulo);
            contSite.prepend(document.createElement("br"));
        }else{
            mostrarAlerta("Nenhuma máquina foi encontrada", "warning");
        }
        dependentes.forEach(maq => {
    
            //input radio
            let inputMaq = document.createElement("input");
            inputMaq.setAttribute("type", "radio");
            inputMaq.setAttribute("id", maq.id_maquina);
            inputMaq.setAttribute("name", "forma-contato");        
            if(response.data.res[0].id_maquina == maq.id_maquina){
                inputMaq.setAttribute("checked", "checked");
            }
    
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
    
        });
    }else{
        mostrarAlerta("Ocorreu um erro", "danger");
    }
});
