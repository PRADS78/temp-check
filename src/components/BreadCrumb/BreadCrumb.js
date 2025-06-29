import React, { useEffect } from "react";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import PropTypes from "prop-types";
import styles from "./BreadCrumb.module.scss";
import { RightArrow, HomeFilled } from "@disprz/icons";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";

const BreadCrumb = ({ data, onHomeClick, uniqueId }) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "BreadCrumb");
    invariantUniqueId(uniqueId, "BreadCrumb");
  }, [automationIdPrefix, uniqueId]);
  return (
    <ul
      className={styles.breadcrumb}
      data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-breadcrumb`}
    >
      <HomeFilled
        uniqueId={uniqueId}
        className={styles.disprzHomeIcon}
        onClick={onHomeClick}
      />
      {data.map((item, index) => {
        return (
          <React.Fragment key={index}>
            <RightArrow
              uniqueId={uniqueId}
              className={`no-hover cursor-default ${styles.disprzArrowIcon}`}
            />
            <div
              data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-${item.id}-breadcrumb-item`}
              className={
                index === data.length - 1 ? `${styles.labelBold}` : styles.label
              }
              onClick={item.onClick.bind(null, item)}
            >
              {item.label}
            </div>
          </React.Fragment>
        );
      })}
    </ul>
  );
};

BreadCrumb.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string || PropTypes.object,
      onClick: PropTypes.func,
    })
  ).isRequired,
  onHomeClick: PropTypes.func.isRequired,
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default BreadCrumb;
