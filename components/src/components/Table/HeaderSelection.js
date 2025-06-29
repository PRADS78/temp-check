import PropTypes from "prop-types";
import { useMemo, useRef, useState } from "react";
import { SimpleMenuPositions, TableSelectOptions } from "../../Enums";
import { DownArrowIcon } from "../../Icons";
import { invariantSkipProd } from "../../Utils";
import { Menu } from "../AppButton";
import { Checkbox } from "../Checkbox";
import styles from "./Table.module.scss";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";
function HeaderSelection({
  table,
  canEnableMultiRowSelection,
  onSelectAllPageRows,
  canEnableAllPageRowsSelection,
  maxCapForSelectAll,
  selectedRows,
  totalRows,
}) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const menuRef = useRef(null);

  const pageCount = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;
  const rowsLength = table.getRowModel().rows.length;

  // This is currently used only when we know the page count
  const canSelectAllRecords =
    maxCapForSelectAll === -1 || totalRows <= maxCapForSelectAll;

  const selectItems = useMemo(() => {
    const _selectAllRowSelectionOptions = [
      {
        value: TableSelectOptions.SELECT_CURRENT_PAGE,
        label: `${t("common.select")} ${
          rowsLength < pageSize ? rowsLength : pageSize
        }`,
      },
      {
        value: TableSelectOptions.SELECT_ALL_PAGES,
        label: `${
          canSelectAllRecords
            ? `${t("common.selectAll")}` + totalRows
            : `${t("common.deselectAll")} ` + maxCapForSelectAll
        }`,
      },
      {
        value: TableSelectOptions.DESELECT_ALL,
        label: `${t("common.deselectAll")}`,
      },
    ];
    if (!canEnableAllPageRowsSelection || pageCount === -1) {
      _selectAllRowSelectionOptions.splice(1, 1);
    } else if (totalRows <= pageSize) {
      _selectAllRowSelectionOptions.splice(0, 1);
    }
    return _selectAllRowSelectionOptions;
  }, [
    canEnableAllPageRowsSelection,
    canSelectAllRecords,
    maxCapForSelectAll,
    pageCount,
    pageSize,
    rowsLength,
    totalRows,
    t,
  ]);

  if (!canEnableMultiRowSelection) {
    return null;
  }

  const onItemClick = (item) => {
    switch (item.value) {
      case TableSelectOptions.SELECT_CURRENT_PAGE:
        table.toggleAllRowsSelected(true);
        break;
      case TableSelectOptions.SELECT_ALL_PAGES:
        onSelectAllPageRows().then(({ rowIds, rows }) => {
          const _rowIds = canSelectAllRecords
            ? rowIds
            : rowIds.slice(0, maxCapForSelectAll); // Selecting top rows
          const _temp = {};
          _rowIds.forEach((r) => {
            invariantSkipProd(
              typeof _temp[r] === "undefined",
              `Duplicate row id found in the table, Id - ${r}`
            );
            _temp[r] = true;
          });
          table.setRowSelection(() => {
            return _temp;
          });
          /* istanbul ignore else */
          if (rows.length > 0) {
            // Setting rows data here because we don't have all the rows data to set onRowSelectionChange()
            selectedRows.current = canSelectAllRecords
              ? rows
              : rows.slice(0, maxCapForSelectAll);
          }
        });
        break;
      case TableSelectOptions.DESELECT_ALL:
        table.setRowSelection(() => {
          return {};
        });
        // Setting to empty object to skip individual object deletion in onRowSelectionChange()
        selectedRows.current = {};
        break;
    }
  };

  return (
    <div className={styles.headerSelectionCtr}>
      <Checkbox
        isChecked={table.getIsAllRowsSelected()}
        onChange={() => {
          table.toggleAllPageRowsSelected();
        }}
        ctrCls={styles.checkbox}
        uniqueId={1667399286732}
      />
      <DownArrowIcon
        className={`${styles.downArrow} no-hover`}
        onClick={() => {
          setIsDropdownVisible((prevState) => !prevState);
        }}
        uniqueId={1667399297428}
        ref={menuRef}
      />
      <Menu
        items={selectItems}
        isVisible={isDropdownVisible}
        popperCtrCls={styles.tableButtonDropdown}
        onChangeVisibility={setIsDropdownVisible}
        onItemClick={onItemClick}
        uniqueId={1667546037919}
        referenceRef={menuRef.current}
        position={SimpleMenuPositions.BOTTOM_START}
      />
    </div>
  );
}

HeaderSelection.propTypes = {
  table: PropTypes.object.isRequired,
  canEnableMultiRowSelection: PropTypes.bool,
  onSelectAllPageRows: PropTypes.func,
  canEnableAllPageRowsSelection: PropTypes.bool,
  maxCapForSelectAll: PropTypes.number,
  selectedRows: PropTypes.object.isRequired,
  totalRows: PropTypes.number.isRequired,
};

/* istanbul ignore next */
HeaderSelection.defaultProps = {
  canEnableMultiRowSelection: true,
  onSelectAllPageRows: () => undefined,
  canEnableAllPageRowsSelection: true,
  maxCapForSelectAll: 1000,
};

export default HeaderSelection;
