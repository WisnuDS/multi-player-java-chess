const Board = require('./board')
const Pawn = require('./pawn')
const Player = require('./player')

class Room {
    static BEFORE_GAME = 'before'
    static IN_GAME = 'in_game'
    static AFTER_GAME = 'after'

    constructor(player) {
        this.firstPlayer = player
        this.setCurrentPlayer(player)
        this.statusRoom = Room.IN_GAME
        this.winner = null
        this.finished = false
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

    broadcastDifferentMessage(event, firstMessage, secondMessage) {
        this.firstPlayer.send(event, firstMessage)
        this.secondPlayer.send(event, secondMessage)
    }

    play(id) {
        this.board = new Board
        this.broadcastAllPlayers('play', this.createMessage(id))
    }

    putPawn(to) {
        if (this.board[to.x][to.y].isEmpty()) {
            this.board[to.x][to.y].setPawn(new Pawn(this.currentPlayer, to.x, to.y))
            return true
        }
        return false
    }

    movePawn(from, to) {
        if (this.board[from.x][from.y].isEmpty()){
            return false
        }

        if (this.board[from.x][from.y].getPlayer().getAllData().status !== this.currentPlayer.getAllData().status){
            return false
        }

        if (!this.board[to.x][to.y].isEmpty()){
            return false
        }

        if (!((Math.abs(from.y - to.y) === 1 && from.x === to.x)
            || (Math.abs(from.x - to.x) === 1 && from.y === to.y)
            || (Math.abs(from.y - to.y) === 1 && Math.abs(from.x - to.x) === 1))){
            return false
        }

        this.board[to.x][to.y].setPawn(this.board[from.x][from.y].getPawn())
        this.board[from.x][from.y].empty()
    }

    checkWinner() {
        for (let i = 0; i < 3; i++) {
            if (this.board[0][i] !== null && this.board[1][i] !== null && this.board[2][i] !== null){
                if (this.board[0][i].getPlayer().getAllData().status === Player.STATUS_FIRST
                    && this.board[1][i].getPlayer().getAllData().status === Player.STATUS_FIRST
                    && this.board[2][i].getPlayer().getAllData().status === Player.STATUS_FIRST) {
                    this.winner = this.board[0][i].getPlayer()
                    this.finished = true
                    this.statusRoom = Room.AFTER_GAME
                }

                if (this.board[0][i].getPlayer().getAllData().status === Player.STATUS_SECOND
                    && this.board[1][i].getPlayer().getAllData().status === Player.STATUS_SECOND
                    && this.board[2][i].getPlayer().getAllData().status === Player.STATUS_SECOND) {
                    this.winner = this.board[0][i].getPlayer()
                    this.finished = true
                    this.statusRoom = Room.AFTER_GAME
                }
            }

            if (this.board[i][0] !== null && this.board[i][1] !== null && this.board[i][2] !== null){
                if (this.board[i][0].getPlayer().getAllData().status === Player.STATUS_FIRST
                    && this.board[i][1].getPlayer().getAllData().status === Player.STATUS_FIRST
                    && this.board[i][2].getPlayer().getAllData().status === Player.STATUS_FIRST) {
                    this.winner = this.board[i][0].getPlayer()
                    this.finished = true
                    this.statusRoom = Room.AFTER_GAME
                }

                if (this.board[i][0].getPlayer().getAllData().status === Player.STATUS_SECOND
                    && this.board[i][1].getPlayer().getAllData().status === Player.STATUS_SECOND
                    && this.board[i][2].getPlayer().getAllData().status === Player.STATUS_SECOND) {
                    this.winner = this.board[i][0].getPlayer()
                    this.finished = true
                    this.statusRoom = Room.AFTER_GAME
                }
            }
        }

        if (this.board[0][0] !== null && this.board[1][1] !== null && this.board[2][2] !== null){
            if (this.board[0][0].getPlayer().getAllData().status === Player.STATUS_FIRST
                && this.board[1][1].getPlayer().getAllData().status === Player.STATUS_FIRST
                && this.board[2][2].getPlayer().getAllData().status === Player.STATUS_FIRST) {
                this.winner = this.board[0][0].getPlayer()
                this.finished = true
                this.statusRoom = Room.AFTER_GAME
            }

            if (this.board[0][0].getPlayer().getAllData().status === Player.STATUS_SECOND
                && this.board[1][1].getPlayer().getAllData().status === Player.STATUS_SECOND
                && this.board[2][2].getPlayer().getAllData().status === Player.STATUS_SECOND) {
                this.winner = this.board[0][0].getPlayer()
                this.finished = true
                this.statusRoom = Room.AFTER_GAME
            }
        }

        if (this.board[2][0] !== null && this.board[1][1] !== null && this.board[0][2] !== null){
            if (this.board[2][0].getPlayer().getAllData().status === Player.STATUS_FIRST
                && this.board[1][1].getPlayer().getAllData().status === Player.STATUS_FIRST
                && this.board[0][2].getPlayer().getAllData().status === Player.STATUS_FIRST) {
                this.winner = this.board[2][0].getPlayer()
                this.finished = true
                this.statusRoom = Room.AFTER_GAME
            }

            if (this.board[2][0].getPlayer().getAllData().status === Player.STATUS_SECOND
                && this.board[1][1].getPlayer().getAllData().status === Player.STATUS_SECOND
                && this.board[0][2].getPlayer().getAllData().status === Player.STATUS_SECOND) {
                this.winner = this.board[2][0].getPlayer()
                this.finished = true
                this.statusRoom = Room.AFTER_GAME
            }
        }

        return false
    }

    createMessage(id) {
        if (this.statusRoom === Room.IN_GAME) {
            return {
                status: this.statusRoom,
                data: {
                    room_id: id,
                    board: this.board.getReadableBoard(),
                    players: {
                        first: this.firstPlayer.getAllData(),
                        second: this.secondPlayer.getAllData()
                    },
                    currentPlayer: this.currentPlayer.getAllData()
                }
            }
        } else if (this.statusRoom === Room.BEFORE_GAME) {
            return {
                status: this.statusRoom,
                data: {
                    room_id: id,
                    players: {
                        first: this.firstPlayer.getAllData(),
                    },
                    currentPlayer: this.currentPlayer.getAllData()
                }
            }
        }else if (this.statusRoom === Room.AFTER_GAME){
            return {
                status: this.statusRoom,
                data: {
                    room_id: id,
                    players: {
                        first: this.firstPlayer.getAllData(),
                        second: this.secondPlayer.getAllData()
                    },
                    winner: this.winner.getAllData()
                }
            }
        }
    }

    switchPlayer(){
        if (this.currentPlayer.getAllData().status === Player.STATUS_FIRST){
            this.currentPlayer = this.getSecondPlayer()
        }else{
            this.currentPlayer = this.getFirstPlayer()
        }
    }

}

module.exports = Room