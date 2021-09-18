const email = document.querySelector("#email");
const senha = document.querySelector("#senha");
const form = document.querySelector("#form_login");
const btn = document.querySelector(".btn-geral");

email.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        senha.focus();
    }
});
senha.addEventListener("keypress", (e) => {
    if (e.key == "Enter") {
        e.preventDefault();
        btn.click();
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    validarLogin();
});

const validarLogin = () => {
    axios
        .post("/auth/staff", {
            email: email.value,
            senha: senha.value,
        })
        .then((response) => {
            if (response.data.status == "ok") {
                console.log("Usuario logado como staff");
                let { status, ...user } = response.data;
                sessionStorage.setItem("staff", JSON.stringify(user));
                window.location.href = "cadastro-empresa.html";
            } else {
                axios
                    .post("/auth/usuario", {
                        email: email.value,
                        senha: senha.value,
                    })
                    .then((res) => {
                        if (res.data.status == "ok") {
                            console.log("Usuario logado");
                            let { status, ...user } = res.data;
                            sessionStorage.setItem(
                                "usuario",
                                JSON.stringify(user)
                            );
                            window.location.href = "dashboard.html";
                        } else {
                            console.log("Usuário ou senha inválidos");
                        }
                    });
            }
        });
};
