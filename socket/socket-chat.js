var _ = require('underscore');
var roomService = require('../chat/room-service');

module.exports = function(socket) {
    socket.on("new message", function(data){

        //TODO: 래빗 MQ적용
        var roomName = data.room;
        var userName = socket.username;
        var message = data.message;

        _.each(roomService.getClient(roomName), function(targetSocket){
            if(targetSocket !== socket) {
                targetSocket.emit("new message", {
                    username: userName,
                    message: message
                });
            }
        });
    });

    //API 필요한거

    // 방 사용자 추가
    // data - 방, 사용자 이름

    // 방 참여 확인 응답
    // 응답 현재 방인원


    //메시지,
    //누가
    //어디로
    //메시징



    socket.on("add user", function(data){
        //room , username
        var roomName = data.room;
        var userName = data.username;
        socket.username = userName;

        var result = roomService.addClient(roomName, socket);


        socket.emit("login", {
            numUsers: roomService.getRoomMemberCount(roomName),
            result: result
        });

        if(result) {
            _.each(roomService.getClient(roomName), function(targetSocket){
                if(targetSocket !== socket) {
                    targetSocket.emit("user joined", {
                        username: userName,
                        numUsers: roomService.getRoomMemberCount(roomName)
                    });
                }
            });
        }

    });

    socket.on("user left" ,function(data) {
        var roomName = data.room;
        var userName = socket.username;
        roomService.deleteClient(roomName, socket);

        _.each(roomService.getClient(roomName), function(targetSocket){
            if(targetSocket !== socket) {
                targetSocket.emit("user left", {
                    username: userName,
                    numUsers: roomService.getRoomMemberCount(roomName)
                });
            }
        });
    })


    socket.on("disconnect", function(){
        var userName = socket.username;
        var roomName = roomService.deleteAllRoom(socket);

        if(!_.isNull(roomName) && !_.isUndefined(roomName)) {
            _.each(roomService.getClient(roomName), function(targetSocket){
                if(targetSocket !== socket) {
                    targetSocket.emit("user left", {
                        username: userName,
                        numUsers: roomService.getRoomMemberCount(roomName)
                    });
                }
            });
        }

    });
};
