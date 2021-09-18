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
    debugger;
    validarLogin();
});

const validarLogin = () => {
    console.log(new URLSearchParams(new FormData(form_login)));
    fetch("/auth/staff", {
        method: "POST",
        body: { email: email.value, senha: senha.value },
    }).then((response) => {
        console.log(response, response.ok);
        if (response.ok) {
            response.json().then((json) => {
                console.log(json[0], json.length);
                if (json.length == 1) {
                    console.log("Usuario logado como staff");
                    let { status, ...user } = json;
                    sessionStorage.setItem("staff", JSON.stringify(user));
                    window.location.href = "cadastro-empresa.html";
                } else {
                    fetch("/auth/usuario", {
                        method: "POST",
                        body: JSON.stringify({
                            email: email.value,
                            senha: senha.value,
                        }),
                    }).then((res) => {
                        if (res.ok) {
                            if (res.length == 1) {
                                console.log("Usuario logado");
                                response.json().then((json) => {
                                    let { status, ...user } = json;
                                    sessionStorage.setItem(
                                        "usuario",
                                        JSON.stringify(user)
                                    );
                                    window.location.href = "dashboard.html";
                                });
                            } else {
                                console.log("Usuário ou senha inválidos");
                            }
                        } else {
                            console.log("erro no login de usuario");
                        }
                    });
                }
            });
        } else {
            console.log("erro no login de staff");
        }
    });
};
