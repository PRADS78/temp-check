import PropTypes from "prop-types";
import style from "./Sort.module.scss";
import { useState, useCallback, useEffect, useMemo } from "react";
import { SortIcon, DropDownTicked } from "../../Icons";
import { PopperPlacements, SortOrder } from "../../Enums";
import { OutlinedButton } from "../AppButton/";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { Popper } from "../Popper";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const Sort = ({
  ctrCls,
  menuCtrCls,
  onSort,
  order,
  by,
  items,
  uniqueId,
  canUsePortal,
}) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Sort");
    invariantUniqueId(uniqueId, "Sort");
  }, [automationIdPrefix, uniqueId]);

  const [isOpen, setIsOpen] = useState(false);

  const [referenceElement, setReferenceElement] = useState(null);

  const modifiers = useMemo(() => {
    return [
      {
        name: "offset",
        enabled: true,
        options: {
          offset: [0, 10],
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["top-start", "bottom-end", "bottom-start"],
        },
      },
    ];
  }, []);

  const hideMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onSelectValue = (by, order) => {
    onSort(by, order);
    hideMenu();
  };

  const generateTooltipText = () => {
    let tooltipText = "";
    const selectedItem = items.find((item) => {
      return item.id == by;
    });
    tooltipText = selectedItem?.label;

    if (order !== null) tooltipText = `${selectedItem?.label} : ${order}`;
    return tooltipText;
  };

  const renderListHeader = (item) => {
    return (
      <>
        <div className={`${style.dropdownItem} ${style.header}`}>
          {item.label}
        </div>
        {SortOrder.ASCENDING in item &&
          renderListItem(item.asc.label, item.id, SortOrder.ASCENDING)}
        {SortOrder.DESCENDING in item &&
          renderListItem(item.desc.label, item.id, SortOrder.DESCENDING)}
      </>
    );
  };

  const renderListItem = (label, byValue, orderValue) => {
    const isSelected = byValue == by && orderValue == order;
    return (
      <div
        className={`${style.dropdownItem} ${isSelected ? style.selected : ""}`}
        onClick={() => onSelectValue(byValue, orderValue)}
        role="list"
      >
        {label}
        {isSelected && (
          <DropDownTicked canRenderOnlyIcon className={style.tickIcon} />
        )}
      </div>
    );
  };

  return (
    <div
      className={style.sort}
      data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-sort`}
    >
      <OutlinedButton
        ctrCls={`${style.sortButton} ${ctrCls}`}
        label={t("common.sort")}
        tooltipText={by == null ? "" : generateTooltipText()}
        uniqueId={1669208100967}
        icon={() => {
          return <SortIcon className={`${style.iconPad}`} canRenderOnlyIcon />;
        }}
        ref={setReferenceElement}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Popper
        referenceElement={referenceElement}
        placement={PopperPlacements.BOTTOM_END}
        isVisible={isOpen}
        onClickOutside={hideMenu}
        isPortal={canUsePortal}
        modifiers={modifiers}
        innerCtrCls={`${style.dropdownContainer} ${menuCtrCls}`}
        role="menu"
      >
        {items.map((item) => {
          let isTitle =
            SortOrder.ASCENDING in item || SortOrder.DESCENDING in item;

          return (
            <div key={item.id}>
              {isTitle
                ? renderListHeader(item)
                : renderListItem(item.label, item.id, null)}
            </div>
          );
        })}
      </Popper>
    </div>
  );
};

Sort.propTypes = {
  /**
   * Specify ctrCls for the Sort
   */
  ctrCls: PropTypes.string,
  /**
   * Specify menuCtrCls for the Sort
   */
  menuCtrCls: PropTypes.string,
  /**
   * OnSort handler for sorting
   */
  onSort: PropTypes.func,
  /**
   * Specify order for the Sort
   */
  order: PropTypes.string,
  /**
   * Specify group name for the Sort
   */
  by: PropTypes.string,
  /**
   * Specify items for the Sort dropdown
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      id: PropTypes.number,
      asc: PropTypes.shape({
        label: PropTypes.string,
      }),
      desc: PropTypes.shape({
        label: PropTypes.string,
      }),
    })
  ),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Specify if the dropdown can be rendered in a portal
   */
  canUsePortal: PropTypes.bool,
};

Sort.defaultProps = {
  ctrCls: "",
  menuCtrCls: "",
  onSort: () => undefined,
  canUsePortal: false,
};

export default Sort;
