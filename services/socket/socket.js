const Callback = require('../game/callback')

class Socket{
    init(app){
        const io = require('socket.io')(app)
        io.on('connection',(socket)=>{
            //connect indicator
            console.log("connected")

            socket.on('new-game', (data) => {
                Callback.newGame(data, socket)
            })

            socket.on('in-game', (data) => {
                Callback.inGame(data, socket)
            })

        })
    }
}

module.exports = new Socket