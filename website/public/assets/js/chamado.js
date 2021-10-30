const urlParams = new URLSearchParams(window.location.search);
const idChamado = urlParams.get("idChamado");

console.log(idChamado)
axios.post("/chamado/dados", { idChamado })
.then(({data: {status, msg}}) => {
    if (status === "ok") {
        
        // limpando conteúdo atual do conteiner
        const container = document.querySelector(".container-site");
        container.innerHTML = "";

        // renderizando chamado
        renderChamado(msg, container);

        if(msg.solucoes.length > 0) {
            // renderizando solução
            renderSolucao(msg.solucoes[0]);
        } else {
            console.log("nenhuma solução foi encontrada");
        }
    } else {
        console.warn(msg)
    }
})

// renderiza chamado
const renderChamado = (msg, container) => {
    // criando box chamado
    const divBoxChamado = document.createElement("div");
    const divStatus = document.createElement("div");
    const divTitulo = document.createElement("div");
    const divPrioridade = document.createElement("div");
    const divDescricao = document.createElement("div");
    const divFooter = document.createElement("div");
    const divResponsavelNome = document.createElement("div");
    const divResponsavelEmail = document.createElement("div");

    const spanPrioridade = document.createElement("span");
    const spanDataAbertura = document.createElement("span");

    // adicionando corpo das divs
    divStatus.innerHTML = msg.status;
    divTitulo.innerHTML = msg.titulo;
    divPrioridade.innerHTML = "Prioridade: ";
    divDescricao.innerHTML = msg.descricao;
    divFooter.innerHTML = "Responsável: ";
    divResponsavelNome.innerHTML = msg.nome;
    divResponsavelEmail.innerHTML = msg.email;

    spanPrioridade.innerHTML = msg.prioridade;

    const data = new Date(msg.data_abertura).toLocaleString("pt-BR");
    spanDataAbertura.innerHTML = data;

    // adicionando classe às divs/spans
    divBoxChamado.classList.add("box-chamado");
    divStatus.classList.add("status-chamado");
    divStatus.classList.add(msg.status);
    divTitulo.classList.add("titulo");
    divPrioridade.classList.add("prioridade");
    divDescricao.classList.add("descricao");
    divFooter.classList.add("chamado-footer");
    divResponsavelNome.classList.add("responsavel-nome");
    divResponsavelEmail.classList.add("responsavel-email");
    spanDataAbertura.classList.add("data-abertura");

    // aninhando divs
    divPrioridade.appendChild(spanPrioridade);
    divFooter.appendChild(divResponsavelNome);
    divFooter.appendChild(divResponsavelEmail);
    divFooter.appendChild(spanDataAbertura);

    // adicionando tudo à box
    divBoxChamado.appendChild(divStatus);
    divBoxChamado.appendChild(divTitulo);
    divBoxChamado.appendChild(divPrioridade);
    divBoxChamado.appendChild(divDescricao);
    divBoxChamado.appendChild(divFooter);

    // adicionando box ao Container
    container.appendChild(divBoxChamado);
}

const renderSolucao = solucao => {
    console.log(solucao);
}