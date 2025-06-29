import { AccordionIcon, DragHandleIcon } from "../../Icons";
import { InlineEdit } from "../InlineEdit";
import styles from "./Accordion.module.scss";
import PropTypes from "prop-types";
import AccordionHeaderActions from "./AccordionHeaderAction";
import { WobbleRotate } from "../../Animation";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { motion } from "framer-motion";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";
const Accordion = ({
  ctrCls,
  bodyCtrCls,
  title,
  children,
  actions,
  isOpen,
  noOfActionsToRenderUpFront,
  canToggleAccordionOnTitleClick,
  canToggleAccordionOnHeaderClick,
  onClick,
  isCustomActions,
  customActions,
  isHeaderTitleEditable,
  inlineEditProps,
  // eslint-disable-next-line react/prop-types
  isDraggable,
  customActionCtr,
  uniqueId,
}) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Accordion");
    invariantUniqueId(uniqueId, "Accordion");
  }, [automationIdPrefix, uniqueId]);

  const renderTitle = () => {
    return (
      <div
        className={`${styles.headerTitle} ${styles.fillHeaderTitle} ${
          canToggleAccordionOnTitleClick ? styles.isClickable : ""
        }`}
        onClick={(e) => {
          if (canToggleAccordionOnTitleClick && !isHeaderTitleEditable) {
            onClick(e, isOpen);
          }
        }}
      >
        {isDraggable && renderDraggableIcon()}
        {title?.icon && title.icon()}
        {isHeaderTitleEditable ? (
          <InlineEdit
            {...inlineEditProps}
            ctrCls={styles.inlineEditContainer}
            uniqueId={1669187285858}
            labelCtrCls={styles.inlineEditLabel}
          />
        ) : (
          <span>{title.label}</span>
        )}
      </div>
    );
  };

  const renderCustomActions = () => {
    return (
      <div
        className={`${styles.customActionContainer} ${customActionCtr}`}
        data-testid="custom-container"
      >
        {customActions}
      </div>
    );
  };

  const renderHeaderActions = () => {
    return (
      actions.length > 0 && (
        <AccordionHeaderActions
          actions={actions}
          noOfActionsToRenderUpFront={noOfActionsToRenderUpFront}
        />
      )
    );
  };

  const renderDownArrow = () => {
    return (
      <div
        className={styles.headerCollapsibleIcon}
        title={isOpen ? t("common.collapse") : t("common.expand")}
      >
        <WobbleRotate in={isOpen}>
          <AccordionIcon
            data-role="arrow"
            onClick={(e) => onClick(e, isOpen)}
            uniqueId={1669378825087}
          />
        </WobbleRotate>
      </div>
    );
  };

  const renderDraggableIcon = () => {
    return <DragHandleIcon />;
  };

  const renderHeader = () => {
    const openFillHeaderStyle = isOpen ? "" : styles.fillHeaderClose;
    return (
      <div
        className={`
          ${styles.accordionHeader}
          ${styles.fillHeader}
         ${openFillHeaderStyle}`}
        onClick={(e) => {
          if (canToggleAccordionOnHeaderClick) {
            onClick(e, isOpen);
          }
        }}
      >
        {renderTitle()}
        {isCustomActions && renderCustomActions()}
        <div className={styles.accordionRightSideOptions}>
          {renderHeaderActions()}
          {renderDownArrow()}
        </div>
      </div>
    );
  };

  const accordionBodyAnimation = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    show: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.28,
        ease: "easeIn",
      },
    },
  };

  const renderBody = () => {
    const openStyle = isOpen ? styles.open : "";
    return (
      <motion.div
        className={`${styles.accordionBody} ${openStyle} ${styles.fillBody} ${bodyCtrCls}`}
        variants={accordionBodyAnimation}
        initial={isOpen ? "show" : "hidden"}
        animate={isOpen ? "show" : "hidden"}
      >
        <div className={styles.wrappingContainer}>{children}</div>
      </motion.div>
    );
  };

  return (
    <div
      className={`${styles.accordion} ${ctrCls}`}
      role="region"
      data-dz-unique-id={`${automationIdPrefix}-accordion-${uniqueId}`}
    >
      {renderHeader()}
      {renderBody()}
    </div>
  );
};

Accordion.propTypes = {
  /**
   * Specify ctrCls for the override container style
   */
  ctrCls: PropTypes.string,
  /**
   * Specify ctrCls for the override container style
   */
  bodyCtrCls: PropTypes.string,
  /**
   * Specify customActionCtr for the custom actions container
   */
  customActionCtr: PropTypes.string,
  /**
   * to be shown in accordion header title
   */
  title: PropTypes.shape({
    label: PropTypes.string,
    icon: PropTypes.func,
  }),
  /**
   * Specify header title is editable or not
   */
  isHeaderTitleEditable: PropTypes.bool,
  /**
   * Specify props for inlineedit
   */
  inlineEditProps: PropTypes.object,
  /**
   * to be shown in accordion body
   */
  children: PropTypes.any,
  /**
   * specify number of actions render on header upfront
   */
  noOfActionsToRenderUpFront: PropTypes.number,
  /**
   * specify user actions on header
   */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onClick: PropTypes.func,
      icon: PropTypes.func,
    })
  ),
  /**
   * Specify accordion open state
   */
  isOpen: PropTypes.bool,
  /**
   * Specify body should open on title click
   */
  canToggleAccordionOnTitleClick: PropTypes.bool,
  /**
   * Specify body should open on header click
   */
  canToggleAccordionOnHeaderClick: PropTypes.bool,
  /**
   * Add onClick event listener to the accordion click
   */
  onClick: PropTypes.func,
  /**
   * Specify custom action to render or not
   */
  isCustomActions: PropTypes.bool,
  /**
   * render custom action component
   */
  customActions: PropTypes.any,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  // isDraggable: PropTypes.bool,
};

Accordion.defaultProps = {
  ctrCls: "",
  title: {
    label: "",
  },
  actions: [],
  isCustomActions: false,
  customActions: "",
  isOpenByDefault: false,
  noOfActionsToRenderUpFront: 2,
  canToggleAccordionOnTitleClick: false,
  canToggleAccordionOnHeaderClick: false,
  onClick: () => undefined,
  isHeaderTitleEditable: false,
};

export default Accordion;
