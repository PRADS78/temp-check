import { useState } from "react";
import { InfoIcon } from "../../Icons";
import { Tooltip } from "../Tooltip";
import { ToolTipPositions } from "../../Enums";
import styles from "./Container.module.scss";
import PropTypes from "prop-types";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const RangeExceededTooltip = ({
  filterLimitCount,
  temp_isTableView,
  doesAnyFilterHasAMultiSelectItem,
  itemsCount,
}) => {
  const [iconRef, setIconRef] = useState(null);
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  let message = "";

  const isFilterCountOverLimit = itemsCount > filterLimitCount;
  const isFilterCountOverLimitAndHasAnyMultiSelectItem =
    isFilterCountOverLimit && doesAnyFilterHasAMultiSelectItem;
  const doesAnyFilterHasAMultiSelectItemInTableView =
    doesAnyFilterHasAMultiSelectItem && temp_isTableView;

  if (isFilterCountOverLimitAndHasAnyMultiSelectItem) {
    message = `${t(
      "filter.rangeExceededTooltipMsg.part1"
    )} ${filterLimitCount} ${
      filterLimitCount === 1 ? t("common.filter") : t("common.filters")
    } ${temp_isTableView ? t("filter.rangeExceededTooltipMsg.part2") : ""}`;
  } else if (doesAnyFilterHasAMultiSelectItemInTableView) {
    message = `${t("filter.rangeExceededTooltipMsg.full")}`;
  } else if (isFilterCountOverLimit) {
    message = `${t(
      "filter.rangeExceededTooltipMsg.part1"
    )} ${filterLimitCount} ${
      filterLimitCount === 1 ? t("common.filter") : t("common.filters")
    }`;
  } else {
    return null;
  }

  return (
    <>
      <InfoIcon
        ref={setIconRef}
        className={styles.limitExceededTooltipIcon}
        data-role="tooltip-trigger"
      />
      <Tooltip
        referenceRef={iconRef}
        message={message}
        uniqueId={1694524697240}
        position={ToolTipPositions.BOTTOM}
      />
    </>
  );
};

RangeExceededTooltip.propTypes = {
  filterLimitCount: PropTypes.number,
  // Temporary prop to show the extra tooltip message only on the table view, because the max options are hardcoded on the Table
  temp_isTableView: PropTypes.bool,
  doesAnyFilterHasAMultiSelectItem: PropTypes.bool,
  itemsCount: PropTypes.number,
};

export default RangeExceededTooltip;
