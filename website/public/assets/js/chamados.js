const userId = JSON.parse(sessionStorage.getItem("usuario")).id;

const renderChamados = (chamados) => {
    const container = document.querySelector("[list-container]");
    container.innerHTML = "";

    chamados.forEach(chamado => {
        // console.log(chamado);

        // list 
        const listItem = document.createElement("div");

        // list items
        const status = document.createElement("span");
        const nomeChamado = document.createElement("span");
        const qtdUsuarios = document.createElement("span");

        // innerHTML
        status.innerHTML = chamado.status;
        nomeChamado.innerHTML = chamado.titulo;
        qtdUsuarios.innerHTML = chamado.solucoes + " Soluções";

        // add class
        listItem.classList.add("chamado-item-list");
        status.classList.add("status-chamado");
        status.classList.add(chamado.status);
        nomeChamado.classList.add("nome-chamado");
        qtdUsuarios.classList.add("qtd-usuarios-chamado");

        // click
        listItem.addEventListener("click", evt => {
            alert(`mover para chamado de ID: ${chamado.id_chamado}`);
        })

        // append
        listItem.appendChild(status);
        listItem.appendChild(nomeChamado);
        listItem.appendChild(qtdUsuarios);

        // final append
        container.appendChild(listItem);
    })
}

axios.post("/chamado/lista", {
    idUsuario: userId
})
.then(({data}) => {
    if (data.status == "ok") {
        renderChamados(data.msg);
    } else {
        console.warn("error");
        console.warn(data.msg);
    }
});

// search chamados
const inputSearch = document.querySelector("[searchBarChamados]");
const btnSearch = document.querySelector("[btnSearchChamados]");

btnSearch.addEventListener("click", evt => {
    if (inputSearch.value !== "") {
        console.log(inputSearch.value);

        axios.post("/chamado/lista", {
            idUsuario: userId,
            search: inputSearch.value
        })
        .then(({data}) => {
            if (data.status == "ok") {
                renderChamados(data.msg);
            } else {
                console.warn("error");
                console.warn(data.msg);
            }
        })
    }
})