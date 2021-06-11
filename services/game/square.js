class Square{
    setPawn(pawn){
        this.pawn = pawn
    }

    getPawn(){
        return this.pawn
    }

    isEmpty(){
        return this.pawn === undefined
    }

    empty(){
        this.pawn = undefined
    }
}

module.exports = Square
