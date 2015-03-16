var express = require('express');
var roomService = require('../chat/room-service');
var router = express.Router();

/* GET users listing. */
router.get('/room', function(req, res, next) {
    res.contentType('application/json');
    res.json(roomService.getRoomList());
});

router.post('/room', function(req, res){
    console.log(req);
    var name = req.param('name');
    var owner = req.param('owner');
    var result = roomService.addRoom(name,owner);

    res.contentType('application/json');
    res.json({'result':result});

});


module.exports = router;
