class Player{
    static STATUS_FIRST = 'FIRST'
    static STATUS_SECOND = 'SECOND'

    constructor(name,socket,status) {
        this.name = name
        this.socket = socket
        this.status = status
    }

    getName() {
        return this.name
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