const Player = require('./player')
const Room = require('./room')
const Input = require('./input')

class Callback{
    static sockets = []
    static rooms = []
    static newGame(data, socket){
        if (Callback.rooms.length === 0){
            let newPlayer = new Player(data.name, socket, Player.STATUS_FIRST)
            let newRoom = new Room(newPlayer, Callback.rooms.length)
            Callback.rooms.push(newRoom)
            newPlayer.send('new-game', newRoom.createMessage())
        }else{
            if (Callback.rooms[Callback.rooms.length - 1].isRoomAvailable()){
                Callback.rooms[Callback.rooms.length - 1].setSecondPlayer(new Player(data.name, socket, Player.STATUS_SECOND))
                Callback.rooms[Callback.rooms.length - 1].play(Callback.rooms.length - 1)
            }else{
                let newPlayer = new Player(data.name, socket, Player.STATUS_FIRST)
                let newRoom = new Room(newPlayer, Callback.rooms.length-1)
                Callback.rooms.push(newRoom)
                newPlayer.send('new-game', newRoom.createMessage())
            }
        }
        console.log(this.rooms)
    }

    static inGame(data,socket){
        if (Callback.rooms.length > data.room_id ){
            let room = Callback.rooms[data.room_id]
            let requestPlayer = data.player
            if (room.getCurrentPlayer().getAllData().status === requestPlayer.status){
                let player = room.getCurrentPlayer()
                if (player.getPhase() === Player.PHASE_PUT){
                    if (Input.isValidInput(data.turn, Input.PUT_TYPES)){
                        let to = Input.getFrom(data.turn, Input.PUT_TYPES)
                        let indicator = room.putPawn(to, player)
                        if (indicator){
                            let findWinner = room.checkWinner()
                            if (findWinner){
                                room.broadcastAllPlayers('finish', room.createMessage(data.room_id))
                            }else{
                                room.switchPlayer()
                                room.broadcastAllPlayers('in-game', room.createMessage(data.room_id))
                            }
                        }else{
                            socket.emit('error',Callback.createErrorMessage("Invalid move"))
                        }
                    }else{
                        socket.emit('error',Callback.createErrorMessage("Invalid input"))
                    }
                }else{
                    if (Input.isValidInput(data.turn)){
                        let from = Input.getFrom(data.turn)
                        let to = Input.getTo(data.turn)
                        let indicator = room.movePawn(from, to, player)
                        if (indicator){
                            let findWinner = room.checkWinner()
                            if (findWinner){
                                room.broadcastAllPlayers('finish', room.createMessage(data.room_id))
                            }else{
                                room.switchPlayer()
                                room.broadcastAllPlayers('in-game', room.createMessage(data.room_id))
                            }
                        }else{
                            socket.emit('error',Callback.createErrorMessage("Invalid Move"))
                        }
                    }else{
                        socket.emit('error',Callback.createErrorMessage("Invalid Input"))
                    }
                }
            }else{
                socket.emit('error',Callback.createErrorMessage("it's not your turn"))
            }
        }else{
            socket.emit('error',Callback.createErrorMessage("Invalid room"))
        }
    }

    static chatInGame(data, socket) {
        console.log(data)
        if (Callback.rooms.length > data.room_id ){
            let room = Callback.rooms[data.room_id]
            if (data.player.status === Player.STATUS_FIRST){
                room.getSecondPlayer().socket.emit('chat', data)
            }else{
                room.getFirstPlayer().socket.emit('chat', data)
            }
        }else{
            socket.emit('error', Callback.createErrorMessage("Invalid Room"))
        }
    }


    static createErrorMessage(message){
        return {
            status: 'error',
            message: message
        }
    }
}

module.exports = Callback
