class Pawn{
    constructor(player){
        this.player = player
    }

    setPlayer(player){
        this.player = player
    }

    getPlayer(){
        return this.player
    }

    setX(x){
        this.x = x
    }

    setY(y){
        this.y = y
    }

    getX(){
       return this.x
    }

    getY(){
        return this.y
    }

    getCurrentPosition(){
        return {
            x : this.x,
            y : this.y
        }
    }
}

module.exports = Pawn