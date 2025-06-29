import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Accordion.module.scss";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";
function Accordion(props) {
  const componentRef = useRef();
  const [accordionHeight, setAccordionHeight] = useState(
    props.canDisableDynamicHeight
  );

  const updateHeight = useCallback(() => {
    const { height } = props.contentRef.current.getBoundingClientRect();
    setAccordionHeight(`${height}px`);
  }, [props.contentRef]);

  useEffect(
    function updateHeightOnNotice() {
      if (
        props.expanded &&
        props.contentRef.current &&
        !props.canDisableDynamicHeight
      ) {
        updateHeight();
      }
    },
    [
      props.expanded,
      props.contentRef,
      props.heightUpdateNotice,
      updateHeight,
      props.canDisableDynamicHeight,
    ]
  );

  const onEntering = () => {
    if (!props.canDisableDynamicHeight) {
      updateHeight();
    }
  };

  const onExit = () => {
    if (!props.canDisableDynamicHeight) {
      setAccordionHeight("0px");
    }
  };

  return (
    <Transition
      in={props.expanded}
      timeout={350}
      unmountOnExit
      onEntering={onEntering}
      onExit={onExit}
    >
      <div
        ref={componentRef}
        className={`${styles.accordion} ${
          props.canDisableDynamicHeight ? styles.disableDynamicHeight : ""
        } ${props.customClass}`}
        style={{
          ...props.style,
          ...(props.canDisableDynamicHeight ? { height: accordionHeight } : {}),
        }}
      >
        {props.children}
      </div>
    </Transition>
  );
}

Accordion.propTypes = {
  children: PropTypes.any,
  // ref to the content; this is used to initialize the Accordion's height
  contentRef: PropTypes.any,
  // class used for applying custom styles to this component
  customClass: PropTypes.string,
  // determines if the accordion is collapsed or expanded
  expanded: PropTypes.bool,
  // any mutable value, preferrably a number, that notifies the
  // accordion to re-render to recalculate its height
  heightUpdateNotice: PropTypes.any,
  // valid css style definitions
  style: PropTypes.object,
  canDisableDynamicHeight: PropTypes.bool,
};

Accordion.defaultProps = {
  customClass: "",
  contentRef: null,
  expanded: false,
  canDisableDynamicHeight: false,
};
export default Accordion;
