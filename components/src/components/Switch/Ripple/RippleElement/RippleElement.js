import styles from "./RippleElement.module.scss";
import { CSSTransition } from "react-transition-group";
function RippleElement() {
  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={{ appear: 0, enter: 500 }}
      classNames={{
        appearDone: "ripple-appear",
        enter: styles.rippleEnter,
        enterDone: styles.rippleEnterDone,
      }}
    >
      <span className={styles.rippleElement}></span>
    </CSSTransition>
  );
}

export default RippleElement;
