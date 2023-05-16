type ControlProps = {
  bombsRemaining: number;
  message: string;
  startNewGame: () => void;
};

export default function Controls(props: ControlProps) {
  const { bombsRemaining, message, startNewGame } = props;

  return (
    <>
      <p>{message}</p>
      <div id="game-status">
        <div id="bombs-remaining-container">
          <div id="bombs-remaining">{bombsRemaining}</div>
        </div>
        <div id="new-game-container">
          <button id="new-game" onClick={startNewGame}>
            New Game
          </button>
        </div>
      </div>
    </>
  );
}
