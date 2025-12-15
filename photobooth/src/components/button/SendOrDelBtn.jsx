import styles from "./button.module.css";

export default function SendOrDelBtn({onClick1, onClick2}) {


  return(
    <div className={styles.buttonContainer}>
      <button className={styles.confirm} onClick={onClick1}>
        <p>Godkend</p>
      </button>
      <button className={styles.delete} onClick={onClick2}>
        <p>Slet</p>
      </button>
      <div className={styles.vertRibbon2}></div>
      <div className={styles.horiRibbon}></div>
      <img
        src="/images/ribbonBow.png"
        alt="bow"
        className={styles.ribbonBow2}
      />
    </div>
  )
}