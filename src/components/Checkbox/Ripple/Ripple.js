import { useState } from "react";
import styles from "./Ripple.module.scss";
import { RippleElement } from "./RippleElement";
function Ripple() {
  const [ripples, setRipples] = useState([]);

  const onMouseDown = () => {
    setRipples([...ripples, { id: Date.now() }]);
  };

  const onMouseUp = () => {
    if (ripples.length === 1) return;
    setRipples(ripples.slice(1));
  };

  return (
    <div
      className={styles.ripple}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div className={styles.rippleContainer}>
        {ripples.map((ripple) => (
          <RippleElement key={ripple.id} />
        ))}
      </div>
    </div>
  );
}

export default Ripple;
