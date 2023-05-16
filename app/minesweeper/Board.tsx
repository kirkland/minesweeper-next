import Row from "./Row";
import styles from "./Board.module.css";
import { GameState, Coordinate } from "./game-state";

type BoardProps = {
  board: GameState;
  onClickCell: (action: string, coordinate: Coordinate) => void;
};

export default function Board(props: BoardProps) {
  const { board, onClickCell } = props;

  return (
    <div className={styles.board}>
      {board.rows.map((row, rowIndex) => (
        <Row
          row={row}
          key={rowIndex}
          rowIndex={rowIndex}
          onClickCell={onClickCell}
        />
      ))}
    </div>
  );
}
