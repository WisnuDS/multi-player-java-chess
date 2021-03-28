class Player{
    static STATUS_FIRST = 'FIRST'
    static STATUS_SECOND = 'SECOND'
    static PHASE_PUT = 'put'
    static PHASE_MOVE = 'move'

    constructor(name,socket,status) {
        this.name = name
        this.socket = socket
        this.status = status
        this.phase = Player.PHASE_PUT
    }

    getPhase() {
        return this.phase
    }

    getAllData() {
        return {
            name: this.name,
            status: this.status
        }
    }

    send(event,data){
        this.socket.emit(event,data)
    }
}

module.exports = Player