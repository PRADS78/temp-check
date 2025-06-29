import { useEffect, forwardRef, createRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

import "./ToggleSelect.scss";
import { debounce } from "../Utils";

/**
 * @deprecated
 */
const ToggleSelect = ({ items, onClick, ctrCls, activeItems }) => {
  const Underline = ({ refs, activeId, finishAnimating, animating }) => {
    const [{ x, width }, setAttributes] = useState({
      x: 0,
      width: 0,
    });

    const updateAttributes = useCallback(() => {
      if (refs && refs[activeId]) {
        setAttributes({
          x: refs[activeId].current.offsetLeft,
          width: refs[activeId].current.getBoundingClientRect().width,
        });
      }
    }, [activeId, refs]);

    // Update attributes if active route changes (or refs change)
    useEffect(() => {
      updateAttributes();
    }, [activeId, refs, updateAttributes]);

    // After window resize, recalculate
    useEffect(() => {
      const recalculateAttrs = debounce(() => {
        updateAttributes();
      }, 500);

      window.addEventListener("resize", recalculateAttrs);
      return () => {
        window.removeEventListener("resize", recalculateAttrs);
      };
    });

    return (
      <motion.div
        className="tabs-list__underline"
        animate={{
          x,
          width,
        }}
        style={{
          opacity: animating ? 1 : 0,
        }}
        onAnimationComplete={finishAnimating}
      />
    );
  };

  const Tab = forwardRef(({ active, item, animating, startAnimating }, ref) => (
    <li className="tabs-list__item" key={`tab-${item?.id}`}>
      <span
        className={`tabs-list__tab ${active ? "active" : "inactive"} ${
          animating ? "animating" : ""
        }`}
        ref={ref}
        onClick={startAnimating}
        data-name={item.name}
      >
        {item.name}
      </span>
    </li>
  ));

  const Tabs = ({ items, activeItems }) => {
    const [animating, setAnimating] = useState(false);
    const [activeItem, setActiveItem] = useState(
      activeItems?.id ? activeItems : items[0]
    );

    const tabRefs = items.reduce((acc, item) => {
      acc[item?.id] = createRef();
      return acc;
    }, {});

    const activeId = activeItem?.id;

    return (
      <>
        <div className="tabs">
          <ul
            role="tablist"
            aria-orientation="horizontal"
            className="tabs-list"
          >
            {items.map((item) => (
              <Tab
                key={item?.id}
                item={item}
                ref={tabRefs[item?.id]}
                active={activeId === item?.id}
                animating={animating}
                startAnimating={() => {
                  setAnimating(true);
                  setActiveItem(item);
                  onClick(item);
                }}
              />
            ))}
          </ul>
          <Underline
            refs={tabRefs}
            activeId={activeId}
            finishAnimating={() => setAnimating(false)}
            animating={animating}
          />
        </div>
      </>
    );
  };

  return (
    <div className={ctrCls}>
      <Tabs items={items} activeItems={activeItems} />
    </div>
  );
};

ToggleSelect.defaultProps = {
  ctrCls: "",
  onClick: () => {},
  items: [
    { name: "Apply filter for Modules", id: "id1" },
    { name: "Apply filters for Artefacts", id: "id2" },
  ],
  activeItems: {},
};

ToggleSelect.propTypes = {
  /**
   * Specify ctrCls for the toggle select parent class name
   */
  ctrCls: PropTypes.string,
  /**
   * onClick is a function provides the toggle select value when change action performs
   */
  onClick: PropTypes.func.isRequired,
  /**
   * Specify items array of value to render toggle options
   * items: [
   * { name: "Apply filter for Modules", id: "id1" },
   * { name: "Apply filters for Artefacts", id: "id2" },
   * ]
   */
  items: PropTypes.array.isRequired,
  /*
   * active items to select defauld
   { name: "Apply filter for Modules", id: "id1" }
   */
  activeItems: PropTypes.object,
};

export default ToggleSelect;
