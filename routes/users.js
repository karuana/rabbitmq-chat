var express = require('express');
var router = express.Router();


router.post('/login', function(req, res){
    console.log(req);
    var name = req.param('name');
    if(name ==='' || name === undefined) {
        res.redirect("/");
    }
    req.session.name = name;

    res.redirect("/room");
});


module.exports = router;
