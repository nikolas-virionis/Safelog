// dependencias
let express = require("express");
let router = express.Router();
let sequelize = require("../models").sequelize;

router.post("/trend", async (req, res) => {
    let {idCategoriaMedicao} = req.body;
    if (!req.body) {
        return res.json({
            status: "erro",
            msg: "Body não fornecido na requisição"
        });
    }
    const sqlMedicoes = `SELECT valor FROM medicao WHERE fk_categoria_medicao = ${idCategoriaMedicao} ORDER BY data_medicao DESC LIMIT 100`;
    let medicoes = await sequelize
        .query(sqlMedicoes, {type: sequelize.QueryTypes.SELECT})
        .map(el => el.valor);
    medicoes = [...medicoes].reverse();

    res.json({medicoes});
});

module.exports = router;
