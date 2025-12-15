import styles from "./button.module.css";
import { FaArrowRight } from "react-icons/fa";

export default function NextBtn({onClick}) {

    return(
        <button className={styles.nextFilter} onClick={onClick}>
            <FaArrowRight fontSize={20} color="#EEC25F" />
            <img
                src="/images/ribbonBow.png"
                alt="RibbonBow"
                className={styles.ribbonBow3}
            />
        </button>
    )

}