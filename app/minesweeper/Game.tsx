"use client";

import { useState } from "react";

import { Coordinate, GameState } from "./game-state";
import Board from "./Board";
import Controls from "./Controls";
import styles from "./Game.module.css";

export default function Game() {
  const rows = 9;
  const columns = 9;
  const bombs = 10;

  const onClickCell = (action: string, coordinate: Coordinate) => {
    if (board.state() !== "in progress") {
      return;
    }

    if (action === "reveal") {
      revealCells([coordinate]);
    } else if (action === "flag") {
      updateBoard((board) => {
        return board.flag(coordinate);
      });
    }
  };

  const revealCells = (cells: Coordinate[]) => {
    updateBoard((board: GameState) => {
      let nextRevealed: Coordinate[] = [];
      const newBoard = board.clone();

      cells.forEach((coordinate) => {
        nextRevealed = nextRevealed.concat(newBoard.reveal(coordinate));
      });

      if (nextRevealed.length > 0) {
        setTimeout(() => {
          revealCells(nextRevealed);
        }, 100);
      }

      return newBoard;
    });
  };

  const startNewGame = () => {
    updateBoard(GameState.createInitialBoard(rows, columns, bombs));
  };

  const [board, updateBoard] = useState(
    GameState.createInitialBoard(rows, columns, bombs)
  );

  let message: string;

  if (board.state() === "lost") {
    message = "Sorry, you lost.";
  } else if (board.state() === "won") {
    message = "Hurray, you won!";
  } else {
    message = "Best of luck!";
  }

  return (
    <div className={styles.game}>
      <Controls
        bombsRemaining={board.bombsRemaining()}
        message={message}
        startNewGame={startNewGame}
      />
      <Board board={board} onClickCell={onClickCell} />
    </div>
  );
}
