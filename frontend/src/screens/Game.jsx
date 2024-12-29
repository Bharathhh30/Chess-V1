import React, { useEffect, useState } from 'react';
import ChessBoard from '../components/ChessBoard';
import { Chess } from 'chess.js';

export const INIT_GAME = 'init_game';
export const MOVE = 'move';
export const GAME_OVER = 'game_over';

const Game = () => {
  const [socket, setSocket] = useState(null);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      switch (message.type) {
        case INIT_GAME:
          console.log('Game initialized');
          setChess(new Chess());
          setBoard(chess.board());
          break;
        case MOVE:
          console.log('Move made');
          const move = message.payload;
          chess.move(move);
          setBoard(chess.board());
          break;
        case GAME_OVER:
          console.log('Game over');
          break;
        default:
          console.log('Unknown message type');
      }
    };

    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const handlePlayClick = () => {
    if (socket) {
      const initGameMessage = JSON.stringify({ type: INIT_GAME });
      socket.send(initGameMessage);
      console.log('Sent message:', initGameMessage);
    }
  };

  if (!socket) {
    return <div>Connecting...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-800">
      <div className="w-3/5 p-4 flex justify-center items-center">
        <ChessBoard socket={socket} board={board} />
      </div>
      <div className="w-2/5 p-4 bg-gray-700 flex flex-col justify-between">
        <div className="flex justify-center text-white text-2xl font-semibold">
          <button onClick={handlePlayClick} className="bg-green-600 p-2 w-32 rounded-md">
            Play
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;