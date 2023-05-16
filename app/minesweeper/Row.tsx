import Cell from "./Cell";
import styles from "./Row.module.css";

import { Coordinate, RowData } from "./game-state";

type RowProps = {
  row: RowData;
  rowIndex: number;
  onClickCell: (action: string, coordinate: Coordinate) => void;
};

export default function Row(props: RowProps) {
  const { row, rowIndex, onClickCell } = props;

  return (
    <div className={styles.row}>
      {row.map((cell, columnIndex) => (
        <Cell
          state={cell}
          key={columnIndex}
          coordinate={new Coordinate(rowIndex, columnIndex)}
          onClickCell={onClickCell}
        />
      ))}
    </div>
  );
}
