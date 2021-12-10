const userId = JSON.parse(sessionStorage.getItem("usuario")).id;

const renderChamados = chamados => {
    const container = document.querySelector("[list-container]");
    container.innerHTML = "";
    if (!chamados.length) {
        // melhorar aviso
        container.classList.add("nenhum-encontrado");
        container.innerHTML = "Nenhum chamado encontrado<br>:(";
    } else {
        container.classList.remove("nenhum-encontrado");
        chamados.forEach(chamado => {
            // console.log(chamado);

            // list
            const listItem = document.createElement("div");

            // list items
            const status = document.createElement("span");
            const nomeChamado = document.createElement("span");
            const datachamado = document.createElement("span");
            const prioridade = document.createElement("span");

            // innerHTML
            status.innerHTML = chamado.status;
            nomeChamado.innerHTML = chamado.titulo;
            datachamado.innerHTML = new Date(
                chamado.data_abertura
            ).toLocaleDateString("pt-BR");
            prioridade.innerHTML = chamado.prioridade;
            console.log(chamado);

            // add class
            listItem.classList.add("chamado-item-list");
            status.classList.add("status-chamado");
            status.classList.add(chamado.status);
            nomeChamado.classList.add("nome-chamado");
            nomeChamado.title = chamado.titulo;
            datachamado.classList.add("data-chamado");
            prioridade.classList.add("prioridade");
            prioridade.classList.add(chamado.prioridade);

            // click
            listItem.addEventListener("click", evt => {
                window.location.href = `/safedesk-call?idChamado=${chamado.id_chamado}`;
            });

            // append
            listItem.appendChild(status);
            listItem.appendChild(nomeChamado);
            listItem.appendChild(datachamado);
            listItem.appendChild(prioridade);

            // final append
            container.appendChild(listItem);
        });
    }
};

axios
    .post("/safedesk-call/lista", {
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

inputSearch.addEventListener("keyup", e => {
    if (e.key == "Enter") {
        e.preventDefault();
    }
    axios
        .post("/safedesk-call/lista", {
            idUsuario: userId,
            search: inputSearch.value.trim()
        })
        .then(({data: {status, msg}}) => {
            if (status == "ok") {
                renderChamados(msg);
            } else {
                console.error("error");
                console.error(msg);
            }
        });
});

btnSearch.addEventListener("click", () => inputSearch.focus());
