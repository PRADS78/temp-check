import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import styles from "./Table.module.scss";
import PropTypes from "prop-types";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pagination } from "./Pagination";
import { Column, SelectionColumn, ExpansionColumn } from "./models";
import {
  SortOrder,
  TableFilterTypes,
  ButtonTypes,
  TableLoadingOptions,
  PopperReferenceStrategies,
} from "../../Enums";
import { Header, HeaderControls } from "./Header";
import { Checkbox } from "../Checkbox";
import HeaderSelection from "./HeaderSelection";
import { AccordionIcon } from "../../Icons";
import { WobbleRotate } from "../../Animation";
import {
  invariant,
  invariantAutomationPrefixId,
  invariantUniqueId,
} from "../../Utils";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import Body from "./Body";
import { TableFilterListSubTypes } from "../../Enums/index";
import EmptyBody from "./EmptyBody";
import LoadingBody from "./LoadingBody";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const Table = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "Table");
    invariantUniqueId(props.uniqueId, "Table");
  }, [automationIdPrefix, props.uniqueId]);

  const { onRowIdExtractor, onRowSelect, canEnableRowSelection } =
    props.selectOptions;

  const getRowId = useCallback(
    (originalRow, index) => {
      invariant(
        onRowIdExtractor,
        "props.selectOptions.onRowIdExtractor is a mandatory prop"
      );
      if (typeof onRowIdExtractor === "function") {
        return onRowIdExtractor({
          row: originalRow,
          index,
        });
      }
      return originalRow[onRowIdExtractor];
    },
    [onRowIdExtractor]
  );

  const getNewlySelectedRowIds = (rowIds) => {
    const selectedRowIds = rowIds.reduce((acc, rowId) => {
      acc[rowId] = true;
      return acc;
    }, {});
    return selectedRowIds;
  };

  const getNewlyExpandedRowIds = (rowIds) => {
    const expandedRowIds = rowIds.reduce((acc, rowId) => {
      acc[rowId] = true;
      return acc;
    }, {});
    return expandedRowIds;
  };

  const getNewlySelectedRows = useCallback(
    (rows) => {
      const selectedRows = rows.reduce((acc, row, index) => {
        /* istanbul ignore next */
        acc[getRowId(row, index)] = row;
        return acc;
      }, {});
      return selectedRows;
    },
    [getRowId]
  );

  const getNewlyExpandedRows = useCallback(
    (rows) => {
      const expandedRows = rows.reduce((acc, row, index) => {
        /* istanbul ignore next */
        acc[getRowId(row, index)] = row;
        return acc;
      }, {});
      return expandedRows;
    },
    [getRowId]
  );

  const tableRef = useRef();
  const selectedRows = useRef(
    getNewlySelectedRows(props.selectOptions.defaultSelectedRows ?? [])
  );
  const expandedRows = useRef({});
  const tableInnerRef = useRef(null);
  const [expandedRowIds, setExpandedRowIds] = useState({});

  const [selectedRowIds, setSelectedRowIds] = useState(
    getNewlySelectedRowIds(props.selectOptions.defaultSelectedRowIds ?? [])
  );

  /* istanbul ignore next */
  useImperativeHandle(
    ref,
    () => ({
      /* istanbul ignore next */
      selectSpecificRows: ({ rowIds, rows }) => {
        /* istanbul ignore next */
        selectedRows.current = getNewlySelectedRows(rows);
        /* istanbul ignore next */
        setSelectedRowIds(getNewlySelectedRowIds(rowIds));
      },
      deselectAllRows: () => {
        /* istanbul ignore next */
        setSelectedRowIds({});
        /* istanbul ignore next */
        selectedRows.current = {};
      },
      expandSpecificRows: ({ rowIds, rows }) => {
        /* istanbul ignore next */
        expandedRows.current = getNewlyExpandedRows(rows);
        /* istanbul ignore next */
        setExpandedRowIds(getNewlyExpandedRowIds(rowIds));
      },
      closeAllExpanded: () => {
        /* istanbul ignore next */
        setExpandedRowIds({});
        /* istanbul ignore next */
        expandedRows.current = {};
      },
      toggleCurrentPageRows: (isToggle) => {
        /* istanbul ignore next */
        table.toggleAllRowsSelected(isToggle);
      },
    }),
    [getNewlySelectedRows, getNewlyExpandedRows, table]
  );

  const getDefaultFilters = (filterObject) => {
    if (!filterObject) {
      return [];
    }
    return Object.entries(filterObject).map(([key, value]) => {
      return {
        id: key,
        value: value,
      };
    });
  };
  const [columnFilters, setColumnFilters] = useState(
    getDefaultFilters(props.filterOptions.columnFilters?.defaultFilters ?? {})
  );
  const [globalFilters, setGlobalFilters] = useState(
    getDefaultFilters(props.filterOptions.globalFilters?.defaultFilters ?? {})
  );
  const [isGlobalFilterVisible, setIsGlobalFilterVisible] = useState(false);
  const [hasReachedBottomOfThePage, setHasReachedBottomOfThePage] =
    useState(false);
  const [hasReachedTopOfThePage, setHasReachedTopOfThePage] = useState(true);

  const modifiedColumnFiltersRef = useRef(
    props.filterOptions.columnFilters?.defaultFilters ?? {}
  );
  const modifiedGlobalFiltersRef = useRef(
    props.filterOptions.globalFilters?.defaultFilters ?? {}
  );
  const columns = useMemo(() => {
    const _columns = props.columns.map((col) => {
      return new Column(col);
    });
    if (props.selectOptions.canEnableRowSelection) {
      const rowSelectionColumn = new SelectionColumn({
        ctrCls: styles.rowSelection,
        title: ({ table }) => (
          <HeaderSelection
            table={table}
            canEnableMultiRowSelection={
              props.selectOptions.canEnableMultiRowSelection
            }
            onSelectAllPageRows={props.selectOptions.onSelectAllPageRows}
            canEnableAllPageRowsSelection={
              props.selectOptions.canEnableAllPageRowsSelection
            }
            maxCapForSelectAll={props.selectOptions.maxCapForSelectAll}
            selectedRows={selectedRows}
            totalRows={props.totalRows}
          />
        ),
        cell: ({ row }) => {
          return (
            <span
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Checkbox
                isChecked={row.getIsSelected()}
                isDisabled={!row.getCanSelect()}
                onChange={row.getToggleSelectedHandler()}
                ctrCls={styles.checkbox}
                uniqueId={1667399323079}
              />
            </span>
          );
        },
      });
      _columns.unshift(rowSelectionColumn);
    }

    if (props.expandOptions.enableExpanding) {
      const rowExpandColumn = new ExpansionColumn({
        ctrCls: styles.rowExpansion,
        title: "",
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <div
              className={`${styles.rowExpandContainer} ${
                row.getIsExpanded() ? "expanded" : ""
              }`}
              data-role="row-expander-container"
              key={row.index}
            >
              <WobbleRotate in={row.getIsExpanded()}>
                <AccordionIcon
                  data-role="accordion"
                  role="row-expander"
                  onClick={row.getToggleExpandedHandler()}
                  uniqueId={`1672726010001-${row.index}`}
                  className={styles.iconExpand}
                />
              </WobbleRotate>
            </div>
          ) : (
            ""
          );
        },
      });
      _columns.push(rowExpandColumn);
    }

    return _columns;
  }, [
    props.columns,
    props.selectOptions.canEnableRowSelection,
    props.selectOptions.canEnableMultiRowSelection,
    props.selectOptions.onSelectAllPageRows,
    props.selectOptions.canEnableAllPageRowsSelection,
    props.selectOptions.maxCapForSelectAll,
    props.expandOptions.enableExpanding,
    props.totalRows,
  ]);

  const pagination = useMemo(() => {
    return {
      pageIndex: props.pageOptions.offset / props.pageOptions.limit, // Zero based index
      pageSize: props.pageOptions.limit,
    };
  }, [props.pageOptions]);

  const onExpandedChange = (getNewExpandedRowIds) => {
    const newExpandedRowIds = getNewExpandedRowIds(expandedRowIds);

    Object.keys(newExpandedRowIds).map((key) => {
      const expandedRow = props.rows.find((row, index) => {
        return getRowId(row, index) === key;
      });
      if (typeof expandedRow !== "undefined") {
        expandedRows.current[key] = expandedRow;
      } else {
        // Row is not in the current page but
        // expanded and stored in the expandedRows ref
      }
    });

    Object.keys(expandedRows.current).map((key) => {
      if (typeof newExpandedRowIds[key] === "undefined") {
        // Row is expanded
        delete expandedRows.current[key];
      } else {
        // Row is still expanded
      }
    });

    setExpandedRowIds(newExpandedRowIds);

    props.expandOptions.onChange({
      expandedRowIds: Object.keys(newExpandedRowIds),
      expandedRows: Object.values(expandedRows.current),
    });
  };

  const enableRowSelection = (args) => {
    if (canEnableRowSelection === undefined) {
      return false;
    }

    if (typeof canEnableRowSelection === "boolean") {
      return canEnableRowSelection;
    } else {
      const { original: row, index, id } = args;
      return canEnableRowSelection({ row, index, id });
    }
  };

  const onRowSelectionChange = (getNewSelectedRowIds) => {
    const newSelectedRowIds = getNewSelectedRowIds(selectedRowIds);

    Object.keys(newSelectedRowIds).map((key) => {
      const selectedRow = props.rows.find((row, index) => {
        return getRowId(row, index) === key;
      });
      if (typeof selectedRow !== "undefined") {
        selectedRows.current[key] = selectedRow;
      } else {
        // Row is not in the current page but
        // selected and stored in the selectedRows ref
      }
    });

    Object.keys(selectedRows.current).map((key) => {
      if (typeof newSelectedRowIds[key] === "undefined") {
        // Row is unselected
        delete selectedRows.current[key];
      } else {
        // Row is still selected
      }
    });

    setSelectedRowIds(newSelectedRowIds);

    onRowSelect({
      selectedRowIds: Object.keys(newSelectedRowIds),
      selectedRows: Object.values(selectedRows.current),
    });
  };

  const onColumnFiltersChange = (getNewColumnFilters) => {
    const newColumnFilters = getNewColumnFilters(columnFilters);
    setColumnFilters(newColumnFilters);
    const modifiedColumnFilters = {};
    newColumnFilters.forEach((filter) => {
      modifiedColumnFilters[filter.id] = filter.value;
    });
    modifiedColumnFiltersRef.current = modifiedColumnFilters;
    props.filterOptions.onApply({
      columnFilters: modifiedColumnFilters,
      globalFilters: modifiedGlobalFiltersRef.current,
    });
  };

  const onGlobalFilterChange = (getNewGlobalFilters) => {
    const newGlobalFilters = getNewGlobalFilters(globalFilters);
    setGlobalFilters(newGlobalFilters);
    const modifiedGlobalFilters = {};
    newGlobalFilters.forEach((filter) => {
      modifiedGlobalFilters[filter.id] = filter.value;
    });
    modifiedGlobalFiltersRef.current = modifiedGlobalFilters;
    props.filterOptions.onApply({
      columnFilters: modifiedColumnFiltersRef.current,
      globalFilters: modifiedGlobalFilters,
    });
  };

  const getRowCanExpand = (row) => {
    return props.expandOptions.canExpandRow({ row: row.original });
  };

  const table = useReactTable({
    data: props.rows,
    columns,
    pageCount:
      props.totalRows === -1
        ? -1
        : Math.ceil(props.totalRows / props.pageOptions.limit),
    state: {
      rowSelection: selectedRowIds,
      pagination,
      expanded: expandedRowIds,
      columnFilters,
      globalFilter: globalFilters,
    },
    onRowSelectionChange: onRowSelectionChange,
    onExpandedChange: onExpandedChange,
    enableExpanding: props.expandOptions.enableExpanding,
    getRowCanExpand: getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    enableRowSelection: enableRowSelection,
    enableMultiRowSelection: props.selectOptions.canEnableMultiRowSelection,
    getRowId: getRowId,
    enableGlobalFilter: props.filterOptions.canEnableGlobalFilter ?? false,
    enableColumnFilters: props.filterOptions.canEnableColumnFilter ?? false,
    enableFilters: props.filterOptions.canEnableFilter ?? false,
    manualFiltering: true,
    onColumnFiltersChange: onColumnFiltersChange,
    onGlobalFilterChange: onGlobalFilterChange,
  });

  const canShowControls =
    props.searchOptions.canShowSearch ||
    props.actions.length > 0 ||
    !!props.title ||
    (props.selectOptions.canEnableRowSelection &&
      table.getIsSomePageRowsSelected() &&
      props.selectOptions.actions.length > 0);

  useEffect(() => {
    // Update Shadow
    if (props.loadingState === TableLoadingOptions.LOADED) {
      if (tableInnerRef.current && tableRef.current) {
        if (
          tableInnerRef.current.scrollHeight <= tableRef.current.offsetHeight
        ) {
          setHasReachedBottomOfThePage(true);
        } else {
          setHasReachedBottomOfThePage(false);
        }
      }
    }
  }, [props.loadingState]);

  const onScroll = (e) => {
    const isBottom =
      e.currentTarget.offsetHeight + e.currentTarget.scrollTop + 10 >=
      e.currentTarget.scrollHeight;
    if (isBottom && !hasReachedBottomOfThePage) {
      setHasReachedBottomOfThePage(true);
    } else if (!isBottom && hasReachedBottomOfThePage) {
      setHasReachedBottomOfThePage(false);
    }

    const isTop = e.currentTarget.scrollTop <= 10;
    if (isTop && !hasReachedTopOfThePage) {
      setHasReachedTopOfThePage(true);
    } else if (!isTop && hasReachedTopOfThePage) {
      setHasReachedTopOfThePage(false);
    }
  };

  const _onSizeChange = useCallback(
    (args) => {
      props.pageOptions.onSizeChange(args);
    },
    [props.pageOptions]
  );

  const renderBody = () => {
    const colSpan = table.getAllColumns().length;
    switch (props.loadingState) {
      case TableLoadingOptions.LOADING:
        return <LoadingBody colSpan={colSpan} tableInnerRef={tableInnerRef} />;
      case TableLoadingOptions.LOADED:
        return (
          <Body
            rows={table.getRowModel().rows}
            canSelectByClickingFullRow={
              props.selectOptions.canSelectByClickingFullRow
            }
            isRowClickable={props.isRowClickable}
            onRowClick={props.onRowClick}
            expandOptions={props.expandOptions}
          />
        );
      case TableLoadingOptions.EMPTY:
        return (
          <EmptyBody
            emptyOptions={props.emptyOptions}
            colSpan={colSpan}
            columnFilters={modifiedColumnFiltersRef.current}
            globalFilters={modifiedGlobalFiltersRef.current}
            searchOptions={props.searchOptions}
            tableInnerRef={tableInnerRef}
          />
        );
      case TableLoadingOptions.ERROR:
        return (
          <tbody>
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className={styles.emptyContainer}
              >
                <span>{t("table.errorMsg")}</span>
              </td>
            </tr>
          </tbody>
        );
    }
  };

  return (
    <div
      className={`${styles.tableCtr} ${props.ctrCls} ${
        props.canShowScrollBar ? styles.withScrollBar : ""
      }`}
      ref={tableRef}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-table`}
    >
      {canShowControls && (
        <>
          <HeaderControls
            searchOptions={props.searchOptions}
            selectActions={props.selectOptions.actions}
            isSomeRowsSelected={Object.keys(selectedRowIds).length > 0}
            actions={props.actions}
            title={props.title}
            selectedRowIds={selectedRowIds}
            selectedRows={selectedRows}
            noOfSelectActionsToRenderUpFront={
              props.selectOptions.noOfSelectActionsToShowUpFront
            }
            isGlobalFilterVisible={isGlobalFilterVisible}
            onToggleGlobalFilter={() => {
              setIsGlobalFilterVisible(!isGlobalFilterVisible);
            }}
            filterOptions={props.filterOptions}
            globalFilters={globalFilters}
            tableRef={tableRef}
            table={table}
            loadingState={props.loadingState}
          />
        </>
      )}
      <div
        className={`${styles.tableInnerCtr} ${
          !props.canShowScrollBar ? "no-scroll" : styles.withScrollBar
        }`}
        ref={tableInnerRef}
        onScroll={onScroll}
        data-testid="table-scrollable-content"
      >
        <table
          className={`${
            props.loadingState !== TableLoadingOptions.LOADED
              ? styles.unloadedState
              : ""
          }`}
        >
          <Header
            sortOptions={props.sortOptions}
            table={table}
            selectActions={props.selectOptions.actions}
            hasReachedTopOfThePage={hasReachedTopOfThePage}
            columnFilters={props.filterOptions.columnFilters?.items ?? {}}
            tableRef={tableRef}
            isGlobalFilteredEnabled={isGlobalFilterVisible}
          />
          {renderBody()}
        </table>
      </div>
      <Pagination
        sizeItems={props.pageOptions.sizeItems}
        sizeMultiplier={props.pageOptions.sizeMultiplier}
        noOfSizeItems={props.pageOptions.noOfSizeItems}
        table={table}
        rows={props.rows}
        totalRows={props.totalRows}
        onPrevious={props.pageOptions.onPrevious}
        onNext={props.pageOptions.onNext}
        offset={props.pageOptions.offset}
        limit={props.pageOptions.limit}
        onSizeChange={_onSizeChange}
        onSet={props.pageOptions.onSet}
        tableRef={tableRef}
        isEndOfList={props.isEndOfList}
        selectedRowIds={selectedRowIds}
        singularSelectedLabel={props.selectOptions.singularSelectedLabel}
        pluralSelectedLabel={props.selectOptions.pluralSelectedLabel}
        hasReachedBottomOfThePage={hasReachedBottomOfThePage}
        loadingState={props.loadingState}
        canShowScrollBar={props.canShowScrollBar}
        noOfPagesDropDownOptions={props.pageOptions?.noOfPagesDropDownOptions}
        pageSelectionDropDownOptions={
          props.pageOptions?.pageSelectionDropDownOptions
        }
      />
    </div>
  );
});

Table.propTypes = {
  /**
   * Container class provided for the Table Component
   */
  ctrCls: PropTypes.string,
  /**
   * Columns of the Table component
   *
   * **Example**
   *
   * ```json
   *  [
   *    {
   *       id: "name",
   *       key: (row) => `${row.firstName} ${row.lastName}`,
   *       title: "Name",
   *       ctrCls: "name",
   *    },
   *    {
   *       key: "username",
   *       title: "Username",
   *       isSortable: true,
   *    },
   *    {
   *       key: "age",
   *       title: "Age",
   *       isSortable: true,
   *       onRenderer: ({ row }) => (<b>{row.age}</b>)
   *    },
   *  ]
   * ```
   *
   */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
      title: PropTypes.string.isRequired,
      isSortable: PropTypes.bool,
      isGrouped: PropTypes.bool,
      ctrCls: PropTypes.string,
      canShowAvatar: PropTypes.bool,
      isClickable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      onClick: PropTypes.func,
      onRenderer: PropTypes.func,
    })
  ),
  /**
   * Properties related to pagination
   *
   * **Example**
   *
   * ```json
   *  {
   *    limit: 10,
   *    offset: 0,
   *    onNext: () => console.log("Next page is clicked"),
   *    onPrevious: () => console.log("Prev page is clicked"),
   *    onSizeChange: () => console.log("number of items have been changed"),
   *    onSet: () => console.log("page is selected directly"),
   *    sizeItems: [ ], // items properties of Dropdown
   *    sizeMultiplier: 10, // Change the items per page multiplier
   *    noOfSizeItems: 4 // No of options for items per page
   *    noOfPagesDropDownOptions: {
   *      "popperReferenceStrategy": PopperReferenceStrategies.FIXED // Please check the docs of Dropdown
   *    },
   *    pageSelectionDropDownOptions: {
   *      "popperReferenceStrategy": PopperReferenceStrategies.ABSOLUTE // Please check the docs of Dropdown
   *    }
   *  }
   * ```
   *
   */
  pageOptions: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
    onNext: PropTypes.func,
    onPrevious: PropTypes.func,
    onSizeChange: PropTypes.func,
    onSet: PropTypes.func,
    sizeItems: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.number,
      })
    ),
    sizeMultiplier: PropTypes.number,
    noOfSizeItems: PropTypes.number,
    noOfPagesDropDownOptions: PropTypes.shape({
      popperReferenceStrategy: PropTypes.oneOf(
        Object.values(PopperReferenceStrategies)
      ),
    }),
    pageSelectionDropDownOptions: PropTypes.shape({
      popperReferenceStrategy: PropTypes.oneOf(
        Object.values(PopperReferenceStrategies)
      ),
    }),
  }),
  /**
   * Data of the Table
   */
  rows: PropTypes.array.isRequired,
  /**
   * Sort options for the Table
   */
  sortOptions: PropTypes.shape({
    by: PropTypes.string,
    order: PropTypes.oneOf([null, SortOrder.ASCENDING, SortOrder.DESCENDING]),
    onChange: PropTypes.func,
  }),
  /**
   * Total number of Rows in the Table
   */
  totalRows: PropTypes.number.isRequired,
  /**
   * When `totalRows` is unknown you can use this to denote the end of list and pass `totalRows` as -1
   */
  isEndOfList: PropTypes.bool,
  /**
   * Search options for Table, accepts all the props of DisprzSearchBar component expect `ctrCls`
   */
  searchOptions: PropTypes.shape({
    canShowSearch: PropTypes.bool,
  }),

  expandOptions: PropTypes.shape({
    /**
     * Sub Row will be rendered when enableExpanding is true
     */
    enableExpanding: PropTypes.bool,
    /**
     * If any row not needed to render sub Row, We can use this function
     */
    canExpandRow: PropTypes.func,
    /**
     * Rendering Sub Row by consumer
     */
    onRenderer: PropTypes.func,
    /**
     * When the type is Non-Cohesive, Whatever consumer need to render will be render as Sub Row
     */
    type: PropTypes.string,
    /**
     * Consumer can use expanded rows after expanded
     */
    onChange: PropTypes.func,
  }),
  /**
   * Option related to selection of rows
   */
  selectOptions: PropTypes.shape({
    onRowSelect: PropTypes.func,
    canEnableRowSelection: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.func,
    ]),
    canEnableAllPageRowsSelection: PropTypes.bool,
    canEnableMultiRowSelection: PropTypes.bool,
    onRowIdExtractor: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
      .isRequired,
    canSelectByClickingFullRow: PropTypes.bool,
    onSelectAllPageRows: PropTypes.func,
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        onClick: PropTypes.func,
        icon: PropTypes.func,
        type: PropTypes.oneOf([ButtonTypes.PLAIN, ButtonTypes.DROP_DOWN]),
        menuItems: PropTypes.array,
        onMenuItemClick: PropTypes.func,
      })
    ),
    singularSelectedLabel: PropTypes.string,
    pluralSelectedLabel: PropTypes.string,
    maxCapForSelectAll: PropTypes.number,
    noOfSelectActionsToShowUpFront: PropTypes.number,
    defaultSelectedRows: PropTypes.array,
    defaultSelectedRowIds: PropTypes.array,
  }),
  /**
   * Actions that are displayed on the top right of the Table
   */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node,
        PropTypes.number,
        PropTypes.array,
        PropTypes.object,
      ]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onClick: PropTypes.func,
      icon: PropTypes.func,
    })
  ),
  /**
   * Title of the Table displayed on the top left
   */
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.node,
  ]),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * When set to true or a function returning true, the row is clickable
   */
  isRowClickable: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  /**
   * Callback function when a row is clicked
   */
  onRowClick: PropTypes.func,
  /**
   * Filter options for the Table
   *
   * **Example**
   *
   * ```json
   * {
   *  columnFilters: {
   *    items: {
   *      gender: { // key of the column
   *        id: "gender"
   *        type: TableFilterTypes.LIST,
   *        isMultiSelect: true, // Only for List type
   *        subType: TableFilterListSubTypes.ON_DEMAND, // Only for List type
   *        options: [
   *          {
   *            label: "Male",
   *            value: "male"
   *          },
   *          {
   *            label: "Female",
   *            value: "female"
   *          }
   *        ]
   *      },
   *      joiningDate: {
   *        id: "joiningDate",
   *        type: TableFilterTypes.DATE,
   *        minDate: new Date("2021-10-01"),
   *        maxDate: new Date("2021-12-31"),
   *        onQuickActions: (actions) => actions.splice(0, actions.length) // Check DatePicker onQuickActions doc for more information
   *      },
   *      age: {
   *        id: "age",
   *        label: "Age",
   *        type: TableFilterTypes.NUMBER,
   *        min: 0,
   *        max: 100
   *      }
   *    },
   *    defaultFilters: {
   *      gender: {
   *        female: true
   *      },
   *      joiningDate: [
   *        new Date("2020-11-01"),
   *        new Date("2020-12-31")
   *      ],
   *      age: [20, 30]
   *    }
   *  },
   *  globalFilters: {
   *    items: {
   *      1: {
   *        id: 1,
   *        label: "Location",
   *        type: TableFilterTypes.LIST,
   *        isPinned: true,
   *        isMultiSelect: true, // Only for List type
   *        subType: TableFilterListSubTypes.ON_DEMAND, // Only for List type
   *        options: [
   *          {
   *            label: "Chennai",
   *            value: 100
   *          },
   *          {
   *            label: "Bangalore",
   *            value: 101
   *          }
   *        ],
   *        onQuickActions: (actions) => actions.splice(0, actions.length) // Check DatePicker onQuickActions doc for more information
   *      }
   *    },
   *    defaultFilters: {
   *      1: {
   *        101: true,
   *      }
   *    }
   *  }
   * }
   * ```
   *
   */
  filterOptions: PropTypes.shape({
    canEnableFilter: PropTypes.bool,
    canEnableColumnFilter: PropTypes.bool,
    canEnableGlobalFilter: PropTypes.bool,
    columnFilters: PropTypes.shape({
      items: PropTypes.shape({
        id: PropTypes.shape({
          options: PropTypes.arrayOf(
            PropTypes.shape({
              label: PropTypes.string,
              value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            })
          ),
          subType: PropTypes.oneOf([
            TableFilterListSubTypes.ON_DEMAND,
            TableFilterListSubTypes.PAGINATED,
          ]),
          isMultiSelect: PropTypes.bool,
          type: PropTypes.oneOf([
            TableFilterTypes.LIST,
            TableFilterTypes.DATE,
            TableFilterTypes.NUMBER,
          ]),
          minDate: PropTypes.instanceOf(Date),
          maxDate: PropTypes.instanceOf(Date),
          min: PropTypes.number,
          max: PropTypes.number,
          onQuickActions: PropTypes.func,
        }),
      }),
      defaultFilters: PropTypes.object,
    }),
    globalFilters: PropTypes.shape({
      items: PropTypes.shape({
        id: PropTypes.shape({
          options: PropTypes.arrayOf(
            PropTypes.shape({
              label: PropTypes.string,
              value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            })
          ),
          subType: PropTypes.oneOf([
            TableFilterListSubTypes.ON_DEMAND,
            TableFilterListSubTypes.PAGINATED,
          ]),
          isMultiSelect: PropTypes.bool,
          label: PropTypes.string,
          type: PropTypes.oneOf([
            TableFilterTypes.LIST,
            TableFilterTypes.DATE,
            TableFilterTypes.NUMBER,
          ]),
          minDate: PropTypes.instanceOf(Date),
          maxDate: PropTypes.instanceOf(Date),
          min: PropTypes.number,
          max: PropTypes.number,
          onQuickActions: PropTypes.func,
        }),
      }),
      defaultFilters: PropTypes.object,
    }),
    onApply: PropTypes.func,
  }),
  /**
   * When set to true, the table will show a scroll bar
   */
  canShowScrollBar: PropTypes.bool,
  /**
   * Display empty message, when no rows are return
   *
   * **Example**
   *
   *   emptyOptions: {
   *    message: "No rows Found!",
   *    actionText: "Clear All",
   *    onAction: () => {}
   *    onRenderer: ({ filter, searchOptions }) => {
   *      return <div>No rows Found!</div>;
   *    },
   *  },
   */
  emptyOptions: PropTypes.shape({
    icon: PropTypes.func,
    message: PropTypes.string,
    onRenderer: PropTypes.func,
    actionText: PropTypes.string,
    onAction: PropTypes.func,
    canShowAction: PropTypes.bool,
  }),
  /**
   * loading state of the table
   */
  loadingState: PropTypes.oneOf([
    TableLoadingOptions.LOADING,
    TableLoadingOptions.LOADED,
    TableLoadingOptions.EMPTY,
    TableLoadingOptions.ERROR,
  ]),
};

Table.defaultProps = {
  ctrCls: "",
  columns: [],
  rows: [],
  isEndOfList: false,
  totalRows: 0,
  pageOptions: {},
  searchOptions: {},
  selectOptions: {},
  expandOptions: {},
  sortOptions: {},
  filterOptions: {},
  actions: [],
  title: "",
  isRowClickable: false,
  onRowClick: () => undefined,
  canShowScrollBar: false,
  emptyOptions: {
    icon: null,
    message: "Sorry! No result found",
    actionText: "Clear All",
    onAction: () => undefined,
    canShowAction: true,
  },
  loadingState: TableLoadingOptions.LOADED,
};

Table.displayName = "Table";

export default Table;
