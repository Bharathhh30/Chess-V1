import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME , MOVE } from "./messages.js";

export class Game {
    player1;
    player2;
    board;
    #startTime;
    #moveCount = 0;

    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.#startTime = Date.now();
        // when the game is created, we need to send the board to both players and let them know their colors
        this.player1.send(JSON.stringify({
            type : INIT_GAME,
            payload : {
                color : 'white',
            }
        }))
        this.player2.send(JSON.stringify({
            type : INIT_GAME,
            payload : {
                color : 'black',
            }
        }))
    }

    makeMove(socket,move){
        // validation here , whether the move is valid or not
        // validate the type of move using zod 

        if (this.#moveCount % 2 === 0 && socket !==this.player1){ // if the move is even then player1 should make the move
            return;
        }
        if (this.#moveCount % 2 === 1 && socket !==this.player2){ // if the move is odd then player2 should make the move
            return;
        }
        try{
            this.board.move(move);
            // this.#moveCount++;
        }catch(e){
            console.log(e)
            return;
        }


        // update the board - library is handling
        // push the move to the moves array

        // check if the game is over
        if (this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn() === 'w' ? 'black' : 'white',
                }
            }))
            this.player2.send(JSON.stringify({
                type : GAME_OVER,
                payload : {
                    winner : this.board.turn() === 'w' ? 'black' : 'white',
                }
            }))
        }

        if (this.#moveCount %2===0){
            this.player2.send(JSON.stringify({
                type : MOVE,
                payload : move
            }))
        }else{
            this.player1.send(JSON.stringify({
                type : MOVE,
                payload : move
            }))
        }

        // send the updated board to both players
        this.#moveCount++;

    }
}