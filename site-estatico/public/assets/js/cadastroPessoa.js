let contatos = document.querySelectorAll(".checkbox-contato");
for (let contato of contatos) {
  let [label, input] = contato.children;
  label.title = input.title = input.id.slice(8);
}

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const email = urlParams.get('email');
idInputToken.value = token;
idInputEmail.value = email;