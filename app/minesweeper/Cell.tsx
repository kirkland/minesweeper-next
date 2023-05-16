import { MutableRefObject, ReactElement, useRef, useState } from "react";
import Image from "next/image";

import { CellData, Coordinate } from "./game-state";
import bomb from "./assets/images/bomb.png";
import flag from "./assets/images/flag.png";
import styles from "./Cell.module.css";

type CellProps = {
  state: CellData;
  coordinate: Coordinate;
  onClickCell: (button: string, coordinate: Coordinate) => void;
};

export default function Cell(props: CellProps) {
  const { state, coordinate, onClickCell } = props;

  const cellRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  // TODO: What is correct type for this?
  const timerRef: MutableRefObject<any> = useRef(null);

  const [touching, setTouching] = useState(false);
  const [touchAction, setTouchAction] = useState("reveal");

  const rightClickHandler = (event: React.MouseEvent) => {
    event.preventDefault();

    // Long press on mouse or mobile; do not interrupt
    if (touching) {
      return;
    }

    const action = event.type === "click" ? "reveal" : "flag";

    onClickCell(action, coordinate);
  };

  const resetTouchState = () => {
    clearTimeout(timerRef.current);
    setTouching(false);
    setTouchAction("reveal");
  };

  const startPressTimer = () => {
    timerRef.current = setTimeout(() => {
      setTouchAction("flag");
    }, 300);
  };

  const pointerDownHandler = (event: React.PointerEvent) => {
    // This indicates a mouse right click
    if (event.button === 2) {
      return;
    }

    if (event.isPrimary) {
      startPressTimer();
      setTouching(true);
    }
  };

  const pointerUpHandler = (event: React.PointerEvent) => {
    event.preventDefault();

    // touching will have been set to false if user dragged the pointer outside of the cell
    if (touching) {
      onClickCell(touchAction, coordinate);
    }

    resetTouchState();
  };

  const pointerLeaveHandler = (event: React.PointerEvent) => {
    setTouching(false);
  };

  const pointerCancelHandler = (event: React.PointerEvent) => {
    resetTouchState();
  };

  let cellClass = `${styles.cell} `;
  let content: ReactElement = <div />;

  if (state.flagged) {
    cellClass += styles.cellFlagged;
    content = <Image alt="flag" src={flag} />;
  } else if (state.revealed) {
    cellClass += `${styles.cellRevealed} `;
    content = <>{state.adjacentBombs}</>;

    if (state.bomb) {
      cellClass += styles.cellRevealedBomb;
      content = <Image alt="bomb" src={bomb} />;
    }
  } else if (touching && touchAction === "flag") {
    cellClass += `${styles.cellFlagging}`;
  }

  return (
    <div
      className={cellClass}
      onContextMenu={rightClickHandler}
      onPointerDown={pointerDownHandler}
      onPointerUp={pointerUpHandler}
      onPointerLeave={pointerLeaveHandler}
      onPointerCancel={pointerCancelHandler}
      ref={cellRef}
    >
      <div className={styles.contentHolder}>{content}</div>
    </div>
  );
}
