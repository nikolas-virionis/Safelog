const urlParams = new URLSearchParams(window.location.search);
const idChamado = urlParams.get("idChamado");

axios.post("/chamado/dados", { idChamado })
.then(({data: {status, msg}}) => {

    // limpando conteúdo atual do conteiner
    const container = document.querySelector(".container-site");
    container.innerHTML = "";

    if (status === "ok") {
        // renderizando chamado
        renderChamado(msg, container);

        if(msg.solucoes.length > 0) {
            // renderizando solução
            renderSolucao(msg.solucoes[0], container);
        } else {
            // 
        }
    } else {
        console.warn(msg)
        renderChamadoNaoEncontrado(container);
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

// renderiza solução
const renderSolucao = (solucao, container) => {
    // criando divs 
    const divBox = document.createElement("div");
    const divHeader = document.createElement("div");
    const divTitulo = document.createElement("div");
    const divEficacia = document.createElement("div");
    const divDescricao = document.createElement("div");
    const divData = document.createElement("div");

    // adicionando corpo das divs
    divTitulo.innerHTML = solucao.titulo;
    divEficacia.innerHTML = solucao.eficacia;
    divDescricao.innerHTML = solucao.descricao;
    const data = new Date(solucao.data_solucao);
    divData.innerHTML = data.toLocaleString("pt-BR");

    // adicionando classes
    divBox.classList.add("box-solucao");
    divHeader.classList.add("solucao-header");
    divTitulo.classList.add("solucao-titulo");
    divEficacia.classList.add("solucao-eficacia");
    divEficacia.classList.add(`eficacia-${solucao.eficacia}`);
    divDescricao.classList.add("solucao-descricao");
    divData.classList.add("solucao-data");

    // aninhando divs
    divHeader.appendChild(divTitulo);
    divHeader.innerHTML += "Eficácia: ";
    divHeader.appendChild(divEficacia);
    divBox.appendChild(divHeader);
    divBox.appendChild(divDescricao);
    divBox.appendChild(divData);

    // adicionando solucao ao container 
    container.appendChild(divBox);
}

const renderChamadoNaoEncontrado = (container) => {
    // criando elemento 
    const warnBox = document.createElement("div");
    warnBox.innerHTML = "Chamado não encontrado! Você será redirecionado para a lista de chamados";

    warnBox.classList.add("warn-box");

    container.appendChild(warnBox);

    setTimeout(() => {
        document.location.href = "/chamados";
    }, 2000);
}