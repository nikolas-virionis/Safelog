// dependencias
let express = require('express');
let router = express.Router();
// let sequielize = require('../models').sequelize;

let env = process.env.NODE_ENV || 'development';

// exemplo de rota
router.get('/testRoute', function(req, res, next) {

    // exemplo de resposta em json
    let obj = {
        nome: "Bikolas",
        sobrenome: "Narcha",
        idade: 320
    }
    
    res.json(obj)

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
})

module.exports = router;