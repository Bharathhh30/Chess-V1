import React from "react";
import { useState } from "react";
import { MOVE } from "../screens/Game";

function ChessBoard({ socket, board }) {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  return (
    <div className="w-100 h-[650px] flex justify-center items-center">
      {" "}
      {/* Set width and height */}
      {/* <img src="/chess.png" alt="" className="max-w-full max-h-full" /> Use max-w-full and max-h-full */}
      <div className="text-white-200">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((square, j) => (
              <div
                onClick={() => {
                  if (from === null) {
                    setFrom({ x: i, y: j });
                  } else {
                    const moveFrom = from; // Use the current value of 'from'
                    const moveTo = { x: i, y: j }; // Directly create 'to'

                    socket.send(
                      JSON.stringify({
                        type: MOVE,
                        payload: {
                          from: moveFrom,
                          to: moveTo,
                        },
                      })
                    );

                    setFrom(null); // Reset 'from'
                    setTo(null); // Reset 'to'
                    console.log("Move made",from,to);
                  }
                }}
                key={j}
                className={`w-16 h-16 ${
                  (i + j) % 2 === 0 ? "bg-green-500" : "bg-white"
                }`}
              >
                <div className="w-full flex justify-center h-full">
                  <div className="h-full flex justify-center flex-col">
                    {square ? square.type : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChessBoard;
