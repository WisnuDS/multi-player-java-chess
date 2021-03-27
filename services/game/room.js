const Board = require('./board')

class Room{
    constructor(player){
        this.firstPlayer = player
        this.setCurrentPlayer(player)
    }

    setFirstPlayer(player) {
        this.firstPlayer = player
    }

    setSecondPlayer(player) {
        this.secondPlayer = player
    }

    setCurrentPlayer(player) {
        this.currentPlayer = player
    }

    getFirstPlayer() {
        return this.firstPlayer
    }

    getSecondPlayer() {
        return this.secondPlayer
    }

    getCurrentPlayer() {
        return this.currentPlayer
    }

    isFirstPlayerEmpty() {
        return this.firstPlayer == null || this.firstPlayer === undefined
    }

    isSecondPlayerEmpty() {
        return this.secondPlayer == null || this.secondPlayer === undefined
    }

    isRoomAvailable() {
        return this.isFirstPlayerEmpty() || this.isSecondPlayerEmpty()
    }

    broadcastAllPlayers(event, message) {
        this.firstPlayer.send(event, message)
        this.secondPlayer.send(event, message)
    }

    broadcastDifferentMessage(event, firstMessage, secondMessage){
        this.firstPlayer.send(event, firstMessage)
        this.secondPlayer.send(event, secondMessage)
    }

    play(id){
        this.board = new Board
        this.broadcastAllPlayers('play',this.createMessage(id))
    }

    createMessage(id){
        return {
            room_id: id,
            board: this.board.getReadableBoard(),
            players:{
                first: this.firstPlayer.getAllData(),
                second: this.secondPlayer.getAllData()
            },
            currentPlayer: this.currentPlayer.getAllData()
        }
    }
}

module.exports = Room