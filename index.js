const express = require('express');
const socket = require('socket.io');
const app = express();

const server = app.listen(8080, function() {
    console.log("Listening to request on port 8080");
});

const io = socket(server);

app.use(express.static('public'));

let userOnline = 0;

var player = {},
    unmatched;

io.on('connection', function(socket) {
    console.log("Making connection", socket.id);

    socket.on("join", function(){
        userOnline++;
        console.log("User Join = " + userOnline);
        io.sockets.emit("userOnline", userOnline);
    });

    joinGame(socket);
    if (getOpponent(socket)) {
        io.sockets.emit("begin", {
            chara: player[socket.id].chara,
        });
        getOpponent(socket).emit("begin", {
            chara: player[getOpponent(socket).id].chara,
        });
    }

    socket.on("nickname", function(data){
        io.sockets.emit("nickname", data);
    });

    socket.on("chat", function(data) {
        io.sockets.emit("chat", data);
    });

    socket.on("disconnect", function(){
        userOnline--;
        console.log("User Out");
        io.sockets.emit("userOnline", userOnline);
    });
});

function joinGame(socket) {
    player[socket.id] = {
        opponent: unmatched,
        chara: "./white.png",
        socket: socket,
    };
    if (unmatched) {
        player[socket.id].chara = "./black.png";
        player[unmatched].opponent = socket.id;
        unmatched = null;
    } else {
        unmatched = socket.id;
    }
}

function getOpponent(socket) {
    if (!player[socket.id].opponent) {
        return;
    }
    return player[player[socket.id].opponent].socket;
}