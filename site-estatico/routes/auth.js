// dependencias
let express = require("express");
let router = express.Router();
let sequielize = require("../models").sequelize;

let env = process.env.NODE_ENV || "development";

router.post("/staff", (req, res, next) => {
  //
});

router.post("/usuario", (req, res, next) => {
  //
});

module.exports = router;
