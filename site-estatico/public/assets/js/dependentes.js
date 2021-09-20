const nomeUsuario = document.querySelector(".sub-chefe h3");
nomeUsuario.innerText = JSON.parse(sessionStorage.getItem("usuario")).nome;

const email = document.querySelector("#email-convite");
const btnConfirmar = document.querySelector("#btn-prosseguir-modal");
const btnCancelar = document.querySelector("#btn-cancelar-modal");
const btnAbrirConvite = document.querySelector(".convite-email");

btnAbrirConvite.addEventListener("click", (e) => {
    if (JSON.parse(sessionStorage.getItem("usuario")).cargo != "analista")
        import("./modal.js").then(({ abrirModal }) =>
            abrirModal("modal-send-email")
        );
    else window.location.href = "cadastro-maquina.html";
});
btnCancelar.addEventListener("click", (e) =>
    import("./modal.js").then(({ fecharModal }) =>
        fecharModal("modal-send-email")
    )
);

email.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnConfirmar.click();
    }
});
const validateEmail = (email) => {
    const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
};

btnConfirmar.addEventListener("click", (e) => {
    if (!email.value) return;
    if (!validateEmail(email.value)) return console.log("Email invalido");
    let { cargo, id, id_empresa } = JSON.parse(
        sessionStorage.getItem("usuario")
    );
    axios
        .post("/usuario/convite", {
            email: email.value,
            cargo: cargo == "admin" ? "gestor" : "analista",
            fk_empresa: id_empresa,
            fk_supervisor: id,
        })
        .then((res) => {
            if (res.data?.status == "ok") {
                console.log(
                    "Email convidado e inserido no banco (parcialmente)"
                );
                email.value = "";
            } else console.log("Erro no convite do usuario");
        });
});
