const urlParams = new URLSearchParams(window.location.search);
const pkMaquina = Number(urlParams.get("pk_maquina"));

axios.post("/maquina/dados", {
    maquina: pkMaquina
}).then(({data: {status, msg}}) => {
    document.querySelector(".titulo-acesso").innerHTML = msg.nome
});

axios.post("/maquina/lista-usuarios", { 
    id: pkMaquina 
}).then(({data: {status, msg}}) => {
    
    msg.forEach(registro => {
        let tr = document.createElement("tr");
        let tdNome = document.createElement("td");
        let tdEmail = document.createElement("td");
        let tdBotoes = document.createElement("td");
        
        let btnStar = document.createElement("button");
        btnStar.classList.add("btn-nav-dash-yellow");
        let btnTimes = document.createElement("button");
        btnTimes.classList.add("btn-nav-dash-red");
        
        let starLbl = document.createElement("i");
        starLbl.classList = "fas fa-star";
        let timesLbl = document.createElement("i");
        timesLbl.classList = "fas fa-times";

        tdNome.innerHTML = registro.nome;
        tdEmail.innerHTML = registro.email;

        btnStar.appendChild(starLbl);
        btnTimes.appendChild(timesLbl);

        tdBotoes.appendChild(btnStar);
        tdBotoes.appendChild(btnTimes);

        tr.appendChild(tdNome);
        tr.appendChild(tdEmail);
        tr.appendChild(tdBotoes);

        document.querySelector("#tblAcessoMaq").appendChild(tr);
        
        
        
        btnTimes.addEventListener("click", (e) => {
            let confirmar = confirm(`Você realmente deseja tirar o acesso de ${registro.nome}`)
            if(confirmar){
                axios.post("/usuario/remocao-acesso", {
                    id: registro.id_usuario,
                    maquina: pkMaquina
                }).then((e)=>{
                    mostrarAlerta("Acesso removido com sucesso", "success");
                    setTimeout(()=>{ window.location.reload() } ,1000 );
                });
            }
        });
    });

});


document.querySelector("#btnAddUser").addEventListener("click", () => {
    import("./modal.js").then(({abrirModal}) =>
        abrirModal("modal-invite-user")
    );
});


const btnCancelar = document.querySelector("#btn-cancelar-modal");

btnCancelar.addEventListener("click", e =>
    import("./modal.js").then(({fecharModal}) =>
        fecharModal("modal-invite-user")
    )
);
