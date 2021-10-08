let { id, nome, email } = JSON.parse(sessionStorage.getItem("usuario"));
axios
    .post("/usuario/perfil", {
        id,
    })
    .then((response) => {
        if (response.data?.status == "ok") {
            let { supervisor, empresa } = response.data;
            nomeCompletoPerfil.innerHTML = nome;
            emailPerfil.innerHTML = email;
            responsavelPerfil.innerHTML = supervisor;
            empresaPerfil.innerHTML = empresa;
            let redes = document.querySelector("#redesPerfil");
            for (let contato of response.data.contatos) {
                let img = document.createElement("img");
                img.classList = "img-rede";
                img.src = `assets/img/redes/${contato.nome}.png`;
                redes.appendChild(img);
            }
        }
    })
    .catch((err) => console.error(err));
