import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./Stepper.module.scss";
import PropTypes from "prop-types";
import { StepperCheckIcon } from "../../Icons";
import { StepperStepState, StepperStepType } from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const Stepper = forwardRef(function Stepper(props, ref) {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Stepper");
    invariantUniqueId(props.uniqueId, "Stepper");
  }, [automationIdPrefix, props.uniqueId]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [panelsContainerHeight, setPanelsContainerHeight] = useState("auto");
  const [steps, setSteps] = useState(
    props.data.map((stepData, index) => {
      if (stepData?.state) {
        return stepData.state;
      } else {
        if (index === 0 || props.type === StepperStepType.NON_LINEAR) {
          return StepperStepState.UNLOCKED;
        }
        if (
          props.type === StepperStepType.LINEAR ||
          props.type === StepperStepType.PARTIAL_LINEAR
        )
          return StepperStepState.LOCKED;
      }
    })
  );

  const panelsContainerRef = useRef();

  useEffect(
    function updatePanelsContainerHeight() {
      const currentPanelHeight =
        panelsContainerRef.current?.children[
          activeIndex
        ].getBoundingClientRect().height;
      setPanelsContainerHeight(currentPanelHeight + "px");
    },
    [activeIndex]
  );

  useImperativeHandle(
    ref,
    () => ({
      onNext: onNext,
      onPrev: onPrev,
      isLastStep: isLastStep,
      activeIndex: activeIndex,
      onMarkStepStatus: onMarkStepStatus,
    }),
    [onNext, onPrev, isLastStep, activeIndex, onMarkStepStatus]
  );

  const onMarkStepStatus = useCallback((index, stepStatus) => {
    setSteps((prevSteps) =>
      prevSteps.map((currentStepState, stepIndex) => {
        if (index === stepIndex) {
          return stepStatus;
        }
        return currentStepState;
      })
    );
  }, []);

  const renderSeparator = useCallback(
    ({ dataItem, stepIndex, template }) => {
      let ctrCls = "";
      if (props.type === StepperStepType.NON_LINEAR) {
        ctrCls = stepIndex === activeIndex ? "traversed" : "";
      } else {
        ctrCls = stepIndex <= activeIndex ? "traversed" : "";
      }
      template.unshift(
        <div
          key={`${dataItem.label}-separator`}
          className={`
            ${styles.separator}
            ${styles[ctrCls]}
            ${steps[stepIndex] === StepperStepState.DONE ? styles.stepDone : ""}
          `}
        ></div>
      );
    },
    [activeIndex, props.type, steps]
  );

  const isLastStep = useCallback(() => {
    if (props.canAddDoneTemplate) {
      return activeIndex === steps.length - 1;
    }
    return activeIndex === props.data.length - 1;
  }, [activeIndex, props.canAddDoneTemplate, props.data.length, steps.length]);

  const renderSteps = useCallback(() => {
    const onStepItemClick = (stepIndex) => {
      if (props.type !== StepperStepType.LINEAR) {
        if (steps[stepIndex] === StepperStepState.LOCKED) return;
        setActiveIndex(stepIndex);
      }
    };
    const separatedSteps = props.data.map((dataItem, stepIndex) => {
      const template = [
        <div
          key={dataItem.label}
          className={`${styles.stepItem} ${
            stepIndex === activeIndex ? styles.active : ""
          } ${styles[steps[stepIndex]]} ${
            props.type === StepperStepType.LINEAR ? styles.default : ""
          }`}
          onClick={() => onStepItemClick(stepIndex)}
          role="listitem"
          data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-step-${dataItem.id}-stepper`}
        >
          {steps[stepIndex] === StepperStepState.DONE ? (
            <StepperCheckIcon className={styles.doneIcon} />
          ) : (
            <div className={styles.number}>{stepIndex + 1}</div>
          )}
          <div className={styles.label}>{dataItem.label}</div>
        </div>,
      ];
      if (stepIndex !== 0) {
        renderSeparator({ dataItem, stepIndex, template });
      }
      return template;
    });
    return separatedSteps.flat();
  }, [
    props.data,
    props.type,
    props.uniqueId,
    steps,
    activeIndex,
    automationIdPrefix,
    renderSeparator,
  ]);

  const onNext = useCallback(() => {
    setSteps((prevSteps) =>
      prevSteps.map((currentStepState, stepIndex) => {
        if (activeIndex === stepIndex) {
          return StepperStepState.DONE;
        }
        if (
          activeIndex + 1 === stepIndex &&
          currentStepState === StepperStepState.LOCKED
        ) {
          return StepperStepState.UNLOCKED;
        }
        return currentStepState;
      })
    );
    if (props.canAddDoneTemplate ? true : activeIndex < props.data.length - 1) {
      setActiveIndex((prevActiveIndex) => prevActiveIndex + 1);
    }
  }, [activeIndex, props.canAddDoneTemplate, props.data.length]);

  const onPrev = useCallback(() => {
    setActiveIndex((prevActiveIndex) => prevActiveIndex - 1);

    if (props.type === StepperStepType.LINEAR) {
      setSteps((prevSteps) =>
        prevSteps.map((currentStepState, stepIndex) => {
          if (activeIndex - 1 === stepIndex) {
            return StepperStepState.UNLOCKED;
          }
          if (activeIndex <= stepIndex) {
            return StepperStepState.LOCKED;
          }
          return currentStepState;
        })
      );
    }
  }, [activeIndex, props.type]);

  const panels = useMemo(() => {
    const data = props.canAddDoneTemplate
      ? props.data.concat({
          label: t("stepper.doneTemplateLabel"),
          content: props.doneTemplate,
        })
      : props.data;
    return data.map((dataItem) => (
      <div
        key={dataItem.label}
        className={`${styles.panel} ${dataItem.ctrCls ?? ""}`}
        role="tabpanel"
      >
        {dataItem.content({
          onNext,
          onPrev,
          id: dataItem.id,
          onMarkStepStatus,
        })}
      </div>
    ));
  }, [
    onNext,
    onPrev,
    props.data,
    props.doneTemplate,
    props.canAddDoneTemplate,
    onMarkStepStatus,
    t,
  ]);

  return (
    <div
      className={`${styles.stepper} ${props.ctrCls}`}
      role="region"
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-stepper`}
    >
      <section className={`${styles.steps} ${props.stepsCtrCls}`}>
        {renderSteps()}
      </section>
      <section className={styles.contentPane}>
        <div
          ref={panelsContainerRef}
          className={styles.panelsContainer}
          style={{
            insetInlineStart: `-${
              activeIndex *
              panelsContainerRef.current?.getBoundingClientRect().width
            }px`,
            height: panelsContainerHeight,
          }}
        >
          {panels}
        </div>
      </section>
    </div>
  );
});

Stepper.propTypes = {
  /**
   * Container class for the Stepper
   */
  ctrCls: PropTypes.string,
  /**
   * Data for the Stepper
   *
   * **Sample data:**
   *
   * ```js
   * [
   *   {
   *    id: "step-1",
   *    ctrCls: "step-1-ctr-cls",
   *    label: "First",
   *    content: ({ onNext }) => <FirstTemplate onNext={onNext} />,
   *    state: StepperStepState.DONE // Optional
   *   },
   * ]
   * ```
   *
   */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
      ctrCls: PropTypes.string,
      label: PropTypes.any,
      content: PropTypes.func,
      state:
        PropTypes.oneOf[
          (StepperStepState.DONE,
          StepperStepState.LOCKED,
          StepperStepState.UNLOCKED)
        ],
    })
  ),
  /**
   * Render prop for the Submitted step
   */
  doneTemplate: PropTypes.func,
  /**
   * Boolean to determine if the Stepper can add a done template
   */
  canAddDoneTemplate: PropTypes.bool,
  /**
   * Additional class for the actual steps on the top
   */
  stepsCtrCls: PropTypes.string,
  /**
   * Specify type for the stepper
   */
  type: PropTypes.oneOf([
    StepperStepType.LINEAR,
    StepperStepType.NON_LINEAR,
    StepperStepType.PARTIAL_LINEAR,
  ]),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

Stepper.defaultProps = {
  ctrCls: "",
  data: [],
  doneTemplate: () => null,
  canAddDoneTemplate: true,
  stepsCtrCls: "",
  type: StepperStepType.PARTIAL_LINEAR,
};

export default Stepper;
