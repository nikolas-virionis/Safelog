const urlParams = new URLSearchParams(window.location.search);
const idChamado = urlParams.get("idChamado");

axios.post("/chamado/dados", {idChamado}).then(({data: {status, msg}}) => {
    // limpando conteúdo atual do conteiner
    const container = document.querySelectorAll(".container-site")[1];

    if (status === "ok") {
        // renderizando chamado
        renderChamado(msg);
        console.log(msg);
        if (msg.solucao) {
            // renderizando solução
            renderSolucao(msg.solucao);
        }
    } else {
        console.warn(msg);
        renderChamadoNaoEncontrado(container);
    }
});

// renderiza chamado
const renderChamado = msg => {
    // criando box chamado
    const divStatus = document.querySelector(".status-chamado");
    const divTitulo = document.querySelector(".titulo");
    const divPrioridade = document.querySelector(".prioridade");
    const divDescricao = document.querySelector(".descricao");
    const divResponsavelNome = document.querySelector(".responsavel-nome");
    const divResponsavelEmail = document.querySelector(".responsavel-email");
    const divDataAbertura = document.querySelector(".data-abertura");

    // adicionando corpo das divs
    divStatus.innerHTML = msg.status_chamado;
    divTitulo.innerHTML = msg.titulo;
    divPrioridade.innerHTML = `Prioridade: <span>${msg.prioridade.toUpperCase()}</span>`;
    divDescricao.innerHTML = msg.descricao;
    const data = new Date(msg.data_abertura).toLocaleString("pt-BR");
    divDataAbertura.innerHTML = data;
    if (msg.automatico == "n") {
        divResponsavelNome.innerHTML = msg.nome;
        divResponsavelEmail.innerHTML = msg.email;
    } else {
        divResponsavelNome.innerHTML = "Monitoramento automático";
        divResponsavelEmail.innerHTML = "";
    }
    divStatus.classList = `status-chamado ${msg.status_chamado}`;
};

// renderiza solução
const renderSolucao = solucao => {
    // criando divs
    document.querySelector(".card.solucao").style.display = "block";
    const divTitulo = document.querySelector(".solucao-titulo");
    const divEficacia = document.querySelector(".solucao-eficacia");
    const divDescricao = document.querySelector(".solucao-descricao");
    const divData = document.querySelector(".solucao-data");
    const divResponsavelNome = document.querySelector(
        ".solucao-responsavel-nome"
    );
    const divResponsavelEmail = document.querySelector(
        ".solucao-responsavel-email"
    );

    // adicionando corpo das divs
    divTitulo.innerHTML = solucao.titulo;
    divEficacia.innerHTML = solucao.eficacia;
    divDescricao.innerHTML = solucao.descricao;
    const data = new Date(solucao.data_solucao);
    divData.innerHTML = data.toLocaleString("pt-BR");
    divResponsavelNome.innerHTML = solucao.nome;
    divResponsavelEmail.innerHTML = solucao.email;

    // adicionando classes
    divEficacia.classList = `solucao-eficacia eficacia-${solucao.eficacia}`;
};

const renderChamadoNaoEncontrado = container => {
    // criando elemento
    const warnBox = document.createElement("div");
    warnBox.innerHTML =
        "Chamado não encontrado! Você será redirecionado para a lista de chamados";

    warnBox.classList.add("warn-box");

    container.appendChild(warnBox);

    setTimeout(() => {
        document.location.href = "/chamados";
    }, 2000);
};
