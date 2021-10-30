const urlParams = new URLSearchParams(window.location.search);
const idChamado = urlParams.get("idChamado");

axios.post("/chamado/dados", { idChamado })
.then(({data: {status, msg}}) => {
    if (status === "ok") {
        console.log(msg);
    } else {
        console.log(msg)
    }
})