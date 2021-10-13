const { id } = JSON.parse(sessionStorage.getItem("usuario"));
const macAddr = document.querySelector("#inp-id-maquina");
const senha = document.querySelector("#inp-senha-maquina");
const btn = document.querySelector(".btn-geral");

macAddr.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        senha.focus();
    }
});

senha.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        btn.click();
    }
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!macAddr.value || !senha.value) return;
    let macAddress = macAddr.value.replace(/-/g, ":").toLowerCase();
    axios
        .post("/auth/maquina", {
            id: macAddress,
            senha: senha.value,
        })
        .then((response) => {
            if (response.data?.status == "ok") {
                axios
                    .post("/usuario/acesso-maquina", {
                        id,
                        maquina: macAddress,
                    })
                    .then((res) => {
                        console.log(res);
                    });
            } else {
                mostrarAlerta(response.data.msg, "danger");
            }
        });
});
