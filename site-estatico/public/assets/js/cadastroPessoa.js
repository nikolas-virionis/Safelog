let contatos = document.querySelectorAll(".checkbox-contato");
for (let contato of contatos) {
  let [label, input] = contato.children;
  label.title = input.title = input.id.slice(8);
}
