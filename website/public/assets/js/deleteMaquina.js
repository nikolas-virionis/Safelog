// capturando valores da url
const urlParams = new URLSearchParams(window.location.search);

const token = urlParams.get("token");
const email = urlParams.get("email");
const maquina = urlParams.get("maquina");

// autocomplete de inputs
idInputEmail.value = email;
idInputToken.value = token;

const btnExcluir = document.querySelector("[btnExcluirMaquina]");
const btnCancelar = document.querySelector("[btnCancelar]");

axios
    .post("/maquina/dados", {
        maquina: Number(urlParams.get("maquina"))
    })
    .then(({data: {status, msg}}) => {
        if (status == "ok") {
            document.querySelector("[macName]").innerHTML = msg.nome;
        } else {
            console.error(msg);
        }
    })
    .catch(err => console.error(err));
let x = 0;
btnExcluir.addEventListener("click", evt => {
    if (x) {
        btnExcluir.click();
        x++;
    }
    console.log(maquina);
    axios
        .post("/maquina/delete", {
            id: maquina
        })
        .then(({data: {status, msg}}) => {
            console.log(status, msg);
            if (status == "ok") {
                mostrarAlerta(msg, "success");
                setTimeout(() => {
                    window.location.href = "dependentes";
                }, 3000);
            } else if (status == "alerta") {
                mostrarAlerta(msg, "danger");
            } else {
                console.error(msg);
            }
        })
        .catch(err => {
            console.log(err);
        });
});

btnCancelar.addEventListener("click", evt => {
    window.location.href = "dependentes";
});

document.querySelector("[btnProsseguir]").addEventListener("click", evt => {
    axios
        .post("/usuario/verificacao", {
            email,
            token
        })
        .then(async ({data: {status, msg}}) => {
            if (status == "ok") {
                await axios
                    .post("/usuario/dados", {
                        id: msg.id_usuario
                    })
                    .then(({data: {status, msg}}) => {
                        if (status === "ok") {
                            sessionStorage.setItem(
                                "usuario",
                                JSON.stringify({...msg})
                            );
                            nomeUser.innerText = msg.nome.split(" ").shift();
                            import("./modal.js").then(({fecharModal}) =>
                                fecharModal("modal-verify-token")
                            );
                        }
                    })
                    .catch(err => console.error(err));
                import("./modal.js").then(({fecharModal}) =>
                    fecharModal("modal-verify-token")
                );
            } else {
                console.error(msg);
            }
        });
});
