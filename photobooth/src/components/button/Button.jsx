import styles from "./button.module.css"
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

export default function Button({ type, onClick, onClick1, onClick2 }) {
  return (
    <>
      {type === "submit" && (
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
      )}

      {type === "manageFilter" && (
        <div className={styles.prevNextContainer}>
          <button className={styles.prevFilter} onClick={onClick2}>
            <FaArrowLeft fontSize={20} color="#EEC25F" />
            <img
              src="/images/ribbonBow.png"
              alt="RibbonBow"
              className={styles.ribbonBow3}
            />
          </button>
          <button className={styles.nextFilter} onClick={onClick1}>
            <FaArrowRight fontSize={20} color="#EEC25F" />
            <img
              src="/images/ribbonBow.png"
              alt="RibbonBow"
              className={styles.ribbonBow3}
            />
          </button>
        </div>
      )}

      {type === "confirmOrDelete" && (
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
      )}
    </>
  );
}
