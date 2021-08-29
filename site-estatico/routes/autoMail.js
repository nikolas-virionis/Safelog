// dependencias
let express = require("express");
let router = express.Router();
let send = require("../util/msg-streak-shooter/script").mandarEmail;
// let sequielize = require('../models').sequelize;

let env = process.env.NODE_ENV || "development";

// send email
router.post("/sendMail", (req, res, next) => {
    let body = req.body
    // console.log(body.nome)
    send(body.tipo, body.nome, body.remetente, body.destinatario, body.senha)
    
    res.json({
      "status": "ok"
    })
})

// exemplo de rota
router.get("/testRoute", function (req, res, next) {
  // exemplo de resposta em json
  let obj = {
    nome: "Bikolas",
    sobrenome: "Narcha",
    idade: 420,
  };

  res.json(obj);

  // exemplo de consulta no banco
  // let sql = "";

  // if (env == "dev") {
  // 	sql = "SELECT * FROM table;";
  // } else {
  //     sql = "";
  // }

  // sequelize.query(instrucaoSql, {
  // 	type: sequelize.QueryTypes.SELECT
  // })
  // .then(resultado => {
  // 	res.json(resultado);
  // }).catch(erro => {
  // 	console.error(erro);
  // 	res.status(500).send(erro.message);
  // })
});

module.exports = router;
