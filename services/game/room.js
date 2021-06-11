const Board = require('./board')
const Pawn = require('./pawn')
const Player = require('./player')

class Room {
    static BEFORE_GAME = 'before'
    static IN_GAME = 'in_game'
    static AFTER_GAME = 'after'

    constructor(player, id) {
        this.id = id
        this.firstPlayer = player
        this.setCurrentPlayer(player)
        this.statusRoom = Room.BEFORE_GAME
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
        this.statusRoom = Room.IN_GAME
        this.broadcastAllPlayers('play', this.createMessage(id))
    }

    putPawn(to) {
        if (this.board.squares[to.x][to.y].isEmpty()) {
            this.board.squares[to.x][to.y].setPawn(new Pawn(this.currentPlayer, to.x, to.y))
            return true
        }
        return false
    }

    movePawn(from, to) {
        if (this.board.squares[from.x][from.y].isEmpty()){
            return false
        }

        if (this.board.squares[from.x][from.y].getPawn().getPlayer().getAllData().status !== this.currentPlayer.getAllData().status){
            return false
        }

        if (!this.board.squares[to.x][to.y].isEmpty()){
            return false
        }

        if (!((Math.abs(from.y - to.y) === 1 && from.x === to.x)
            || (Math.abs(from.x - to.x) === 1 && from.y === to.y)
            || (Math.abs(from.y - to.y) === 1 && Math.abs(from.x - to.x) === 1))){
            return false
        }

        this.board.squares[to.x][to.y].setPawn(this.board.squares[from.x][from.y].getPawn())
        this.board.squares[from.x][from.y].empty()
        return true
    }

    checkWinner() {
        for (let i = 0; i < 3; i++) {
            if (this.board.squares[0][i].getPawn() !== undefined && this.board.squares[1][i].getPawn() !== undefined && this.board.squares[2][i].getPawn() !== undefined){
                if (this.board.squares[0][i].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST
                    && this.board.squares[1][i].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST
                    && this.board.squares[2][i].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST) {
                    this.winner = this.board.squares[0][i].getPawn().getPlayer()
                    this.finished = true
                    this.statusRoom = Room.AFTER_GAME
                }

                if (this.board.squares[0][i].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND
                    && this.board.squares[1][i].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND
                    && this.board.squares[2][i].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND) {
                    this.winner = this.board.squares[0][i].getPawn().getPlayer()
                    this.finished = true
                    this.statusRoom = Room.AFTER_GAME
                }
            }

            if (this.board.squares[i][0].getPawn() !== undefined && this.board.squares[i][1].getPawn() !== undefined && this.board.squares[i][2].getPawn() !== undefined){
                if (this.board.squares[i][0].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST
                    && this.board.squares[i][1].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST
                    && this.board.squares[i][2].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST) {
                    this.winner = this.board.squares[i][0].getPawn().getPlayer()
                    this.finished = true
                    this.statusRoom = Room.AFTER_GAME
                }

                if (this.board.squares[i][0].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND
                    && this.board.squares[i][1].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND
                    && this.board.squares[i][2].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND) {
                    this.winner = this.board.squares[i][0].getPawn().getPlayer()
                    this.finished = true
                    this.statusRoom = Room.AFTER_GAME
                }
            }
        }

        if (this.board.squares[0][0].getPawn() !== undefined && this.board.squares[1][1].getPawn() !== undefined && this.board.squares[2][2].getPawn() !== undefined){
            if (this.board.squares[0][0].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST
                && this.board.squares[1][1].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST
                && this.board.squares[2][2].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST) {
                this.winner = this.board.squares[0][0].getPawn().getPlayer()
                this.finished = true
                this.statusRoom = Room.AFTER_GAME
            }

            if (this.board.squares[0][0].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND
                && this.board.squares[1][1].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND
                && this.board.squares[2][2].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND) {
                this.winner = this.board.squares[0][0].getPawn().getPlayer()
                this.finished = true
                this.statusRoom = Room.AFTER_GAME
            }
        }

        if (this.board.squares[2][0].getPawn() !== undefined && this.board.squares[1][1].getPawn() !== undefined && this.board.squares[0][2].getPawn() !== undefined){
            if (this.board.squares[2][0].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST
                && this.board.squares[1][1].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST
                && this.board.squares[0][2].getPawn().getPlayer().getAllData().status === Player.STATUS_FIRST) {
                this.winner = this.board.squares[2][0].getPawn().getPlayer()
                this.finished = true
                this.statusRoom = Room.AFTER_GAME
            }

            if (this.board.squares[2][0].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND
                && this.board.squares[1][1].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND
                && this.board.squares[0][2].getPawn().getPlayer().getAllData().status === Player.STATUS_SECOND) {
                this.winner = this.board.squares[2][0].getPawn().getPlayer()
                this.finished = true
                this.statusRoom = Room.AFTER_GAME
            }
        }

        return false
    }

    createMessage() {
        if (this.statusRoom === Room.IN_GAME) {
            return {
                status: this.statusRoom,
                data: {
                    room_id: this.id,
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
                    room_id: this.id,
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
                    room_id: this.id,
                    players: {
                        first: this.firstPlayer.getAllData(),
                        second: this.secondPlayer.getAllData()
                    },
                    board: this.board.getReadableBoard(),
                    winner: this.winner.getAllData()
                }
            }
        }
    }

    switchPlayer(){
        if (this.currentPlayer.getAllData().status === Player.STATUS_FIRST){
            this.getFirstPlayer().counter++
            if (this.getFirstPlayer().counter === 3)
                this.getFirstPlayer().phase = Player.PHASE_MOVE
            this.currentPlayer = this.getSecondPlayer()
        }else{
            this.getSecondPlayer().counter++
            if (this.getSecondPlayer().counter === 3)
                this.getSecondPlayer().phase = Player.PHASE_MOVE
            this.currentPlayer = this.getFirstPlayer()
        }
    }
}

module.exports = Room
