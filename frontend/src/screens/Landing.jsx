import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
    const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-center pt-20">
        <div className="flex flex-1 justify-evenly gap-4">
          <div className="flex justify-center pt-24">
            <img src="/chess.png" alt="chess board" className="max-w-96" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex justify-center text-white font-semibold text-3xl p-6">
              <h1>Play Chess Online</h1>
            </div>
            <div className="flex justify-center">
              <button onClick={()=> navigate("/game")} className="bg-green-500 rounded-md p-2 text-white font-semibold text-xl hover:bg-green-600">
                Play Online
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Landing;
