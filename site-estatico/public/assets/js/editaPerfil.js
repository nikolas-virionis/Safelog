let { id, nome, email, cargo, id_empresa, id_supervisor } = JSON.parse(
    sessionStorage.getItem("usuario")
);
let redes = ["whatsapp", "telegram", "slack"];

let whatsappDefault;
let telegramDefault;
let slackDefault;
const inpNome = document.querySelector("#inp-nome");
const inpEmail = document.querySelector("#inp-email");
inpNome.value = nome;
inpEmail.value = email;

for (let rede of redes) {
    document
        .getElementById(`contato-${rede}`)
        .addEventListener("change", (a) => {
            if (document.getElementById(`contato-${rede}`).checked) {
                document.getElementById(`input-${rede}`).style.visibility =
                    "visible";
                document.getElementById(`input-${rede}`).style.width = "40%";
            } else {
                document.getElementById(`input-${rede}`).style.width = "0px";
                document.getElementById(`input-${rede}`).style.visibility =
                    "hidden";
            }
        });
}

axios
    .post("/usuario/perfil", {
        id,
    })
    .then((response) => {
        if (response.data?.status == "ok") {
            let { contatos } = response.data;
            sessionStorage.setItem("contatos", contatos);
            for (let contato of contatos) {
                document.querySelector(`#contato-${contato.nome}`).click();
                document.querySelector(`#input-${contato.nome}`).value =
                    contato.valor;
            }
            whatsappDefault = document.querySelector(`#input-whatsapp`).value;
            telegramDefault = document.querySelector(`#input-telegram`).value;
            slackDefault = document.querySelector(`#input-slack`).value;
        }
    })
    .catch((err) => console.error(err));

const btnWhatsapp = document.querySelector(`#contato-whatsapp`);
const inpWhatsapp = document.querySelector(`#input-whatsapp`);
const btnTelegram = document.querySelector(`#contato-telegram`); 
const inpTelegram = document.querySelector(`#input-telegram`);
const btnSlack = document.querySelector(`#contato-slack`);
const inpSlack = document.querySelector(`#input-slack`);
const btnAlterar = document.querySelectorAll(".btn-geral")[0];
const btnSenha = document.querySelectorAll(".btn-geral")[1];


btnSenha.addEventListener('click', e => e.preventDefault())

btnAlterar.addEventListener("click", (e) => {
    e.preventDefault();
    let contatos = [];
    if (!btnWhatsapp.checked && whatsappDefault != "") {
        contatos.push({ nome: "whatsapp", acao: "delete", valor: "" });
    } else if (inpWhatsapp.value != whatsappDefault) {
        if (whatsappDefault == "" && btnWhatsapp.checked) {
            contatos.push({
                nome: "whatsapp",
                acao: "insert",
                valor: inpWhatsapp.value,
            });
        } else if (btnWhatsapp.checked) {
            contatos.push({
                nome: "whatsapp",
                acao: "update",
                valor: inpWhatsapp.value,
            });
        }
    }
    if (!btnTelegram.checked && telegramDefault != "") {
        contatos.push({ nome: "telegram", acao: "delete", valor: "" });
    } else if (inpTelegram.value != telegramDefault) {
        if (telegramDefault == "" && btnTelegram.checked) {
            contatos.push({
                nome: "telegram",
                acao: "insert",
                valor: inpTelegram.value,
            });
        } else if (btnTelegram.checked) {
            contatos.push({
                nome: "telegram",
                acao: "update",
                valor: inpTelegram.value,
            });
        }
    }
    if (!btnSlack.checked && slackDefault != "") {
        contatos.push({ nome: "slack", acao: "delete", valor: "" });
    } else if (inpSlack.value != slackDefault) {
        if (slackDefault == "" && btnSlack.checked) {
            contatos.push({
                nome: "slack",
                acao: "insert",
                valor: inpSlack.value,
            });
        } else if (btnSlack.checked) {
            contatos.push({
                nome: "slack",
                acao: "update",
                valor: inpSlack.value,
            });
        }
    }
    axios
        .post("/usuario/edicao-perfil", {
            id: JSON.parse(sessionStorage.getItem("usuario")).id,
            nome: inpNome.value,
            email: inpEmail.value,
            contatos,
        })
        .then((response) => {
            if (response.data?.status == "ok") {
                console.log("Perfil alterado com sucesso");
                sessionStorage.setItem(
                    "usuario",
                    JSON.stringify({
                        id,
                        nome: inpNome.value,
                        email: inpEmail.value,
                        cargo,
                        id_empresa,
                        id_supervisor,
                    })
                );
                window.location.href = "perfil.html";
            } else {
                console.log(
                    "Erro na edição do perfil do usuario",
                    response.data?.msg
                );
            }
        });
});

const btnCancelar = document.querySelector("#btn-cancelar-modal");
const continuar = document.querySelector("#btn-alterar-senha");

btnCancelar.addEventListener("click", (e) =>
    import("./modal.js").then(({ fecharModal }) =>
        fecharModal("modal-alterar-senha")
    )
);

continuar.addEventListener("click", () => {
    import("./modal.js").then(({ abrirModal }) =>
        abrirModal("modal-alterar-senha")
    );
});