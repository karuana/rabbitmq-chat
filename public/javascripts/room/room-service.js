var roomService = function(){
    var source   = $("#room-list-template").html();
    var template = Handlebars.compile(source);
    return {
        getRoomList: function() {
            $.ajax({
                method: 'GET',
                url: '/api/v1/room'
            }).done(function(data){
                $('#room-list').empty();
                $('#room-list').append(template({list:data}));
            }).fail(function(){
                alert('get fail');
            });
        },
        addRoom : function(name) {
            $.ajax({
                method:'POST',
                url:'/api/v1/room',
                data:{
                    name: name,
                    owner: 'tester'
                }
            }).done(function(data){
               if(data.result === true) {
                   alert('room create!!');
               } else {
                   alert("room fail");
               }
            }).fail(function(){
                alert("room fail");
            });
        }
    };
};

$(document).ready(function(){
    var room = roomService();
    room.getRoomList();
    var $roomName = $('#room-name');

    $('#room-btn').click(function(){
        var name = $roomName.val();
        if(name === "" || name === null) {
            alert('plz name');
            return false;
        }

        room.addRoom(name);
        room.getRoomList();
    });

});
