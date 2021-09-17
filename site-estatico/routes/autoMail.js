// dependencias
let express = require("express");
let router = express.Router();
let send = require("../util/email-sender/script").mandarEmail;
// let sequielize = require('../models').sequelize;

let env = process.env.NODE_ENV || "development";

// send email
router.post("/sendMail", (req, res, next) => {
    let body = req.body;
    // console.log(body.nome)
    send(
        body.tipo,
        body.nome,
        body.remetente,
        body.destinatario,
        body.senha,
        body.resto
    )
        .then((response) => res.json("GGWP"))
        .catch((err) => console.log(err));
});

module.exports = router;
