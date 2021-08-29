function slackMsg() {
  // modulo em node que liga js - python
  let spawns = require("child_process").spawn;
  const path = require("path");

  //ligação feita com o arquivo .py + parametros (escalavel)
  const sensor = spawns("python", [path.join(__dirname, "main.py")]);
  // exibindo o ultimo print(no main.py) que se aparecer, tudo funfou bem
  sensor.stdout.on("data", (data) => console.log(data.toString("utf8")));

  sensor.on("error", (err) => {
    console.log(err);
  });
}

module.exports = { slackMsg };
