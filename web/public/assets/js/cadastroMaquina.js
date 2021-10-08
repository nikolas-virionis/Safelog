const cpu = document.querySelector("#cpuRange");
const ram = document.querySelector("#memoryRange");
const dsk = document.querySelector("#diskRange");

leituraCpu.innerHTML = cpu.value;
leituraMemory.innerHTML = ram.value;
leituraDisk.innerHTML = dsk.value;

cpu.addEventListener("mousemove", () => (leituraCpu.innerHTML = cpu.value));
ram.addEventListener("mousemove", () => (leituraMemory.innerHTML = ram.value));
dsk.addEventListener("mousemove", () => (leituraDisk.innerHTML = dsk.value));

const { id, id_empresa: empresa } = JSON.parse(
    sessionStorage.getItem("usuario")
);
const id_maquina = document.querySelector("#inp-id-maquina");
const nome = document.querySelector("#inp-nome-maquina");
const senha = document.querySelector("#inp-senha-maquina");
const confirmarSenha = document.querySelector("#inp-conf-senha-maquina");
const btn = document.querySelector(".btn-geral");

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
    if (senha.value !== confirmarSenha.value)
        return console.log("Senhas diferentes");
    axios
        .post("/maquina/cadastro", {
            id,
            id_maquina: id_maquina.value,
            nome: nome.value,
            senha: senha.value,
            cpu: Number(cpu.value),
            ram: Number(ram.value),
            disco: Number(dsk.value),
            empresa,
        })
        .then((response) => {
            if (response.data?.status == "ok") {
                console.log("Maquina registrada com sucesso");
                window.location.reload();
            } else {
                console.error(
                    "Erro no cadastro da maquina:\n",
                    response.data.msg
                );
            }
        });
});
