const urlParams = new URLSearchParams(window.location.search);
const idChamado = urlParams.get("idChamado");

console.log(idChamado)
axios.post("/chamado/dados", { idChamado })
.then(({data: {status, msg}}) => {
    if (status === "ok") {
        console.log(status, msg)
    } else {
        console.warn(msg)
    }
})