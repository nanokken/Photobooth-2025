import styles from "./baubles.module.css"

export default function Baubles() {

    return( 
        <div className={styles.baubles}>
            <div className={`${styles.bauble} ${styles.grey}`}></div>
            <div className={`${styles.bauble} ${styles.yellow}`}></div>
        </div>
    )

}