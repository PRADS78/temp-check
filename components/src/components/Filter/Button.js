import styles from "./Container.module.scss";
import {
  DownArrowIcon,
  ContainedCloseIcon,
  WarningFilledIcon,
} from "../../Icons/index";
import Badges from "../Badges/Badges";
import PropTypes from "prop-types";
import { useState } from "react";
import { DisprzTooltip } from "../..";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";
const Button = ({
  isRemovable,
  onRemove,
  automationIdPrefix,
  uniqueId,
  selectedItemsLength,
  setReferenceElement,
  onOpen,
  label,
  isMandatory,
}) => {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const [tooltipRef, setTooltipRef] = useState(null);
  const renderWarningTooltip = () => {
    return (
      <>
        <WarningFilledIcon
          ref={setTooltipRef}
          uniqueId={1671119351781}
          className={styles.warningIcon}
        />
        <DisprzTooltip
          message={t("filter.mandatoryItemWarningMsg")}
          referenceRef={tooltipRef}
          uniqueId={1674024213235}
          position="top"
        />
      </>
    );
  };
  return (
    <div
      className={`${styles.item} ${isRemovable ? styles.removable : ""}`}
      ref={setReferenceElement}
      onClick={onOpen}
      role="button"
      data-role="filter-button"
      data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-filter-item`}
    >
      <span
        data-testid="mandatory-item"
        className={isMandatory ? styles.mandatoryItem : ""}
      >
        {label}:{" "}
      </span>
      {selectedItemsLength > 0 ? (
        <Badges uniqueId={1671118350781} count={selectedItemsLength} isInline />
      ) : isMandatory === true ? (
        renderWarningTooltip()
      ) : (
        <>{t("common.all")}</>
      )}
      <DownArrowIcon
        className={`${styles.downArrow} no-hover`}
        canRenderOnlyIcon
      />
      {isRemovable && (
        <ContainedCloseIcon
          className={`${styles.closeIcon}`}
          onClick={onRemove}
          uniqueId={1671289014594}
        />
      )}
    </div>
  );
};

Button.propTypes = {
  isRemovable: PropTypes.bool.isRequired,
  isMandatory: PropTypes.bool,
  onRemove: PropTypes.func,
  automationIdPrefix: PropTypes.string.isRequired,
  uniqueId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  selectedItemsLength: PropTypes.number.isRequired,
  setReferenceElement: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

Button.defaultProps = {
  onRemove: () => undefined,
};

export default Button;
