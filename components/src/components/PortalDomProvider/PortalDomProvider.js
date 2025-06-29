import { useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./PortalDomProvider.module.scss";

const PortalDomProvider = ({ children, ctrCls }) => {
  const [isPortalCreated, setIsPortalCreated] = useState(false);

  useLayoutEffect(() => {
    const body = document.querySelector("body");
    const isPopperCreated = document.getElementById("disprz-popper");
    if (isPopperCreated) {
      setIsPortalCreated(true);
      return;
    }
    const popperContainer = document.createElement("div");
    popperContainer.id = "disprz-popper";
    popperContainer.className = `${styles.portalContainer} ${ctrCls}`;
    body.appendChild(popperContainer);
    setIsPortalCreated(true);
    return () => {
      body.removeChild(popperContainer);
    };
  }, [ctrCls]);

  return isPortalCreated ? children : null;
};

PortalDomProvider.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node.isRequired,
  /**
   * The class name of the container.
   */
  ctrCls: PropTypes.string,
};

PortalDomProvider.defaultProps = {
  ctrCls: "",
};

export default PortalDomProvider;
