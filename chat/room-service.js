var roomService = function() {
    var list = [];
    var room = [];

    var findRoom = function(name) {
        var i = 0;
        for(i=0;i<list.length;i++) {
            if(list[i].name === name) {
             return list[i];
            }
        }
        return null;
    };

    var deleteClient = function(name, clientid){
        var idx = -1;
        if(room[name]=== undefined || room[name] === null) {
            return false;
        }
        var target = room[name];

        for(var i = 0; i< target.clients.length; i++) {
            if(target.clients[i] === clientid) {
                idx = i;
                break;
            }
        }
        if(idx !== -1){
            target.clients[i].splice(idx, 1);
            return true;
        }
        return false;
    };

    return {
        addRoom : function(name, owner) {
            if(name === null || owner === null) {
                return false;
            }
            if(findRoom(name) === null) {
                list.push({'name':name, 'owner':owner});
                room[name] = {
                    clients:[]
                };

                return true;
            }
            return false;
        },
        getRoomList : function() {
            return list;
        },
        addClient : function(name, clientid){
            if(room[name]=== undefined || room[name] === null) {
                return false;
            }
            room[name].clients.push(clientid);
            return true;
        },
        deleteAllRoom : function(clientId) {
            var i = 0;

            for(i=0;i<list.length;i++) {
                if(deleteClient(list[i],clientId)) {
                    return list[i].name;
                }
            }

            return null;
        },
        getRoomMemberCount : function(name) {

          return (room[name] === null || room[name] === undefined) ? 0:room[name].clients.length;
        },
        getClient : function(name) {
            return room[name].clients;
        }
    };

}();

module.exports = roomService;
