// dependencias
let express = require('express');
let router = express.Router();

// get home page
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'})
})

module.exports = router;