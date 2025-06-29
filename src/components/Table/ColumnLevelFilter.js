import PropTypes from "prop-types";
import styles from "./Table.module.scss";
import { FilterMenu } from "../Filter/";
import { useState, useMemo, useEffect } from "react";
import { TableFilter } from "../../Icons/index";
import Badges from "../Badges/Badges";
import { invariant } from "../../Utils";

const ColumnLevelFilter = ({ header, items, tableRef }) => {
  const filterColumn = items[header.id];

  const [referenceElement, setReferenceElement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const popperModifiers = useMemo(() => {
    return [
      {
        name: "offset",
        options: {
          offset: [0, 2],
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["bottom-start"],
          boundary: tableRef,
        },
      },
    ];
  }, [tableRef]);

  useEffect(() => {
    invariant(
      filterColumn,
      `Filter data is not provided for the column "${header.id}"`
    );
  }, [filterColumn, header.id]);

  const onApplyFilter = (selectedItems) => {
    const isEmpty = Array.isArray(selectedItems)
      ? selectedItems.length === 0
      : Object.keys(selectedItems).length === 0;
    if (isEmpty) {
      header.column.setFilterValue(undefined);
    } else {
      header.column.setFilterValue(selectedItems);
    }
    setIsOpen(false);
  };

  const onCancelFilter = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className={`${styles.tableFilterContainer} `}>
        <Badges canShow={header.column.getIsFiltered()}>
          <TableFilter
            className={`${styles.tableFilter} ${header.id}`}
            data-role="filter-icon"
            onClick={() => {
              /* istanbul ignore else */
              if (!isOpen) {
                setIsOpen(true);
              }
            }}
            uniqueId={1670410114353}
            ref={setReferenceElement}
          />
        </Badges>
      </div>
      {!!referenceElement && (
        <FilterMenu
          referenceElement={referenceElement}
          isOpen={isOpen}
          onApply={onApplyFilter}
          onCancel={onCancelFilter}
          popperModifiers={popperModifiers}
          type={filterColumn.type}
          id={header.id}
          options={filterColumn.options}
          selectedItem={header.column.getFilterValue()}
          min={filterColumn.min}
          max={filterColumn.max}
          isMultiSelect={filterColumn.isMultiSelect}
          isSearchable={filterColumn.isSearchable}
          subType={filterColumn.subType}
          onOpen={filterColumn.onOpen}
          onReachBottom={filterColumn.onReachBottom}
          onQuickActions={filterColumn.onQuickActions}
        />
      )}
    </>
  );
};

ColumnLevelFilter.propTypes = {
  header: PropTypes.object.isRequired,
  items: PropTypes.object.isRequired,
  tableRef: PropTypes.object,
};

export default ColumnLevelFilter;
