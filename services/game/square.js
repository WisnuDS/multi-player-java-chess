class Square{
    setPawn(pawn){
        this.pawn = pawn
    }

    getPawn(){
        return this.pawn
    }

    isEmpty(){
        return this.pawn == null || this.pawn === undefined
    }

    empty(){
        this.pawn = null
    }
}

module.exports = Square