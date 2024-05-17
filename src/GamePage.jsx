import React, { useState, useEffect } from "react";

const GamePage = () => {
  const [balls, setBalls] = useState([]);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalClicks, setTotalClicks] = useState(0);
  const [missedClicks, setMissedClicks] = useState(0);

  useEffect(() => {
    let timer;
    if (gameStarted) {
      timer = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining((prevTime) => prevTime - 1);
        } else {
          clearInterval(timer);
          endGame();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeRemaining, gameStarted]);

  const startGame = () => {
    setGameOver(false);
    setGameStarted(true);
    setScore(0);
    setAccuracy(100);
    setTimeRemaining(30);
    setTotalClicks(0);
    setMissedClicks(0);
    generateRandomBalls();
  };

  const generateRandomBalls = () => {
    const newBalls = [];
    for (let i = 0; i < 10; i++) {
      const id = i;
      const x = Math.random() * (800 - 20);
      const y = Math.random() * (400 - 20);
      newBalls.push({ id, x, y });
    }
    setBalls(newBalls);
  };

  const generateRandomBall = () => {
    const id = `${Date.now()}_${balls.length}`;
    const x = Math.random() * (800 - 20);
    const y = Math.random() * (400 - 20);
    setBalls((prevBalls) => [...prevBalls, { id, x, y }]);
  };

  const shootBall = (ballId) => {
    if (!gameStarted || gameOver) return;
    const updatedBalls = balls.filter((ball) => ball.id !== ballId);
    const shotHit = balls.some((ball) => ball.id === ballId);
    setTotalClicks((prevClicks) => prevClicks + 1);
    if (shotHit) {
      setScore((prevScore) => prevScore + 1);
    } else {
      setMissedClicks((prevMisses) => prevMisses + 1);
    }
    setBalls(updatedBalls);
    calculateAccuracy(totalClicks + 1, shotHit ? missedClicks : missedClicks + 1);
  };

  const calculateAccuracy = (total, misses) => {
    if (total === 0) {
      setAccuracy(100);
    } else {
      setAccuracy(((total - misses) / total) * 100);
    }
  };

  const handleMiss = () => {
    if (!gameStarted || gameOver) return;
    setTotalClicks((prevClicks) => prevClicks + 1);
    setMissedClicks((prevMisses) => prevMisses + 1);
    calculateAccuracy(totalClicks + 1, missedClicks + 1);
  };

  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    setBalls([]); // Clear the balls array to make them disappear
  };

  return (
    <>
      <div className="flex justify-center">
        <button onClick={startGame} className="mt-14 mb-4 bg-blue-600 rounded-md text-white w-24">
          {gameStarted ? "RESTART" : "START"}
        </button>
      </div>


      <div className="timer text-center ">Time Remaining: {timeRemaining} seconds</div>
      <div className="game-container">
        <div
          className="game-window rounded-lg"
          onClick={handleMiss}
        >
          {balls.map((ball) => (
            <div
              key={ball.id}
              className="ball"
              style={{ left: ball.x, top: ball.y }}
              onClick={(e) => {
                e.stopPropagation();
                shootBall(ball.id);
                generateRandomBall();
              }}
            />
          ))}
        </div>
        <div className="controls text-center mt-5">
          <div className="score mt-2">Score: {score}</div>
          <div className="accuracy">Accuracy: {accuracy.toFixed(2)}%</div>
        </div>
      </div>
      {gameOver && (
        <div className="game-over text-center mt-10">
          <h2>Game Over</h2>
          <p>Your final score: {score}</p>
          <p>Your accuracy: {accuracy.toFixed(2)}%</p>
          <button onClick={startGame} className="bg-blue-600 rounded-md text-white w-24 mt-2">
            RESTART
          </button>
        </div>
      )}
    </>
  );
};

export default GamePage;
