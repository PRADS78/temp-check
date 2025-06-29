import PropTypes from "prop-types";
import styles from "./GlobalLevelFilters.module.scss";
import { FilterContainer } from "../Filter";
import { CancelIcon } from "../../Icons";
import { useCallback, useMemo, useRef } from "react";
import { TableFilterTypes } from "../../Enums";

function GlobalLevelFilters({
  items,
  selectedItems,
  tableRef,
  table,
  canShow,
  onToggle,
}) {
  const globalFilterRef = useRef(null);

  const updatedItems = useMemo(() => {
    Object.values(items).forEach((item) => {
      if (item.type === TableFilterTypes.LIST) {
        item.max = 5;
      }
    });
    return items;
  }, [items]);

  // TODO: Might be used, when discrete filter is enabled for Table global filter
  // const onDiscreteApply = ({
  //   selectedItem: _selectedItem,
  //   type: _type,
  //   id: _id,
  // }) => {
  //   table.setGlobalFilter((previousValue) => {
  //     const existingIndex = [...previousValue].findIndex((item) => {
  //       return item.id === _id;
  //     });
  //     const isEmpty = Array.isArray(_selectedItem)
  //       ? _selectedItem.length === 0
  //       : Object.keys(_selectedItem).length === 0;
  //     if (isEmpty) {
  //       previousValue = previousValue.filter((item) => {
  //         return item.id.toString() !== _id.toString();
  //       });
  //     } else {
  //       if (existingIndex > -1) {
  //         previousValue[existingIndex] = {
  //           id: _id,
  //           value: _selectedItem,
  //         };
  //       } else {
  //         previousValue = previousValue.concat({
  //           id: _id,
  //           value: _selectedItem,
  //         });
  //       }
  //     }
  //     return previousValue;
  //   });
  // };

  const onApply = (_globalFilters) => {
    table.setGlobalFilter(() =>
      Object.values(_globalFilters).map((value) => ({
        id: value.id,
        value: value.selectedItem,
      }))
    );
  };

  const onClearAll = () => {
    // Not used as part non discrete filters
    /* istanbul ignore next */
    table.setGlobalFilter(() => []);
  };

  /* istanbul ignore next */
  const onCancel = () => {};

  const getModifiedSelectedItems = useCallback(() => {
    const modifiedItems = {};
    selectedItems.forEach((item) => {
      modifiedItems[item.id] = item.value;
    });
    return modifiedItems;
  }, [selectedItems]);

  const onCancelFilters = () => {
    globalFilterRef.current.clear();
    onToggle();
  };

  return (
    <div
      className={`${styles.container} ${!canShow ? styles.hide : ""}`}
      hidden={!canShow}
      role="region"
      data-role="table-global-filter"
    >
      <div className={styles.globalFilterContainer}>
        <FilterContainer
          items={updatedItems}
          selectedItems={getModifiedSelectedItems()}
          boundaryRef={tableRef}
          onApply={onApply}
          onCancel={onCancel}
          onClearAll={onClearAll}
          uniqueId={1677738817629}
          ctrCls={styles.filterInnerContainer}
          isNonDiscreteApplyButton
          ref={globalFilterRef}
          limitCount={3}
          temp_isTableView={true}
        />
        <CancelIcon
          className={styles.minus}
          onClick={() => {
            onCancelFilters();
          }}
          uniqueId={1671377595106}
          title={"Cancel"}
          data-role="global-filter-hide-icon"
        />
      </div>
    </div>
  );
}

GlobalLevelFilters.propTypes = {
  items: PropTypes.object,
  selectedItems: PropTypes.array,
  tableRef: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
  canShow: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

GlobalLevelFilters.defaultProps = {
  items: {},
  selectedItems: [],
};

export default GlobalLevelFilters;
