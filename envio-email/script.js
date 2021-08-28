function mandarEmail(tipo, nome, remetente, destinatario, senha) {
  // modulo em node que liga js - python
  let spawns = require("child_process").spawn;
  //ligação feita com o arquivo .py + parametros (escalavel)
  const sensor = spawns("python", [
    "main.py",
    tipo,
    nome,
    remetente,
    destinatario,
    senha,
  ]);
  // exibindo o ultimo print(no main.py) que se aparecer, tudo funfou bem
  sensor.stdout.on("data", (data) => console.log(data.toString("utf8")));
}
// chamada da função com os parametros, pode ser feita em outras partes do código
mandarEmail(
  "tipo", // tipo: cadastro / relatorio / alerta
  "nome", //nome
  "nome.sobrenome@gmail.com", //remetente
  "nome.sobrenome@gmail.com", //destinatario
  "senha" //senha
);
