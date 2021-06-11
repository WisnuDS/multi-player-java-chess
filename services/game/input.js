const mapper = require('./mapper')

class InputHandler {
    static PUT_TYPES = 'put'
    static MOVE_TYPES = 'move'
    static movePattern = '([a-cA-C][1-3])([-])([a-cA-C][1-3])'
    static putPattern = '([a-cA-C][1-3])'

    static parse(value){
        return{
            x : mapper.mapChar(value[0]),
            y : mapper.mapNumber(parseInt(value[1]))
        }
    }

    static isValidInput(value, type = InputHandler.MOVE_TYPES){
        if (type === InputHandler.MOVE_TYPES){
            const checker = new RegExp(InputHandler.movePattern,'g')
            return checker.test(value)
        }else{
            const checker = new RegExp(InputHandler.putPattern,'g')
            return checker.test(value)
        }
    }

    static getFrom(value, type = InputHandler.MOVE_TYPES){
        if (type === InputHandler.MOVE_TYPES){
            let split = value.split('-')
            return this.parse(split[0])
        }else{
            return this.parse(value)
        }
    }

    static getTo(value){
        let split = value.split('-')
        return this.parse(split[1])
    }
}

module.exports = InputHandler
