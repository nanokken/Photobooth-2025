import styles from "./button.module.css";
import { FaArrowLeft } from "react-icons/fa";

export default function PrevBtn({onClick}) {

    return (
        <button className={styles.prevFilter} onClick={onClick}>
            <FaArrowLeft fontSize={20} color="#EEC25F" />
            <img
                src="/images/ribbonBow.png"
                alt="RibbonBow"
                className={styles.ribbonBow3}
            />
        </button>
    )


}