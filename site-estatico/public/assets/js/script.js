const link = document.createElement("link");
link.rel = "shortcut icon";
link.href = "assets/img/logo/logo-icon-branco.png";
document.getElementsByTagName("head")[0].appendChild(link);

if (
    window.location.pathname != "/login.html" &&
    window.location.pathname != "/index.html" &&
    window.location.pathname != "/cadastro-pessoa.html" &&
    window.location.pathname != "/" &&
    !sessionStorage.usuario &&
    !sessionStorage.staff
) {
    window.location.href = "login.html";
}
