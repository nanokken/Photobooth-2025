import styles from "./photobooth.module.css"

import Baubles from "../../components/baubles/Baubles";


export default function Photobooth() {

    return (
      <div className={styles.photobooth}>
        <Baubles/>
        <h1 className={styles.heading}>{`{Photo Booth}`}</h1>
        <div className={styles.photoArea}></div>
        <img src="images/photoboothDecor.png" alt="Christmas decoration" className={styles.decor} />
      </div>
    );

}