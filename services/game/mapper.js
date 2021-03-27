class Mapper{
    static mapNumber(value){
        switch(value){
            case 1: return 2
            case 2: return 1
            case 3: return 0
        }
        return -1
    }

    static mapChar(value){
        switch(value.toLowerCase()){
            case 'a': return 0
            case 'b': return 1
            case 'c': return 2
        }
        return -1
    }
}

module.exports = Mapper