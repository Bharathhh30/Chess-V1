// we neeed to have user and game class

import { Game } from "./Game.js";
import { INIT_GAME, MOVE } from "./messages.js";

export class GameManager{
    // defining private games variable
    #games = [];
    #pendingUser=null;
    #users = [];

    constructor(){
        this.#games = [];
        this.#pendingUser = null;
        this.#users = [];
    }

    addUser(socket){
        this.#users.push(socket);
        this.#addHandler(socket);
    }

    removeUser(socket){
        this.#users = this.#users.filter(user=>user!==socket)
        // stop the game here as the user left
    }

    #addHandler(socket){
        socket.on('message',(data)=>{
            const message = JSON.parse(data);

            if (message.type === INIT_GAME){
                if (this.#pendingUser){
                    // start the game
                    const game = new Game(this.#pendingUser,socket);
                    this.#games.push(game);
                }else{
                    this.#pendingUser = socket;
                }
            }

            if (message.type === MOVE){
                const game = this.#games.find(game => game.player1 === socket || game.player2 === socket);
                if (game){
                    game.makeMove(socket,message.move); //socket ane user is tying to make a message.move move
                }
            }
        })
    }
}