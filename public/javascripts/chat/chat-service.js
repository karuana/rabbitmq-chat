var chatService = function() {
    var COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];

    // Initialize varibles
    var $window = $(window);

    var username = $('#userNameInput').val(); // Input for username
    var nowRoom = null;
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box


    var socket = io();




    function addParticipantsMessage (data) {
        var message = '';
        if (data.numUsers === 1) {
            message += "there's 1 participant";
        } else {
            message += "there are " + data.numUsers + " participants";
        }
        log(message);
    }


    // Sends a chat message
    function sendMessage () {
        var message = $inputMessage.val();

        message = cleanInput(message);

        if (message) {
            $inputMessage.val('');
            addChatMessage({
                username: username,
                message: message
            });
            // tell server to execute 'new message' and send along one parameter
            socket.emit('new message', {
                room: nowRoom,
                message: message,
                username: username
            });
        }
    }

    // Log a message
    function log (message, options) {
        var $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    // Adds the visual chat message to the message list
    function addChatMessage (data, options) {

        options = options || {};

        var $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));

        var $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);


        var $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }



    function addMessageElement (el, options) {
        var $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }

        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }


        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // Prevents input from having injected markup
    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }

    // Gets the color of a username through our hash function
    function getUsernameColor (username) {
        // Compute hash code
        var hash = 7;
        for (var i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + (hash << 5) - hash;
        }
        // Calculate color
        var index = Math.abs(hash % COLORS.length);
        return COLORS[index];
    }

    // Keyboard events

    $window.keydown(function (event) {

        if (event.which === 13) {
            sendMessage();
        }
    });


    // Focus input when clicking on the message input's border
    $inputMessage.click(function () {
        $inputMessage.focus();
    });


    $(document).ready(function(){
        // Socket events

        // Whenever the server emits 'login', log the login message
        socket.on('login', function (data) {

            // Display the welcome message
            var message = "welcome";
            log(message, {
                prepend: true
            });
            addParticipantsMessage(data);
        });

        // Whenever the server emits 'new message', update the chat body
        socket.on('new message', function (data) {
            addChatMessage(data);
        });

        // Whenever the server emits 'user joined', log it in the chat body
        socket.on('user joined', function (data) {
            log(data.username + ' joined');
            addParticipantsMessage(data);
        });

        // Whenever the server emits 'user left', log it in the chat body
        socket.on('user left', function (data) {
            log(data.username + ' left');
            addParticipantsMessage(data);
        });
    });


    return {
        joinRoom: function(roomName) {
            if(nowRoom !== null){
                socket.emit("user left", {
                    room: nowRoom,
                    username: username
                });
            }

            nowRoom = roomName;
            socket.emit('add user', {
                room: roomName,
                username: username
            });
            $messages.empty();
        }
    }

}();
