const square = require('./square')

class Board {
    constructor(){
        this.squares = []
        for (let i = 0; i < 3; i++) {
            let row = []
            for (let j = 0; j < 3; j++) {
                row.push(new square)
            }
            this.squares.push(row)
        }
    }

    getSquares(){
        return this.squares
    }

    getReadableBoard(){
        let board = []
        for (let i = 0; i < 3; i++){
            let row = []
            for (let j = 0; j < 3; j++) {
                if (this.squares[i][j].isEmpty())
                    row.push(null)
                else
                    row.push(this.board[i][j].getPawn().getPlayer().getAllData())
            }
            board.push(row)
        }
        return board
    }
}

module.exports = Board