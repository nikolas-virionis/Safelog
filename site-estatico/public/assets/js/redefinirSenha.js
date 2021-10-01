let emailCadastro = document.querySelector("#inp-email");
let contatos = document.querySelectorAll(".checkbox-contato");
for (let contato of contatos) {
    let [label, input] = contato.children;
    label.title = input.title = input.id.slice(8);
}

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");
const email = urlParams.get("email");
const emailInModal = document.querySelector("#idInputEmail");
const tokenInModal = document.querySelector("#idInputToken");
tokenInModal.value = token;
emailInModal.value = email;

const btnProsseguir = document.querySelector("#btn-prosseguir-modal");
const btnCancelar = document.querySelector("#btn-cancelar-modal");

emailInModal.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        tokenInModal.focus();
    }
});

tokenInModal.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        btnProsseguir.click();
    }
});

btnCancelar.addEventListener("click", async (e) => {
    let { cancelarModal } = await import("./modal.js");
    cancelarModal();
});