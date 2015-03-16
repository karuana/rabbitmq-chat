var roomService = function() {
    var list = [];

    var findRoom = function(name) {
        var i = 0;
        for(i=0;i<list.length;i++) {
            if(list[i].name === name) {
             return list[i];
            }
        }
        return null;
    };

    return {
        addRoom: function(name, owner) {
            if(name === null || owner === null) {
                return false;
            }
            if(findRoom(name) === null) {
                list.push({'name':name, 'owner':owner});
                return true;
            }
            return false;
        },
        getRoomList : function() {
            return list;
        }

    };

}();

module.exports = roomService;
