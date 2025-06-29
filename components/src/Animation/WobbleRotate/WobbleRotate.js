import styles from "./WobbleRotate.module.scss";
import { CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
function WobbleRotate(props) {
  return (
    <CSSTransition
      in={props.in}
      timeout={400}
      appear
      classNames={{
        appearActive: styles.wobbleRotateAppearActive,
        enter: styles.wobbleRotateEnter,
        enterDone: styles.wobbleRotateEnterDone,
        exit: styles.wobbleRotateExit,
        exitDone: styles.wobbleRotateExitDone,
      }}
    >
      {props.children}
    </CSSTransition>
  );
}

WobbleRotate.propTypes = {
  in: PropTypes.bool,
  children: PropTypes.element,
};

export default WobbleRotate;
