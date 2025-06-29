import PropTypes from "prop-types";
import { memo, useCallback, useMemo, useRef } from "react";
import { ButtonTypes, TableLoadingOptions } from "../../../Enums";
import { OutlinedButton, DropdownButton, PrimaryButton } from "../../AppButton";
import { SearchBar } from "../../SearchBar";
import styles from "./HeaderControls.module.scss";
import { IconDropDown } from "../../IconDropDown";
import GlobalLevelFilters from "../GlobalLevelFilters";
import { TableFilter } from "../../../Icons";
import { useLocalizerWithNameSpace } from "../../../DisprzLocalizer";
function HeaderControls({
  searchOptions,
  selectActions,
  isSomeRowsSelected,
  actions,
  title,
  noOfSelectActionsToRenderUpFront,
  selectedRows,
  selectedRowIds,
  onToggleGlobalFilter,
  filterOptions,
  isGlobalFilterVisible,
  globalFilters,
  tableRef,
  table,
  loadingState,
}) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const sectionRef = useRef(null);
  const searchBarRef = useRef(null);
  const controlsRef = useRef(null);

  const _selectActions = useMemo(() => {
    return selectActions.slice(0, noOfSelectActionsToRenderUpFront);
  }, [noOfSelectActionsToRenderUpFront, selectActions]);

  const selectHiddenOptions = useMemo(() => {
    if (selectActions.length > noOfSelectActionsToRenderUpFront) {
      return selectActions.slice(noOfSelectActionsToRenderUpFront);
    }
    return [];
  }, [noOfSelectActionsToRenderUpFront, selectActions]);

  const _tableActions = useMemo(() => {
    return actions.slice(0, 1);
  }, [actions]);

  const _tableHiddenOptions = useMemo(() => {
    if (actions.length > 1) {
      return actions.slice(1);
    }
    return [];
  }, [actions]);

  const renderPlainButton = (action) => {
    const { value, label, onClick, icon } = action;
    return (
      <OutlinedButton
        key={value}
        label={label}
        onClick={onClick}
        ctrCls={styles.actionButtonCtr}
        icon={icon}
        uniqueId={`${1667397544867}-${value}`}
      />
    );
  };

  const renderDropDownButton = (action) => {
    const { value, label, onClick, menuItems, onMenuItemClick } = action;
    return (
      <DropdownButton
        key={value}
        label={label}
        onClick={onClick}
        ctrCls={styles.dropdownButtonCtr}
        uniqueId={`${1670850969908}-${value}`}
        menuItems={menuItems}
        onMenuItemClick={onMenuItemClick}
      />
    );
  };

  const renderSelectActions = useCallback(() => {
    const getFilteredActions = (from) => {
      return from.filter((action) => {
        if (typeof action.canShow === "function") {
          return action.canShow({
            selectedRows: Object.values(selectedRows.current),
            selectedRowIds: Object.keys(selectedRowIds),
          });
        } else if (typeof action.canShow !== "undefined") {
          return action.canShow;
        } else {
          return true;
        }
      });
    };
    const filteredSelectActions = getFilteredActions(_selectActions);
    const filteredSelectHiddenOptions = getFilteredActions(selectHiddenOptions);

    return (
      <div
        className={styles.selectionControls}
        ref={controlsRef}
        data-testid="selection-controls"
      >
        {filteredSelectActions.map((action) =>
          action.type === ButtonTypes.DROP_DOWN
            ? renderDropDownButton(action)
            : renderPlainButton(action)
        )}
        {filteredSelectHiddenOptions.length > 0 && (
          <IconDropDown
            options={filteredSelectHiddenOptions}
            popperCtrCls={styles.iconDropDownPopper}
          />
        )}
      </div>
    );
  }, [_selectActions, selectHiddenOptions, selectedRowIds, selectedRows]);

  const renderActions = () => {
    return (
      <div className={styles.selectionControls} data-testid="table-controls">
        {_tableActions.map((action) => {
          return (
            <PrimaryButton
              label={action.label}
              key={action.value}
              onClick={action.onClick}
              icon={action.icon}
              uniqueId={`${1667397574268}-${action.value}`}
            />
          );
        })}
        {_tableHiddenOptions.length > 0 && (
          <IconDropDown
            options={_tableHiddenOptions}
            popperCtrCls={styles.iconDropDownPopper}
          />
        )}
      </div>
    );
  };

  const canShowFilterTrigger =
    !(
      loadingState === TableLoadingOptions.LOADING ||
      loadingState === TableLoadingOptions.ERROR
    ) &&
    filterOptions.canEnableGlobalFilter &&
    filterOptions.canEnableFilter;

  return (
    <section ref={sectionRef} className={styles.controls}>
      <div className={styles.priorityControls}>
        {!!title && !isSomeRowsSelected && (
          <span className={styles.title}>{title}</span>
        )}
        <div
          className={styles.filterSearchControls}
          data-testid="filter-search-container"
        >
          {searchOptions.canShowSearch ? (
            <SearchBar
              {...searchOptions}
              ctrCls={styles.searchBar}
              ref={searchBarRef}
              uniqueId={1667397601153}
            />
          ) : (
            <div />
          )}
          {canShowFilterTrigger && (
            <OutlinedButton
              label={t("table.filterLabel")}
              count={isGlobalFilterVisible ? 0 : globalFilters.length}
              uniqueId={1671109213536}
              icon={() => {
                return (
                  <TableFilter
                    className={styles.filterIcon}
                    canRenderOnlyIcon
                  />
                );
              }}
              onClick={() => {
                onToggleGlobalFilter();
              }}
              ctrCls={styles.globalFilterTrigger}
            />
          )}
        </div>
        {!isSomeRowsSelected && _tableActions.length > 0 && renderActions()}
        {isSomeRowsSelected && renderSelectActions()}
      </div>
      {!(
        loadingState === TableLoadingOptions.LOADING ||
        loadingState === TableLoadingOptions.ERROR
      ) && (
        <GlobalLevelFilters
          items={filterOptions.globalFilters?.items ?? {}}
          selectedItems={globalFilters}
          tableRef={tableRef}
          table={table}
          canShow={isGlobalFilterVisible}
          onToggle={onToggleGlobalFilter}
        />
      )}
    </section>
  );
}

HeaderControls.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]),
  searchOptions: PropTypes.shape({
    canShowSearch: PropTypes.bool,
  }),
  selectActions: PropTypes.array,
  isSomeRowsSelected: PropTypes.bool.isRequired,
  actions: PropTypes.array.isRequired,
  noOfSelectActionsToRenderUpFront: PropTypes.number,
  selectedRows: PropTypes.object.isRequired,
  selectedRowIds: PropTypes.object.isRequired,
  isGlobalFilterVisible: PropTypes.bool.isRequired,
  onToggleGlobalFilter: PropTypes.func.isRequired,
  filterOptions: PropTypes.object.isRequired,
  globalFilters: PropTypes.array.isRequired,
  tableRef: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired,
  loadingState: PropTypes.oneOf(Object.values(TableLoadingOptions)),
};

HeaderControls.defaultProps = {
  noOfSelectActionsToRenderUpFront: 4,
  selectActions: [],
};

export default memo(HeaderControls);
