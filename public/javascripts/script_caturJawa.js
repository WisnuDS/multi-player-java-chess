/*
* Global Variable
* */
var socket = io()
var datachat = {}
var ROOM_ID = undefined
var BOARD = []
var PLAYER_TYPE = undefined
var PLAYER_COLOR = undefined
var PLAYERS = {}
var CURRENT_PLAYER = {}
var COUNTER = 0
var MOVEMENT = {from : '', to : ''}
var SQUARE = ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
var HELPER = []



/*
* The set of functions required
* */
function showLogin() {
    $('.login').show()
    $('.loading').hide()
    $('.game').hide()
}

function showLoading() {
    $('.login').hide()
    $('.loading').show()
    $('.game').hide()
}

function showGame() {
    $('.login').hide()
    $('.loading').hide()
    $('.game').show()
}

function mapper(a, b){
    switch (b){
        case 0 : b = '3'
            break
        case 1 : b = '2'
            break
        case 2 : b = '1'
            break
    }
    switch (a) {
        case 0 : return 'a'+b
        case 1 : return 'b'+b
        case 2 : return 'c'+b
        default : return
    }
}

function unMapper(code) {
    let x, y
    switch (code[0]){
        case 'a' : x = 0
            break
        case 'b' : x = 1
            break
        case 'c' : x = 2
            break
    }

    switch (code[1]){
        case '1' : y = 2
            break
        case '2' : y = 1
            break
        case '3' : y = 0
            break
    }

    return [x, y]
}

function showPawn(code, color) {
    $('#'+code+' .pawn')
        .removeClass('invisible')
        .removeClass('opacity-1')
        .attr('src', `/images/${color}.png`)
}

function hidePawn(code) {
    $('#'+code+' .pawn')
        .addClass('invisible')
        .removeClass('opacity-1')
}

function showHelpPawn(code, color) {
    $('#'+code+' .pawn')
        .addClass('opacity-1')
        .removeClass('invisible')
        .attr('src', `/images/${color}.png`)
}

function hideHelpPawn(code) {
    $('#'+code+' .pawn')
        .addClass('opacity-1')
        .addClass('invisible')
}

function refreshBoard() {
    console.log(BOARD)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (BOARD[i][j]){
                if (BOARD[i][j].status === 'FIRST'){
                    showPawn(mapper(i, j), 'white')
                }else {
                    showPawn(mapper(i, j), 'black')
                }
            }
            else{
                hidePawn(mapper(i, j))
            }
        }
    }
}

function refreshPlayer(){
    if (PLAYER_TYPE === 'FIRST'){
        $("#player1").text(PLAYERS.first.name);
        $("#player2").text(PLAYERS.second.name);
    } else {
        $("#player1").text( PLAYERS.second.name);
        $("#player2").text(PLAYERS.first.name);
    }
}

function refreshView(){
    refreshBoard()
    refreshPlayer()
    currentPlayerChecker()
}

function setInfo(message) {
    $('#info').text(message)
}

function currentPlayerChecker() {
    if (CURRENT_PLAYER.status === PLAYER_TYPE)
        setInfo('This in your turn')
    else
        setInfo('Your opponent turn')
}

function generateInGameMessage(from, to=undefined){
    let message = {
        room_id : ROOM_ID,
        player : {
            name : CURRENT_PLAYER.name,
            status : CURRENT_PLAYER.status
        }
    }

    if (to){
        message.turn = from.toUpperCase()+'-'+to.toUpperCase()
    }else {
        message.turn = from.toLowerCase()
    }

    return message
}

function generateChatMessage(message) {
    let player
    if (PLAYER_TYPE === 'FIRST'){
        player = PLAYERS.first
    }else {
        player = PLAYERS.second
    }
    return  {
        room_id : ROOM_ID,
        player : player,
        message : message
    }
}

function movePawn(from, to) {
    destroyHelper()
    hidePawn(from, PLAYER_COLOR)
    showPawn(to, PLAYER_COLOR)
}

function generateHelper(x, y) {
    destroyHelper()

    let xStart = x - 1
    let xEnd = x + 1
    let yStart = y - 1
    let yEnd = y + 1

    for (let i = xStart; i <= xEnd; i++) {
        for (let j = yStart; j <= yEnd; j++) {
            if (i >= 0 && i <=2 && j >= 0 && j <=2){
                if (!BOARD[i][j]){
                    HELPER.push(mapper(i, j))
                }
            }
        }
    }

    for (const helperElement of HELPER) {
        showHelpPawn(helperElement, PLAYER_COLOR)
    }
}

function destroyHelper(){
    for (const helperElement of HELPER) {
        hideHelpPawn(helperElement)
    }
    HELPER = []
}

function debug() {
    console.log({
        board : BOARD,
        player_type : PLAYER_TYPE,
        player_color : PLAYER_COLOR,
        players : PLAYERS,
        current_players : CURRENT_PLAYER,
        counter : COUNTER,
        movement : MOVEMENT,
        helper : HELPER
    })
}

function displayMessage(message) {
    $('#live-chat').append(`<div class="text-light m-1">${message.player.name} : ${message.message}</div>`)
}

/*
* Socket Event From Server
* */

socket.on('new-game', function (message) {
    CURRENT_PLAYER = message.data.currentPlayer
    PLAYERS = message.data.players
    PLAYER_TYPE = 'FIRST'
    PLAYER_COLOR = 'white'
})

socket.on('play', function (message) {
    showGame()
    BOARD = message.data.board
    CURRENT_PLAYER = message.data.currentPlayer
    PLAYERS = message.data.players
    ROOM_ID = message.data.room_id
    if (!PLAYER_TYPE){
        PLAYER_TYPE = 'SECOND'
        PLAYER_COLOR = 'black'
    }
    refreshView()
    debug()
})

socket.on('in-game', function (message){
    CURRENT_PLAYER = message.data.currentPlayer
    BOARD = message.data.board
    refreshBoard()
    currentPlayerChecker()
})

socket.on('chat', function (message) {
    displayMessage(message)
})

/*
* Game Event From user
* */
$(document).ready(function(){
    showLogin()
});

$('#button').click(function () {
    socket.emit('new-game', {name : $('#nickname').val()})
    showLoading()
})

$('#send').click(function () {
    let message = $('#text').val()
    message = generateChatMessage(message)
    if (message){
        socket.emit('chat', message)
        displayMessage(message)
        $('#text').val('')
    }
})

for (const block of SQUARE) {
    $('#'+block).click(function () {
        if (CURRENT_PLAYER.status === PLAYER_TYPE){
            let x
            x = unMapper(block)
            if (COUNTER < 3){
                if (!BOARD[x[0]][x[1]]){
                    showPawn(block, PLAYER_COLOR)
                    socket.emit('in-game', generateInGameMessage(block))
                    COUNTER++
                }
            }else {
                if (MOVEMENT.from !== ''){
                    console.log("a")
                    if (!BOARD[x[0]][x[1]] && HELPER.includes(block)){
                        MOVEMENT.to = block
                        socket.emit('in-game', generateInGameMessage(MOVEMENT.from, MOVEMENT.to))
                        movePawn(MOVEMENT.from, MOVEMENT.to)
                        MOVEMENT.from = ''
                        MOVEMENT.to = ''
                    }else {
                        MOVEMENT.from = block
                        generateHelper(x[0], x[1])
                    }
                }else {
                    if (BOARD[x[0]][x[1]]){
                        console.log("k")
                        debug()
                        MOVEMENT.from = block
                        generateHelper(x[0], x[1])
                    }
                }
            }
        }
    })
}
