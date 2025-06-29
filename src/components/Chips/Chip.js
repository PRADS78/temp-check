import PropTypes from "prop-types";
import styles from "./Chip.module.scss";
import { ChipSelectionType, Size } from "../../Enums";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { AvatarIcon, ContainedCloseIcon, DropDownTicked } from "../../Icons";

const Chip = (props) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Chip");
    invariantUniqueId(props.uniqueId, "Chip");
  }, [automationIdPrefix, props.uniqueId]);

  const onClick = (e, selectedId) => {
    if (!props.isDisabled) {
      props.onClick(e, selectedId);
    }
  };

  const onClose = (e) => {
    e.stopPropagation();
    props.onClose(e);
  };

  return (
    <div
      onClick={(e) => onClick(e, props.selectedId)}
      role="chip"
      className={`${styles.chip} ${props.ctrCls} ${
        props.size === Size.LARGE ? styles.large : ""
      } ${props.isDisabled ? styles.disabled : ""}  ${
        props.selectionType == ChipSelectionType.SINGLE
          ? styles.singleSelect
          : ""
      } ${props.isSelected ? styles.selected : ""}`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-chip`}
    >
      {props.canShowAvatar && (
        <div className={`${styles.avatarContainer}`}>
          {props.avatarUrl ? (
            <img src={props.avatarUrl} className={styles.avatar} />
          ) : (
            <AvatarIcon />
          )}
        </div>
      )}
      {props.selectionType === ChipSelectionType.MULTI && props.isSelected && (
        <DropDownTicked canRenderOnlyIcon uniqueId={1667217402496} />
      )}
      <span className={styles.text}>{props.label}</span>
      {props.canShowClose && (
        <ContainedCloseIcon
          className={"no-hover"}
          data-role="close"
          onClick={(e) => onClose(e)}
          uniqueId={1667217402495}
          isDisabled={props.isDisabled}
        />
      )}
    </div>
  );
};

Chip.propTypes = {
  /**
   * Specify ctrCls for the Chip
   */
  ctrCls: PropTypes.string,
  /**
   * Specify label of the chip
   */
  label: PropTypes.string,
  /**
   * Specify Size of the chip
   */
  size: PropTypes.oneOf([Size.SMALL, Size.LARGE]),
  /**
   * On click handler for the chip
   */
  onClick: PropTypes.func,
  /**
   * Determines if the avatar is show
   */
  canShowAvatar: PropTypes.bool,
  /**
   * Specify URL for the avatar
   */
  avatarUrl: PropTypes.string,
  /**
   * Determines if the close is show
   */
  canShowClose: PropTypes.bool,
  /**
   * On close handler for the chip
   */
  onClose: PropTypes.func,
  /**
   * Specify id for chip
   */
  selectedId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Specify the type of selection
   */
  selectionType: PropTypes.oneOf([
    ChipSelectionType.SINGLE,
    ChipSelectionType.MULTI,
  ]),
  /**
   * Determines if the chip is selected
   */
  isSelected: PropTypes.bool,
  /**
   * Determines if the chip is disabled
   */
  isDisabled: PropTypes.bool,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

Chip.defaultProps = {
  canShowClose: false,
  onClick: null,
  ctrCls: "",
  label: "",
  size: Size.SMALL,
  isSelected: false,
  canShowAvatar: false,
  onClose: () => undefined,
  isDisabled: false,
};

export default Chip;
