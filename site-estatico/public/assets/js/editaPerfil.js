var redes = ["whatsapp", "telegram", "slack"];

for (let rede of redes) {
    document.getElementById(`contato-${rede}`).addEventListener("change", function (a) {
        if (this.checked) {
            document.getElementById(`input-${rede}`).style.visibility = "visible";
            document.getElementById(`input-${rede}`).style.width = "40%";
        } else {
            document.getElementById(`input-${rede}`).style.width = "0px";
            document.getElementById(`input-${rede}`).style.visibility = "hidden";
        }
    })
}