const Player = require('../game/player')
const Room = require('../game/room')

class Socket{
    init(app){
        console.log("connected")
        this.sockets = []
        this.rooms = []
        const io = require('socket.io')(app)
        io.on('connection',(socket)=>{
            this.sockets[socket.id] = socket

            socket.on('new-game', (data) => {
                if (this.rooms.length === 0){
                    this.rooms.push(new Room(new Player(data.name, socket, Player.STATUS_FIRST)))
                }else{
                    if (this.rooms[this.rooms.length - 1].isRoomAvailable()){
                        this.rooms[this.rooms.length - 1].setSecondPlayer(new Player(data.name, socket, Player.STATUS_SECOND))
                        this.rooms[this.rooms.length - 1].play(this.rooms.length - 1)
                    }else{
                        this.rooms.push(new Room(new Player(data.name, socket, Player.STATUS_FIRST)))
                    }
                }
            })
        })
    }
}

module.exports = new Socket