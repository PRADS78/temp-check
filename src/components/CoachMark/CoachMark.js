import {
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { Popper } from "../Popper";
import styles from "./CoachMark.module.scss";
import { Checkbox } from "../Checkbox";
import { PlainButton, PrimaryButton } from "../AppButton";
import PropTypes from "prop-types";
import { SearchCloseIcon } from "../../Icons";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const CoachMark = forwardRef(function CoachMark(props, ref) {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "CoachMark");
    invariantUniqueId(props.uniqueId, "CoachMark");
  }, [automationIdPrefix, props.uniqueId]);

  const userCoachValue = JSON.parse(localStorage.getItem(props.name));

  const [referenceElementPosition, setReferenceElementPosition] = useState({});
  const [currentCoachMarkIndex, setCurrentCoachMarkIndex] = useState(-1);
  const _isShowCoachMarkAgain = !userCoachValue
    ? true
    : userCoachValue?.isShowCoachMarkAgain;
  const [isShowCoachMarkAgain, setIsShowCoachMarkAgain] = useState(
    _isShowCoachMarkAgain
  );
  const currentCoachMark = props.data[currentCoachMarkIndex];

  useImperativeHandle(
    ref,
    () => ({
      show: showCoachMark,
    }),
    [showCoachMark]
  );

  const showCoachMark = useCallback(
    ({ canOverRideCoachMarkShowAgain = _isShowCoachMarkAgain } = {}) => {
      const _currentCoachMarkIndex =
        !userCoachValue || userCoachValue?.isCoachMarkCompleted
          ? 0
          : userCoachValue?.currentCoachMarkIndex;
      setCurrentCoachMarkIndex(_currentCoachMarkIndex);
      if (!canOverRideCoachMarkShowAgain) {
        setCurrentCoachMarkIndex(-1);
      }
      localStorage.setItem(
        props.name,
        JSON.stringify({
          currentCoachMarkIndex: _currentCoachMarkIndex,
          isCoachMarkCompleted: false,
          isShowCoachMarkAgain: isShowCoachMarkAgain,
        })
      );
    },
    [_isShowCoachMarkAgain, userCoachValue, props.name, isShowCoachMarkAgain]
  );

  const modifiers = useMemo(
    () => [
      {
        name: "offset",
        options: {
          offset: [0, 24],
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (currentCoachMark?.referenceRef) {
      let rect = currentCoachMark.referenceRef.getBoundingClientRect();
      let _referenceElementPosition = {
        height: rect.height + 10,
        width: rect.width + 10,
        left: rect.left - 5,
        right: window.innerWidth - rect.right,
        top: rect.top - 5,
        bottom: window.innerHeight - rect.bottom,
      };
      // referenceRef?.scrollIntoView({
      //   behavior: "smooth",
      //   block: "center",
      // });
      setReferenceElementPosition(_referenceElementPosition);
    }
  }, [currentCoachMark?.referenceRef]);

  useEffect(() => {
    if (currentCoachMarkIndex >= 0) {
      props.data.map((el, index) => {
        if (index === currentCoachMarkIndex) {
          el.referenceRef.classList.add(styles.overRideRefElement);
        } else {
          el.referenceRef.classList.remove(styles.overRideRefElement);
        }
      });
    }
  }, [currentCoachMarkIndex, props.data]);

  const onDismiss = () => {
    currentCoachMark.referenceRef.classList.remove(styles.overRideRefElement);
    setCurrentCoachMarkIndex(-1);
    props.onDismiss();
  };

  const onDone = () => {
    localStorage.setItem(
      props.name,
      JSON.stringify({
        currentCoachMarkIndex: currentCoachMarkIndex,
        isCoachMarkCompleted: true,
        isShowCoachMarkAgain: isShowCoachMarkAgain,
      })
    );
    setCurrentCoachMarkIndex(-1);
    currentCoachMark.referenceRef.classList.remove(styles.overRideRefElement);
    props.onDone();
  };

  const onNext = () => {
    localStorage.setItem(
      props.name,
      JSON.stringify({
        currentCoachMarkIndex: currentCoachMarkIndex + 1,
        isCoachMarkCompleted: false,
        isShowCoachMarkAgain: isShowCoachMarkAgain,
      })
    );
    setCurrentCoachMarkIndex((prevs) => prevs + 1);
  };

  const onPrevious = () => {
    localStorage.setItem(
      props.name,
      JSON.stringify({
        currentCoachMarkIndex: currentCoachMarkIndex - 1,
        isCoachMarkCompleted: false,
        isShowCoachMarkAgain: isShowCoachMarkAgain,
      })
    );
    setCurrentCoachMarkIndex((prevs) => prevs - 1);
  };

  const onCheckCoachMarkShowAgain = () => {
    localStorage.setItem(
      props.name,
      JSON.stringify({
        currentCoachMarkIndex: currentCoachMarkIndex,
        isCoachMarkCompleted: false,
        isShowCoachMarkAgain: false,
      })
    );
    setIsShowCoachMarkAgain(!isShowCoachMarkAgain);
  };

  const renderHeaderCloseButton = () => {
    return (
      <SearchCloseIcon
        className={styles.closeButton}
        onClick={onDismiss}
        role="dismissdialog"
        uniqueId={1666939242025}
      />
    );
  };

  const renderHeaderContainer = () => {
    const ImageComponent = currentCoachMark?.header?.imageComponent;
    const imageUrl = currentCoachMark?.header?.imageUrl;
    return (
      <div
        className={styles.headerContainer}
        role="region"
        data-role="coachmark-header-container"
      >
        {ImageComponent ? (
          <ImageComponent />
        ) : imageUrl ? (
          <img src={imageUrl} alt="" />
        ) : null}
      </div>
    );
  };

  const renderContentContainer = () => {
    return (
      <div
        className={styles.contentContainer}
        role="region"
        data-role="coachmark-content-container"
      >
        <p className={styles.title}>{currentCoachMark?.content.title}</p>
        <p className={styles.description}>
          {currentCoachMark?.content.description}
        </p>
        <div className={styles.confirmation}>
          <Checkbox
            ctrCls={styles.label}
            isChecked={!isShowCoachMarkAgain}
            onChange={onCheckCoachMarkShowAgain}
            label={t("coachMark.checkboxLabel")}
            uniqueId={`${1675146868442}`}
          />
        </div>
      </div>
    );
  };

  const renderProgressIndicator = () => {
    return (
      <div className={styles.progressIndicator}>
        {props.data.map((list, index) => {
          return (
            <div
              className={`${styles.indicator} ${
                index <= currentCoachMarkIndex ? styles.filled : ""
              }`}
              key={index}
              role="region"
              data-role="coachmark-progress-indicator"
            ></div>
          );
        })}
      </div>
    );
  };

  const renderActionContainer = () => {
    const isFinalList = props.data.length - 1 === currentCoachMarkIndex;
    return (
      <div className={styles.actionContainer}>
        {currentCoachMarkIndex ? (
          <PlainButton
            label={t("common.previous")}
            uniqueId={`${1675147450447}`}
            onClick={() => onPrevious()}
          />
        ) : null}
        <PrimaryButton
          label={isFinalList ? t("common.done") : t("common.next")}
          uniqueId={`${1675147275779}`}
          onClick={() => (isFinalList ? onDone() : onNext())}
        />
      </div>
    );
  };

  const renderNavigationContainer = () => {
    return (
      <div
        className={styles.navigationContainer}
        role="region"
        data-role="coachmark-navigation-container"
      >
        {renderProgressIndicator()}
        {renderActionContainer()}
      </div>
    );
  };

  return (
    <>
      {currentCoachMarkIndex >= 0 && (
        <div className={`${styles.coachMarkOverlay} ${props.overlayCtrCls}`} />
      )}
      <div
        className={`${styles.coachMarkReferenceElement} ${props.referenceCtrCls}`}
        style={{
          ...referenceElementPosition,
        }}
      ></div>
      {
        <Popper
          referenceElement={currentCoachMark?.referenceRef}
          isVisible={currentCoachMarkIndex >= 0}
          isPortal
          placement={"auto"}
          canShowArrow={false}
          innerCtrCls={styles.innerCtrCls}
          ctrCls={styles.ctrCls}
          modifiers={modifiers}
        >
          {currentCoachMarkIndex >= 0 && (
            <div
              className={`${styles.coachMarkContainer} ${props.ctrCls}`}
              data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-coachmark`}
            >
              {renderHeaderCloseButton()}
              {renderHeaderContainer()}
              {renderContentContainer()}
              {renderNavigationContainer()}
            </div>
          )}
        </Popper>
      }
    </>
  );
});

CoachMark.propTypes = {
  /**
   * Custom class for the coachmark
   */
  ctrCls: PropTypes.string,
  /**
   * Custom class for overlay
   */
  overlayCtrCls: PropTypes.string,
  /**
   * Custom class for reference element
   */
  referenceCtrCls: PropTypes.string,
  /**
   * unique id for coachmark
   */
  name: PropTypes.string,
  /**
   * Specify datalist for coachMark
   * {
   *  header: {
        imageComponent: "", // give image as component
        imageUrl: "", // URL of gif
      },
      content: {
        title: "", // title of the coachmark
        description: "", //description of the coachmark
      },
      referenceRef: "",
    }
   * Reference element for the coachmark (Either a useState or useRef current object) <s>*</s>
   *
   * Example:
   *
   * useRef -
   *
   * ```js
   * const referenceRef = useRef(null);
   * <CoachMark referenceRef={referenceRef.current}/>
   * ```
   *
   * useState -
   *
   * ```js
   * const [referenceRef, setReferenceRef] = useState(null);
   * <CoachMark referenceRef={referenceRef}/>
   * ```
   *
   * <s>*</s> Required DisprzPortalDomProvider from disprz components
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      header: {
        imageComponent: PropTypes.elementType,
        imageUrl: PropTypes.string,
      },
      content: {
        title: PropTypes.string,
        description: PropTypes.string,
      },
      referenceRef: PropTypes.any,
    })
  ),
  /**
   * Callback invoked when clicking the header close button
   */
  onDismiss: PropTypes.func,
  /**
   * Callback invoked when clicking the Done button
   */
  onDone: PropTypes.func,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

CoachMark.defaultProps = {
  ctrCls: "",
  overlayCtrCls: "",
  referenceCtrCls: "",
  name: "",
};

export default CoachMark;
