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
btnProsseguir.addEventListener("click", (e) => {
    axios
        .post("/usuario/verificacao", {
            email: emailInModal.value,
            token: tokenInModal.value,
        })
        .then((response) => {
            if (response.data?.status == "ok") {
                console.log("usuario verificado com sucesso");
                sessionStorage.setItem(
                    "id_usuario",
                    response.data.msg.id_usuario
                );
                import("./modal.js").then(({ fecharModal }) =>
                    fecharModal("modal-verify-token")
                );
            } else console.log("Erro na verificação do usuario");
        });
});
btnCancelar.addEventListener("click", async (e) => {
    let { cancelarModal } = await import("./modal.js");
    cancelarModal();
});

var redes = ["whatsapp", "telegram", "slack"];

for(var i = 0; i < redes.length; i++){
    document.getElementById("contato-"+redes[i]).addEventListener("change", function(a){
      if(this.checked){
        document.getElementById("input-"+ this.id.slice(8,this.lenght)).style.visibility = 'visible';
        document.getElementById("input-"+ this.id.slice(8,this.lenght)).style.width = "40%";
      }else{
        document.getElementById("input-"+ this.id.slice(8,this.lenght)).style.width = "0px";
        document.getElementById("input-"+ this.id.slice(8,this.lenght)).style.visibility = "hidden";
      }
    })
}
