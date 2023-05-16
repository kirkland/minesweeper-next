export type CellData = {
  adjacentBombs: number;
  bomb?: boolean;
  flagged?: boolean;
  revealed: boolean;
};

export type RowData = Array<CellData>;

export class Coordinate {
  row: number;
  column: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}

export class GameState {
  rows: RowData[];
  private rowsCount: number;
  private columnsCount: number;

  constructor(rows: RowData[]) {
    this.rows = rows;
    this.rowsCount = rows.length;
    this.columnsCount = rows[0].length;
  }

  static createInitialBoard(
    rowsCount: number,
    columnsCount: number,
    bombs: number
  ) {
    const rows: Array<RowData> = [];

    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
      const row: RowData = [];

      for (let columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
        row.push({ adjacentBombs: 0, revealed: false });
      }

      rows.push(row);
    }

    const board = new GameState(rows);

    for (let i = 0; i < bombs; i++) {
      board.addRandomBomb();
    }

    return board;
  }

  bombsRemaining() {
    let bombsCount = 0;
    let flagCount = 0;

    for (let rowIndex = 0; rowIndex < this.rowsCount; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < this.columnsCount;
        columnIndex++
      ) {
        if (this.rows[rowIndex][columnIndex].flagged) {
          flagCount += 1;
        }

        if (this.rows[rowIndex][columnIndex].bomb) {
          bombsCount += 1;
        }
      }
    }

    return bombsCount - flagCount;
  }

  clone() {
    const newRows: Array<RowData> = [];

    this.rows.forEach((row) => {
      const newRow: RowData = [];

      row.forEach((cell) => {
        newRow.push(Object.assign({}, cell));
      });

      newRows.push(newRow);
    });

    return new GameState(newRows);
  }

  flag(coordinate: Coordinate) {
    const cell = this.rows[coordinate.row][coordinate.column];

    if (cell.revealed) {
      return this;
    }

    const newBoard = this.clone();
    newBoard.rows[coordinate.row][coordinate.column].flagged =
      !newBoard.rows[coordinate.row][coordinate.column].flagged;
    return newBoard;
  }

  reveal(coordinate: Coordinate): Coordinate[] {
    const cell = this.rows[coordinate.row][coordinate.column];

    // Do nothing if the cell is already revealed or flagged
    if (cell.revealed || cell.flagged) {
      return [];
    }

    cell.revealed = true;
    const nextRevealed: Coordinate[] = [];

    if (!cell.bomb && cell.adjacentBombs === 0) {
      this.adjacentCells(coordinate).forEach((adjacentCoordinate) => {
        if (
          !this.rows[adjacentCoordinate.row][adjacentCoordinate.column].revealed
        ) {
          nextRevealed.push(adjacentCoordinate);
        }
      });
    }

    return nextRevealed;
  }

  state() {
    if (this.gameLost()) {
      return "lost";
    } else if (this.gameWon()) {
      return "won";
    } else {
      return "in progress";
    }
  }

  private addRandomBomb() {
    let bombRow: number, bombColumn: number;

    while (true) {
      bombRow = Math.floor(Math.random() * this.rowsCount);
      bombColumn = Math.floor(Math.random() * this.columnsCount);

      if (!this.rows[bombRow][bombColumn].bomb) {
        this.rows[bombRow][bombColumn].bomb = true;
        break;
      }
    }

    this.setAdjacentBombs(new Coordinate(bombRow, bombColumn));
  }

  private adjacentCells(coordinate: Coordinate) {
    const adjacentCellsIncludingNull: Array<Coordinate | null> = [
      [1, 1],
      [1, 0],
      [1, -1],
      [0, 1],
      [0, -1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ].map((offsets) => {
      const [rowOffset, columnOffset] = offsets;

      const adjacentCoordinate = new Coordinate(
        coordinate.row + rowOffset,
        coordinate.column + columnOffset
      );

      if (this.inBounds(adjacentCoordinate)) {
        return adjacentCoordinate;
      } else {
        return null;
      }
    });

    const adjacentCells: Array<Coordinate> = adjacentCellsIncludingNull.filter(
      (coordinate): coordinate is Exclude<typeof coordinate, null> =>
        !!coordinate
    );

    return adjacentCells;
  }

  private gameLost() {
    let lost = false;

    this.rows.forEach((row) => {
      row.forEach((cell) => {
        if (cell.bomb && cell.revealed) {
          lost = true;
        }
      });
    });

    return lost;
  }

  private gameWon() {
    let won = true;

    this.rows.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.revealed && !cell.bomb) {
          won = false;
        }
      });
    });

    return won;
  }

  private inBounds(coordinate: Coordinate) {
    return (
      coordinate.row >= 0 &&
      coordinate.row < this.rowsCount &&
      coordinate.column >= 0 &&
      coordinate.column < this.columnsCount
    );
  }

  private setAdjacentBombs(bombCoordinate: Coordinate) {
    this.adjacentCells(bombCoordinate).forEach((coordinate) => {
      this.rows[coordinate.row][coordinate.column].adjacentBombs =
        this.rows[coordinate.row][coordinate.column].adjacentBombs + 1;
    });
  }
}
