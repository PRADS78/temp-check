import PropTypes from "prop-types";
import styles from "./Tag.module.scss";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { TagColor } from "../../Enums";

const Tag = (props) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Tag");
    invariantUniqueId(props.uniqueId, "Tag");
  }, [automationIdPrefix, props.uniqueId]);

  const generateTagVariant = () => {
    if (
      props.color == TagColor.SUCCESS ||
      props.color == TagColor.WARNING ||
      props.color == TagColor.DEFAULT ||
      props.color == TagColor.DANGER
    )
      return styles.outlined;
    else return styles.filled;
  };

  return (
    <div
      className={`${styles.tag} ${props.ctrCls} ${
        props.color
      } ${generateTagVariant()}`}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-tag`}
      role="region"
    >
      <span className={styles.text}>{props.label}</span>
    </div>
  );
};

Tag.propTypes = {
  /**
   * Specify ctrCls for the Tag
   */
  ctrCls: PropTypes.string,
  /**
   * Specify label for the Tag
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * Specify color for the Tag
   */
  color: PropTypes.oneOf([
    TagColor.SUCCESS,
    TagColor.WARNING,
    TagColor.DANGER,
    TagColor.DEFAULT,
    TagColor.SURVEY,
    TagColor.SELF_PACED_MODULE,
    TagColor.CLASSROOM_MODULE,
    TagColor.MOOC_MODULE,
    TagColor.LIVE_MODULE,
    TagColor.ARTEFACT,
    TagColor.EVALUATIONS,
    TagColor.PERSONALIZED_JOURNEY,
    TagColor.STANDARD_JOURNEY,
    TagColor.MODULE,
    TagColor.PRIMARY,
  ]).isRequired,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

Tag.defaultProps = {
  ctrCls: "",
  color: TagColor.PRIMARY,
  label: "",
};

export default Tag;
