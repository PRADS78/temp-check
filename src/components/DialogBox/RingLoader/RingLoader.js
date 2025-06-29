import styles from "./RingLoader.module.scss";
function RingLoader() {
  return (
    <div className={styles.ringLoader}>
      <div className={styles.ring}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default RingLoader;
