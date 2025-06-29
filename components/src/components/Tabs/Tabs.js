import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./Tabs.module.scss";
import PropTypes from "prop-types";
import { ArrowDownIcon } from "../../Icons";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import useWindowResize from "../../hooks/useWindowResize";
import { debounce } from "lodash";
import Badges from "../Badges/Badges";

const Tabs = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Tabs");
    invariantUniqueId(props.uniqueId, "Tabs");
  }, [automationIdPrefix, props.uniqueId]);

  const { onTabChange } = props;
  const labelContainerRef = useRef();
  const panelsRef = useRef();
  const scrollableContainerRef = useRef();
  const [activeTabIndex, setActiveTabIndex] = useState(
    !props.defaultTabId
      ? 0
      : props.data.findIndex((tab) => tab.id === props.defaultTabId)
  );
  const [indicatorReRenderKey, setIndicatorReRenderKey] = useState(Date.now());
  const [leftScrollDisabled, setLeftScrollDisabled] = useState(true);
  const [rightScrollDisabled, setRightScrollDisabled] = useState(false);
  const isTabArrowEnabled =
    labelContainerRef.current?.scrollWidth >
    Math.round(labelContainerRef.current?.getBoundingClientRect().width);
  const isActiveTabDisabled = props.data[activeTabIndex].isDisabled;
  const [panelWidth, setPanelWidth] = useState(
    panelsRef.current?.getBoundingClientRect().width || 0 * -activeTabIndex
  );
  const animationRef = useRef();

  const [activeTabStyle, setActiveTabStyle] = useState({});

  const [badges, setBadges] = useState(
    props.data.map((data) => {
      if (data.initialBadge) {
        return {
          id: data.id,
          badge: data.initialBadge,
        };
      } else {
        return {
          id: data.id,
          badge: -1,
        };
      }
    })
  );

  useEffect(() => {
    getActiveTabIndicatorStyle();
  }, [getActiveTabIndicatorStyle, activeTabIndex]);

  const navigate = useCallback(
    (tabId) => {
      const activeIndex = props.data.findIndex((tab) => tab.id === tabId);
      if (activeIndex !== -1) {
        setActiveTabIndex(activeIndex);
        const panelContainerWidth =
          panelsRef.current?.getBoundingClientRect().width || 0;
        setPanelWidth(panelContainerWidth * -activeIndex);
      }
    },
    [props.data]
  );

  useImperativeHandle(
    ref,
    () => ({
      navigate,
    }),
    [navigate]
  );

  useEffect(
    function notifyOnTabChange() {
      onTabChange(props.data[activeTabIndex]);
    },
    [activeTabIndex, onTabChange, props.data]
  );

  const getActiveTabIndicatorStyle = useCallback(() => {
    if (!labelContainerRef.current) return {};
    const labelLists = labelContainerRef.current.children;

    const insetInlineStart =
      [...Array(activeTabIndex).keys()].reduce((acc, curr) => {
        return acc + labelLists[curr].getBoundingClientRect().width;
      }, 0) +
      24 +
      "px";
    const width =
      labelLists[activeTabIndex].getBoundingClientRect().width - 48 + "px";
    const disabledStyle = isActiveTabDisabled
      ? { backgroundColor: "transparent" }
      : {};
    setActiveTabStyle({
      insetInlineStart,
      width,
      ...disabledStyle,
    });
    const panelContainerWidth =
      panelsRef.current?.getBoundingClientRect().width || 0;
    setPanelWidth(panelContainerWidth * -activeTabIndex);
  }, [activeTabIndex, isActiveTabDisabled]);

  const renderLabels = useCallback(() => {
    const onLabelClick = (event, activeIndex) => {
      const scrollable = scrollableContainerRef.current;
      const scrollableLeft = scrollable.getBoundingClientRect().left;
      const targetLeft =
        event.target.getBoundingClientRect().left - scrollableLeft;
      const targetRight =
        event.target.getBoundingClientRect().right - scrollableLeft;

      // this evaluates to true if the active tab is only partially visible from the left
      if (targetLeft < 0) {
        const tabNodes = scrollable.children[0].children;
        const tabs = Array.prototype.slice.call(tabNodes, 0, activeIndex);
        const preceedingTabsWidth = tabs.reduce((acc, curr) => {
          return acc + curr.getBoundingClientRect().width;
        }, 0);

        if (getPageDirection() === "ltr") {
          scrollable.scroll({
            left: preceedingTabsWidth,
            behavior: "smooth",
          });
        } else {
          const targetWidth = event.target.getBoundingClientRect().width;
          scrollable.scroll({
            left: scrollable.offsetWidth - preceedingTabsWidth - targetWidth,
            behavior: "smooth",
          });
        }
      }

      // this evaluates to true only if the active tab is partially visible from the right
      if (targetRight > scrollable.offsetWidth) {
        scrollable.scroll({
          left: scrollable.scrollLeft + targetRight - scrollable.offsetWidth,
          behavior: "smooth",
        });
      }
      setActiveTabIndex(activeIndex);
      const panelContainerWidth =
        panelsRef.current?.getBoundingClientRect().width || 0;
      setPanelWidth(panelContainerWidth * -activeIndex);
    };

    return props.data.map((data, index) => {
      return (
        <li
          key={`label-${index}`}
          className={`${index === activeTabIndex ? styles.activeTab : ""} ${
            data.isDisabled || props.isDisabled ? styles.disabled : ""
          }`}
          onClick={(event) => {
            if (data.isDisabled || props.isDisabled) {
              return;
            }
            return onLabelClick(event, index);
          }}
          role="tab"
          data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-${data.id}-tabs`}
        >
          <div>
            {typeof data.label === "function" ? (
              data.label({
                isDisabled: data.isDisabled,
                isActive: index === activeTabIndex,
              })
            ) : props.canShowBadge ? (
              <div className={styles.badgeContainer}>
                {data.label}
                {badges[index].badge > 0 && (
                  <Badges isInline={true} count={badges[index].badge}></Badges>
                )}
              </div>
            ) : (
              data.label
            )}
          </div>
        </li>
      );
    });
  }, [
    props.data,
    props.isDisabled,
    props.uniqueId,
    getPageDirection,
    activeTabIndex,
    automationIdPrefix,
    props.canShowBadge,
    badges,
  ]);

  const getPageDirection = useCallback(() => {
    return document.getElementsByTagName("html")[0].dir;
  }, []);

  useEffect(function updateActiveTabIndicatorStyle() {
    // defer indicator re-render until bounding rectangles
    // have been properly updated; forgoing thi will yield
    // an inaccurate indicator initial width
    setTimeout(() => {
      if (labelContainerRef.current) {
        setIndicatorReRenderKey(Date.now());
      }
    }, 100);
  }, []);

  const scrollLeft = () => {
    const scrollable = scrollableContainerRef.current;
    scrollable.scroll({
      left: scrollable.scrollLeft - 300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const scrollable = scrollableContainerRef.current;
    scrollable.scroll({
      left: scrollable.scrollLeft + 300,
      behavior: "smooth",
    });
  };

  const onLeftScroll = () => {
    if (getPageDirection() === "ltr") {
      scrollLeft();
    } else {
      scrollRight();
    }
  };

  const onRightScroll = () => {
    if (getPageDirection() === "ltr") {
      scrollRight();
    } else {
      scrollLeft();
    }
  };

  const onScrollableContainerScroll = () => {
    const scrollable = scrollableContainerRef.current;

    if (getPageDirection() === "ltr") {
      if (scrollable.scrollLeft === 0 && !leftScrollDisabled) {
        setLeftScrollDisabled(true);
      }
      if (scrollable.scrollLeft >= 1 && leftScrollDisabled) {
        setLeftScrollDisabled(false);
      }

      const fullyScrolledToRight =
        scrollable.offsetWidth + scrollable.scrollLeft + 1 >=
        scrollable.scrollWidth;

      // in some instances in ltr, the sum of the offsetWidth and scrollLeft
      // do not equal or surpass the value of scrollWidth, hence the + 1
      if (fullyScrolledToRight && !rightScrollDisabled) {
        setRightScrollDisabled(true);
      }

      if (!fullyScrolledToRight && rightScrollDisabled) {
        setRightScrollDisabled(false);
      }
    } else {
      // in rtl, the left and right scroll buttons switch places, evidently
      // scrolling further to the left from an RTL perspective will cause the
      // `scrollLeft` value to be increased negatively

      // if the scrollable container is fully scrolled to the right, that is,
      // the first tab is fully visible, the value is sometimes 1 and not 0
      // to see it first hand, undock the browser console into a different window and
      // click any of the labels, scroll to the left, then fully scroll to the right
      // you can log the `scrollable.scrollLeft` to the browser if needed

      if (scrollable.scrollLeft >= 0 && !leftScrollDisabled) {
        setLeftScrollDisabled(true);
      }
      if (scrollable.scrollLeft < 0 && leftScrollDisabled) {
        setLeftScrollDisabled(false);
      }

      const fullyScrolledToRight =
        scrollable.offsetWidth + Math.abs(scrollable.scrollLeft) + 1 >=
        scrollable.scrollWidth;

      // in RTL, even if the scrollable container is fully scrolled to the right,
      // the result of `scrollable.offsetWidth + Math.abs(scrollable.scrollLeft)`
      // is always short of 1; the exact reason for this is yet to be known
      if (fullyScrolledToRight && !rightScrollDisabled) {
        setRightScrollDisabled(true);
      }

      if (!fullyScrolledToRight && rightScrollDisabled) {
        setRightScrollDisabled(false);
      }
    }
  };

  const generateInlineStartWidth = useCallback(() => {
    const panelContainerWidth =
      panelsRef.current?.getBoundingClientRect().width || 0;
    setPanelWidth(panelContainerWidth * -activeTabIndex);
    const panelRefStyle = panelsRef.current.firstChild.style.transition;
    const scrollableContainerStyle =
      scrollableContainerRef.current.children[1].style.transition;
    panelsRef.current.firstChild.style.transition = "none";
    scrollableContainerRef.current.children[1].style.transition = "none";
    animationRef.current = requestAnimationFrame(() => {
      panelsRef.current.firstChild.style.transition = panelRefStyle;
      scrollableContainerRef.current.children[1].style.transition =
        scrollableContainerStyle;
    });
  }, [activeTabIndex]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const debounceHandler = useCallback(
    () => debounce(generateInlineStartWidth, 300),
    [generateInlineStartWidth]
  );

  const debounceHandlerActiveTabIndicator = useCallback(
    () => debounce(getActiveTabIndicatorStyle, 300),
    [getActiveTabIndicatorStyle]
  );

  useWindowResize(debounceHandler());
  useWindowResize(debounceHandlerActiveTabIndicator());

  const onUpdateBadge = useCallback((id, badgeVal) => {
    setBadges((prevState) =>
      prevState.map((badgeData) => {
        if (badgeData.id === id) {
          badgeData.badge = badgeVal;
        }
        return badgeData;
      })
    );
  }, []);

  const renderPanels = useCallback(() => {
    return (
      <section
        ref={panelsRef}
        className={`${styles.panels} ${
          props.canShowShadow ? styles.withShadow : ""
        } ${props.panelsCtrCls}`}
      >
        <div
          className={styles.panelsContainer}
          style={{
            insetInlineStart: panelWidth,
          }}
        >
          {props.data.map((dataItem, index) => {
            return (
              <div
                key={`panel-${index}`}
                className={`${styles.panel} ${
                  isTabArrowEnabled ? styles.paddingToFitContext : ""
                }  ${dataItem.ctrCls || ""}`}
              >
                {typeof dataItem.panel === "function" ? (
                  dataItem.panel({
                    onUpdateBadge,
                  })
                ) : (
                  <>
                    {dataItem.panel}
                    {console.warn(
                      "Deprecated: pass 'data.panel' as function instead of passing it as component"
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>
    );
  }, [
    isTabArrowEnabled,
    props.data,
    panelWidth,
    props.panelsCtrCls,
    props.canShowShadow,
    onUpdateBadge,
  ]);

  return (
    <div
      className={`${styles.tabs} ${props.ctrCls}`}
      role="tablist"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-tabs`}
    >
      <section
        className={`${styles.labels} ${
          props.canShowShadow ? styles.withShadow : ""
        } ${props.labelsCtrCls}`}
      >
        {isTabArrowEnabled && !leftScrollDisabled && (
          <>
            <button className={styles.leftScroll} onClick={onLeftScroll}>
              <ArrowDownIcon />
            </button>
            <div className={`${styles.iconShadowContainer}`}>
              <div className={styles.leftIconShadow}></div>
            </div>
          </>
        )}

        <div
          className={`${styles.scrollableContainer}`}
          onScroll={onScrollableContainerScroll}
          ref={scrollableContainerRef}
        >
          <ul className={styles.labelContainer} ref={labelContainerRef}>
            {renderLabels()}
          </ul>
          <div
            key={indicatorReRenderKey}
            className={`${styles.activeTabIndicator} ${
              props.isDisabled ? styles.indicatorDisabled : ""
            }`}
            style={activeTabStyle}
          ></div>
        </div>

        {isTabArrowEnabled && !rightScrollDisabled && (
          <>
            <button className={styles.rightScroll} onClick={onRightScroll}>
              <ArrowDownIcon />
            </button>
            <div
              className={`${styles.iconShadowContainer} ${styles.placeRight}`}
            >
              <div className={styles.rightIconShadow}></div>
            </div>
          </>
        )}
      </section>
      {renderPanels()}
    </div>
  );
});

Tabs.displayName = "Tabs";

Tabs.propTypes = {
  /**
   * Container class for the Tabs container
   */
  ctrCls: PropTypes.string,
  /**
  /**
   * Container class for the Tabs Labels container
   */
  labelsCtrCls: PropTypes.string,
  /**
   /**
   * Container class for the Tabs Panels container
   */
  panelsCtrCls: PropTypes.string,
  /**
   * Data for Tabs
   *
   * **Sample Data**
   *
   * ```js
   * [
   *   {
   *    id: "tab-1",
   *    ctrCls: "tab-1-ctr-cls",
   *    label: "Strawberry",
   *    panel: () => <div>Strawberries are popular in home gardens.</div>,
   *   },
   * ]
   * ```
   *
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ctrCls: PropTypes.string,
      label: PropTypes.any,
      panel: PropTypes.func,
      isDisabled: PropTypes.bool,
      badge: PropTypes.number,
    })
  ),
  /**
   * Default tab index to open
   */
  defaultTabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Disable the tabs
   */
  isDisabled: PropTypes.bool,
  /**
   * Callback function when tab is changed
   */
  onTabChange: PropTypes.func,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Determines if the badge is show on label
   */
  canShowBadge: PropTypes.bool,
  /**
   * Determines the shadow effect is show on tab
   */
  canShowShadow: PropTypes.bool,
};

Tabs.defaultProps = {
  ctrCls: "",
  labelsCtrCls: "",
  panelsCtrCls: "",
  onTabChange: () => undefined,
  isDisabled: false,
  canShowBadge: false,
  canShowShadow: true,
};

export default Tabs;
