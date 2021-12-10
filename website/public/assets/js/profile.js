let {id, nome, email, cargo} =
    JSON.parse(sessionStorage.getItem("usuario")) ??
    JSON.parse(sessionStorage.getItem("staff"));

if (cargo != "staff") {
    axios
        .post("/user/perfil", {
            id
        })
        .then(response => {
            if (response.data?.status == "ok") {
                let {supervisor, empresa} = response.data;
                nomeCompletoPerfil.innerHTML = nome;
                emailPerfil.innerHTML = email;
                responsavelPerfil.innerHTML = supervisor;
                empresaPerfil.innerHTML = empresa;
                let redes = document.querySelector("#redesPerfil");
                for (let contato of response.data.contatos) {
                    let img = document.createElement("img");
                    img.classList = "img-rede";
                    img.src = `assets/img/social-media/${contato.nome}.png`;
                    redes.appendChild(img);
                }
            }
        })
        .catch(err => console.error(err));
} else {
    nomeCompletoPerfil.innerHTML = nome;
    emailPerfil.innerHTML = email;
    empresaPerfil.innerHTML = "SafeLog";
    responsavelPerfil.style.display = "none";
    responsavelPerfil.previousElementSibling.style.display = "none";
    redesPerfil.style.display = "none";
}
