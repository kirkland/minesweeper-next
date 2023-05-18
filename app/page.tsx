import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Welcome! </h1>
      <p>
        <Link href="/minesweeper">Play Minesweeper</Link>
      </p>
    </main>
  );
}
