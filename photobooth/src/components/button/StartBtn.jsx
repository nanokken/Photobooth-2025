import styles from "./button.module.css"

export default function StartBtn({onClick}) {

    return(
        <div className={styles.buttonContainer}>
            <button className={styles.btnSubmit} onClick={onClick}>
            <p>Start</p>
            </button>
            <div className={styles.vertRibbon}></div>
            <div className={styles.horiRibbon}></div>
            <img
            src="/images/ribbonBow.png"
            alt="bow"
            className={styles.ribbonBow}
            />
        </div>
    )
}