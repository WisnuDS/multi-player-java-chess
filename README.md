# Socket Chess Game 
This game is a game that is often played by children on the island of Java. The game model is similar to titaktoe and chess where the player can move the pieces. Players will win if they can arrange the pieces into one straight line vertically, horizontally or diagonally

---

## Event Server

server events are events that are available on the server. You can make a request on the server with the following event


### new-game

`new-game` is an event that can be used at the beginning of the game to create and join rooms. The data required for this request are as follows:

```
{
    name: 'Iqbal'
}
```


### in-game

`in-game` is an event that is used during the game. All input logic and filtering is present at this event. The data required for this request are as follows:

```
{
    room_id : 12,
    player: {
        name: 'Iqbal',
        status: 'FIRST'/'SECOND'
    },
    turn: 'A2'
}
```


### chat

`chat` is an event that is used to have a conversation with an opponent. The data required for this request are as follows:

```
{
    room_id : 12,
    player: {
        name: 'Iqbal',
        status: 'FIRST'/'SECOND'
    },
    message: 'Hi, you can't beat me'
}
```

---