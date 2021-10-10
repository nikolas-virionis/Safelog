// const cpu = document.querySelector("#cpuRange");
// const ram = document.querySelector("#memoryRange");
// const dsk = document.querySelector("#diskRange");

// leituraCpu.innerHTML = cpu.value;
// leituraMemory.innerHTML = ram.value;
// leituraDisk.innerHTML = dsk.value;

// cpu.addEventListener("mousemove", () => (leituraCpu.innerHTML = cpu.value));
// ram.addEventListener("mousemove", () => (leituraMemory.innerHTML = ram.value));
// dsk.addEventListener("mousemove", () => (leituraDisk.innerHTML = dsk.value));

const { id, id_empresa: empresa } = JSON.parse(
    sessionStorage.getItem("usuario")
);
const id_maquina = document.querySelector("#inp-id-maquina");
const nome = document.querySelector("#inp-nome-maquina");
const senha = document.querySelector("#inp-senha-maquina");
const confirmarSenha = document.querySelector("#inp-conf-senha-maquina");
const btn = document.querySelector("#btnCadastroMaq");

id_maquina.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        nome.focus();
    }
});
nome.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        senha.focus();
    }
});
senha.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        confirmarSenha.focus();
    }
});
confirmarSenha.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        confirmarSenha.blur();
    }
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (senha.value !== confirmarSenha.value) {
        mostrarAlerta("As senhas são diferentes", "warning");
        return;
    }
    axios
        .post("/maquina/cadastro", {
            id,
            id_maquina: id_maquina.value,
            nome: nome.value,
            senha: senha.value,
            empresa,
        })
        .then((response) => {
            console.log(response);
            if (response.data?.status == "ok") {
                mostrarAlerta("Maquina registrada com sucesso", "success");
                window.location = `componentes.html?id_maquina=${id_maquina.value}`;
            } else {
                mostrarAlerta("Erro no cadastro da máquina", "danger");
            }
        });
});
