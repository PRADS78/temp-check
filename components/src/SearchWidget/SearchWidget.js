import { Component } from "react";
import ColumnTypes from "../ColumnTypes";
import SortOrder from "../SortOrder";
import LoadingStates from "../LoadingStates";
import CenterMessageDisplay from "../CenterMessageDisplay/CenterMessageDisplay";
import Checkbox from "../Checkbox/Checkbox";
import AppIcon from "../AppIcon/AppIcon";
import PagingType from "../PagingType";
import AppButton from "../AppButton/AppButton";
import moment from "moment";
import LocalizedOverlay from "../LocalizedOverlay/LocalizedOverlay";
import DropDown from "../DropDown/DropDown";
import Pagination from "../Pagination/Pagination";
import Scrollbars from "react-custom-scrollbars";
import "./SearchWidget.scss";
import PropTypes from "prop-types";

class SearchWidget extends Component {
  constructor(props) {
    super(props);
    this.state = this.augmentWithSearchAndFilterInputs({
      allRowsSelected: false,
      rows: [],
      selectedRowIds: [].concat(this.props.defaultSelectedList) || [],
      rowIdsMarkedForRemoval: [],
      rowIdsBeingRemoved: [],
      loadingState: LoadingStates.FETCHING,
      sortColumn: this.props.sortColumn || "",
      sortOrder: this.props.sortOrder || SortOrder.ASC,
      isDeleteConfirmationShown: false,
      loadedRecordsCount: this.props.pageSize,
      currentRowNumber: null,
      currentPaginationIndex: this.props.currentPaginationIndex,
    });
    this.cellLoadingIndicatorValue = "~!";
  }

  componentDidMount() {
    this.prepareAndRenderRows(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    //assumption is that identifier column props remains same
    //and not changed in between
    let idKey = this.props.identifierColumn;
    let getKey = (d) => {
      return d[idKey];
    };
    // let oldData =
    //   (this.props.rowsData || []).map(getKey).join("_") +
    //   `_${this.props.sortColumn}_${this.props.sortOrder}`;
    // let newData =
    //   (nextProps.rowsData || []).map(getKey).join("_") +
    //   `_${nextProps.sortColumn}_${nextProps.sortOrder}`;

    // if (oldData !== newData) {
    // update rows
    this.prepareAndRenderRows(nextProps);
    // }
  }

  render() {
    let toRender = "";
    const message = this.props.fetchingMessage;
    switch (this.state.loadingState) {
      case LoadingStates.FETCHING:
        toRender = (
          <CenterMessageDisplay
            ctrCls={
              this.props.ctrCls || "col-xs-12 v-span-viewport-below-top-bar"
            }
            message={message}
            showSpinner={true}
          />
        );
        break;
      case LoadingStates.FETCHED_BUT_EMPTY:
        let ctrCls =
          this.props.ctrCls ||
          "col-xs-12 col-md-offset-1 col-md-10 col-lg-offset-2 col-lg-8 v-span-viewport-below-top-bar";
        toRender = (
          <div className={`search-widget v2 empty-widget-view ${ctrCls}`}>
            <div className="text-center widget-title">{this.props.title}</div>
            {this.props.isProcessing ? this.getPartialLoadingMask() : ""}
            <Scrollbars className={"widget-grid-ctr empty-data "}>
              <div className="header-and-filters-ctr">
                {this.getHeaderRow()}
              </div>
              <div className="widget-grid">
                <div className="text-center empty-content">
                  {this.props.emptyMessage || "No data to show."}
                </div>
              </div>
            </Scrollbars>
            <div className="text-center buttons-ctr">
              {this.props.hideBottomButtons ? "" : this.getButtons()}
              {this.props.children}
            </div>
          </div>
        );
        break;
      case LoadingStates.FETCHED_AND_AVAILABLE:
        let rowsToShow = [],
          filteredRows = this.getSortedRows(this.getFilteredRows());
        filteredRows.forEach((rowInfo, i) => {
          if (this.props.isPagingNeeded) {
            if (i < this.state.loadedRecordsCount) {
              rowsToShow.push(this.getSingleRow(rowInfo, filteredRows, i));
            }
          } else {
            rowsToShow.push(this.getSingleRow(rowInfo, filteredRows, i));
          }
        });
        let title = "Search / Filter Users";
        if (typeof this.props.title === "function") {
          title = this.props.title(this.state.rows.length);
        } else if (typeof this.props.title === "string" && this.props.title) {
          title = this.props.title;
        }
        toRender = this.wrapContentInsideGrid(
          title,
          rowsToShow,
          this.props.searchable,
          filteredRows.length
        );
        break;
    }
    return toRender;
  }

  getShowingRecordsWithRowsLabel = (currentrows, totalRecords) => {
    return (
      this.props.recordsWithRowLabel ||
      `Showing ${currentrows} of ${totalRecords} records`
    );
  };
  wrapContentInsideGrid = (
    title,
    content,
    includeSearchAndFilterRow,
    totalNumberOfRecords
  ) => {
    let extraButtons = [],
      toIncludeUseButton = false;
    let loadMoreButton = "";
    if (this.props.children && this.props.children.length > 0) {
      toIncludeUseButton = this.props.includeUseButttonInMyChildren;
    } else {
      toIncludeUseButton = true;
    }
    if (true) {
      let useButtonLabel = this.props.selectLabel || "Select..."; // "Use";
      if (typeof this.props.proceedButtonLabel === "function") {
        useButtonLabel = this.props.proceedButtonLabel(
          this.state.selectedRowIds.length
        );
      } else if (typeof this.props.proceedButtonLabel === "string") {
        useButtonLabel = this.props.proceedButtonLabel;
      }
      extraButtons.push(
        <AppButton
          buttonLabel={useButtonLabel}
          buttonCls="action use-btn"
          buttonIconCls={this.props.proceedButtonIconCls}
          key={2}
          clickHandler={this.proceedWithSelection}
          disabled={this.state.selectedRowIds.length === 0}
        />
      );
    }
    if (this.props.allowMultiDelete) {
      let deleteButtonLabel = this.props.deleteLabel || "Delete";
      if (typeof this.props.deleteButtonLabel === "function") {
        deleteButtonLabel = this.props.deleteButtonLabel(
          this.state.selectedRowIds.length
        );
      } else if (typeof this.props.deleteButtonLabel === "string") {
        deleteButtonLabel = this.props.deleteButtonLabel;
      }

      extraButtons.push(
        <AppButton
          buttonLabel={deleteButtonLabel}
          buttonIconCls="icon-trash"
          buttonCls="secondary-button delete-btn"
          key={3}
          clickHandler={this.deleteHandler}
          disabled={this.state.selectedRowIds.length === 0}
        />
      );
    }

    if (this.props.isPagingNeeded) {
      if (totalNumberOfRecords > this.state.loadedRecordsCount) {
        title = this.getShowingRecordsWithRowsLabel();
        // extraButtons.push(
        //     <Controls buttonLabel={"Load more.."}
        //                buttonIconCls="icon-reupload" buttonCls=""
        //                key={4} clickHandler={this.loadMore}/>);
        loadMoreButton = (
          <AppButton
            buttonLabel={this.props.loadMoreButtonLabel || "Load More..."}
            buttonIconCls="icon-reupload"
            buttonCls=""
            key={4}
            clickHandler={this.loadMore}
          />
        );
      } else {
        title =
          this.props.showingRecordsLabel || `Showing ${content.length} records`;
      }
    }

    if (this.props.serverSidePaging) {
      if (this.state.rows.length > totalNumberOfRecords) {
        title = this.getShowingRecordsWithRowsLabel();
      } else {
        title = this.getShowingRecordsWithRowsLabel();
      }

      if (this.props.pageLoadingState === LoadingStates.FETCHED_AND_AVAILABLE) {
        // extraButtons.push(
        //     <Controls buttonLabel={"Load more.."}
        //                buttonIconCls="icon-reupload" buttonCls="load-more-btn" disabled={this.props.hasNextPage}
        //                key={5} clickHandler={this.props.loadMore}/>);
        loadMoreButton = (
          <AppButton
            buttonLabel={this.props.loadMoreButtonLabel || "Load More..."}
            buttonIconCls="icon-reupload"
            buttonCls="load-more-btn"
            disabled={this.props.hasNextPage}
            key={5}
            clickHandler={this.serverSideLoadMore}
          />
        );
      } else {
        // extraButtons.push(<div key={6} className="loading-spinner"/>);
        loadMoreButton = <div className="loading-spinner" />;
      }
    }

    if (
      this.props.pagingType === PagingType.NUMBERED &&
      this.props.isPagingNeeded
    ) {
      let selectedRecords = this.props.nonSelectable ? (
        ""
      ) : (
        <div>
          {this.props.selectRecordsLable ||
            `${this.state.selectedRowIds.length} Records Selected`}
          {this.state.selectedRowIds.length === 0 ? null : (
            <span className="clear-selection" onClick={this.clearSelection}>
              {this.props.clearText || "Clear"}
            </span>
          )}
        </div>
      );
      const countLists = [
        { label: 10, value: 10 },
        { label: 15, value: 15 },
        { label: 20, value: 20 },
        { label: 25, value: 25 },
      ];
      loadMoreButton = (
        <Pagination
          onFetchCountChange={(value) => {
            this.setState({
              loadedRecordsCount: value,
              currentPaginationIndex: 1,
            });
            this.props.onFetchCountChange(value);
          }}
          showingRecordWithPageSizeLabel={
            this.props.showingRecordWithPageSizeLabel
          }
          onPageIndexChange={this.onPageIndexChange}
          isProcessing={this.isProcessing()}
          rows={this.state.rows}
          totalCount={this.props.totalCount}
          pageSize={this.props.pageSize}
          currentPaginationIndex={this.state.currentPaginationIndex}
          itemsPerPageText={this.props.itemsPerPageText}
          pageSizeText={this.props.pageSizeText}
        />
      );
    }

    let ctrCls =
      this.props.ctrCls ||
      "col-xs-12 col-md-offset-1 col-md-10 col-lg-offset-2 col-lg-8 v-span-viewport-below-top-bar";

    let ScrollContainer = this.props.useDefaultScroll ? "div" : Scrollbars;
    let widgetContent = (
      <ScrollContainer
        className={
          "widget-grid-ctr " +
          (this.props.hideBottomButtons ? "no-bottom-buttons" : "")
        }
      >
        <div className="header-and-filters-ctr">
          {this.getHeaderRow()}
          {includeSearchAndFilterRow ? this.getSearchAndFilterRow() : ""}
        </div>
        {this.getSelectAllRecordsUI()}
        <div className="widget-grid">{content}</div>
      </ScrollContainer>
    );
    if (this.props.needHorizontalScroll) {
      widgetContent = (
        <div className="widget-scroll-container">{widgetContent}</div>
      );
    }
    let hideButtonsCls = "";
    if (
      this.props.hideBottomButtons &&
      !this.props.children &&
      !loadMoreButton
    ) {
      hideButtonsCls = "hidden";
    }
    return (
      <div className={ctrCls + " search-widget v2"}>
        <div className="text-center widget-title">{title}</div>
        {this.showDeleteConfirmation()}
        {this.props.isProcessing ? this.getPartialLoadingMask() : ""}
        {widgetContent}
        <div className={`text-center buttons-ctr ${hideButtonsCls}`}>
          {this.props.isPagingNeeded && loadMoreButton}
          {this.props.hideBottomButtons ? "" : this.getButtons()}
          {this.props.hideBottomButtons ? "" : extraButtons}
          {this.props.children}
        </div>
      </div>
    );
  };
  serverSideLoadMore = () => {
    this.setState(
      {
        loadedRecordsCount: this.state.loadedRecordsCount + this.props.pageSize,
      },
      function () {
        this.props.loadMore();
      }
    );
  };
  showDeleteConfirmation = () => {
    if (this.state.isDeleteConfirmationShown) {
      let selectedRows = this.state.rows.filter((rowInfo) => {
        return this.state.selectedRowIds.contains(rowInfo.identifier);
      });

      return (
        <LocalizedOverlay>
          <div className="multi-delete-confirmation">
            <div className="confirmation-text">
              {selectedRows.length === 1
                ? this.props.deleteMultipleEntryConfirmation ||
                  "Are you sure you want to delete the selected entry?"
                : this.props.deleteMultipleEntryConfirmationPlural ||
                  "Are you sure you want to delete the selected entries?"}
            </div>
            <AppButton
              buttonIconCls="icon-okay"
              buttonLabel="common.yesButton"
              buttonCls="action"
              clickHandler={this.proceedToDeleteSelectedRows}
            />
            <AppButton
              buttonIconCls="icon-close-delete"
              buttonLabel="common.noButton"
              buttonCls="secondary-button"
              clickHandler={this.cancelDeleteHandler}
            />
          </div>
        </LocalizedOverlay>
      );
    }
    return "";
  };
  getSelectAllRecordsUI = () => {
    if (
      !this.props.serverSidePaging ||
      this.props.pagingType !== PagingType.NUMBERED
    ) {
      return;
    }
    let msg;
    let allRowsSelected =
      this.props.totalCount === this.state.selectedRowIds.length;
    let isOnlyCurrentPageSelected =
      this.state.rows.length === this.state.selectedRowIds.length;
    const {
      allUsersSelectedSingularLabel,
      allUsersSelectedPluralLabel,
      singleUserLabel,
      multipleUsersLabel,
    } = this.props;
    if (allRowsSelected) {
      if (this.state.selectedRowIds.length === 1) {
        msg =
          typeof allUsersSelectedSingularLabel === "function"
            ? allUsersSelectedSingularLabel(1)
            : "1 User is selected";
      } else {
        msg =
          typeof allUsersSelectedPluralLabel === "function"
            ? allUsersSelectedPluralLabel(this.props.totalCount)
            : `All ${this.props.totalCount} Users are selected`;
      }
    } /* else if (isOnlyCurrentPageSelected) {
      if (this.state.selectedRowIds.length === 1) {
        msg =
          this.props.currentPageSelectedUserSingularLabel ||
          "1 User on this page is selected";
      } else {
        msg =
          this.props.currentPageSelectedPluralLabel ||
          `All ${this.state.selectedRowIds.length} Users on this page are selected`;
      }
    } */ else {
      if (this.state.selectedRowIds.length === 1) {
        msg =
          typeof singleUserLabel === "function"
            ? singleUserLabel(1)
            : `1 User is selected`;
      } else {
        msg =
          typeof multipleUsersLabel === "function"
            ? multipleUsersLabel(this.state.selectedRowIds.length)
            : `${this.state.selectedRowIds.length} Users are selected`;
      }
    }
    let selectedAllPopup = (
      <div className="all-selected-rows-ctr">
        <span className="message-text">{msg}</span>
        {this.props.canShowSelectAllRecordsButton && (
          <>
            {this.state.selectedRowIds.length > 0 && (
              <span className="clickable" onClick={this.clearSelection}>
                {this.props.clearSelectionLabel || "Clear Selection"}
              </span>
            )}
            &nbsp; &nbsp;
            {!allRowsSelected && (
              <span
                className="clickable"
                onClick={this.getAllRecordsForSelection}
              >
                {typeof this.props.selectAllUsersLabel === "function"
                  ? this.props.selectAllUsersLabel(this.props.totalCount)
                  : `Select All ${this.props.totalCount} Users`}
              </span>
            )}
          </>
        )}
      </div>
    );

    if (this.state.selectedRowIds.length === 0 || this.props.totalCount === 0) {
      return null;
    } else {
      return selectedAllPopup;
    }
  };
  getAllRecordsForSelection = () => {
    this.props.onFetchAllRecordsForSelection((rowIds) => {
      var selectedRowIds = this.state.selectedRowIds
        .concat(rowIds || [])
        .reduce(function (r, id) {
          if (r.indexOf(id) === -1) {
            r.push(id);
          }
          return r;
        }, []);
      this.setState({
        selectedRowIds: selectedRowIds,
        allRowsSelected: true,
      });
    }, this.props.totalCount);
  };
  isRowListSubsetOfSelectedRowIds = () => {
    let isSubset = true;
    this.state.rows.forEach((row) => {
      let isRowPresent = this.state.selectedRowIds.findIndex((rowId) => {
        return rowId === row.identifier;
      });
      if (isRowPresent === -1) {
        isSubset = false;
      }
    });
    return isSubset;
  };
  clearSelection = () => {
    this.setState(
      {
        allRowsSelected: false,
        selectedRowIds: [],
      },
      () => {
        this.props.onClearAllSelection();
      }
    );
  };
  cancelDeleteHandler = (e) => {
    this.setState({
      isDeleteConfirmationShown: false,
    });
  };
  proceedToDeleteSelectedRows = (e) => {
    let selectedRows = this.state.rows.filter((rowInfo) => {
      return this.state.selectedRowIds.contains(rowInfo.identifier);
    });
    this.setState(
      {
        isDeleteConfirmationShown: false,
      },
      function () {
        this.props.onDelete(selectedRows);
      }
    );
  };
  getSingleRow = (rowInfo, filteredRows, index) => {
    let isSelected = this.state.selectedRowIds.contains(rowInfo.identifier);
    let identifier = rowInfo.identifier || index;
    let canSelect =
      !(typeof rowInfo.data.isSelectable === "function") ||
      rowInfo.data.isSelectable(rowInfo.data) === true;
    canSelect =
      canSelect && !this.state.rowIdsBeingRemoved.contains(rowInfo.identifier);
    let toDisableRow =
      !canSelect ||
      (this.props.defaultSelectedList.contains(rowInfo.identifier) &&
        this.props.markDefaultSelectionAsReadonly === true);

    let columns = [],
      buttonCells = [];
    if (!this.props.nonSelectable && window.innerWidth >= 768) {
      columns.push(
        <div
          className="col-xs-1 row-item checkbox-item"
          key={`row-${identifier}-col-${new Date().valueOf()}`}
        >
          <Checkbox
            value={isSelected}
            data={rowInfo.identifier}
            disabled={toDisableRow}
            onChange={this.toggleRowSelectionByCheckbox}
            label=""
          />
        </div>
      );
    }

    this.props.columns.forEach((columnCfg, i) => {
      let value,
        columnValue = this.getColumnValue(
          rowInfo.data,
          columnCfg,
          filteredRows,
          i
        ),
        columnTxt; // rowInfo.data[columnCfg.key];

      let columnCls = columnCfg.type === 1 ? "number-column" : "string-column";

      if (columnCfg.searchable) {
        // If this column is searchable, check if the search string matches the column value
        let searchString = this.state[`searchInput_${columnCfg.key}`];
        if (searchString && searchString.length > 0) {
          let parts = [],
            start = 0;

          // Using a regex matching of the searched string within columnValue, to highlight the matches
          columnValue.replace(
            new RegExp(searchString.toLowerCase(), "ig"),
            (match, o, s) => {
              parts.push(s.substring(start, o));
              parts.push(
                <b key={`b-${i}-${o}`}>
                  <i key={`i-${i}-${o}`}>{match}</i>
                </b>
              );
              start = o + match.length;
              return match;
            }
          );
          parts.push(columnValue.substring(start));
          value = parts;
        } else {
          value = columnValue;
        }
      } else if (columnCfg.filterable) {
        // If this column is filterable, check if the filtered value matches the column value
        let filterValue = this.state[`filterValue_${columnCfg.key}`];
        if (
          filterValue &&
          filterValue.length > 0 &&
          filterValue.toLowerCase() !== "all"
        ) {
          value = (
            <b>
              <i>{columnValue}</i>
            </b>
          );
        } else {
          value = columnValue;
        }
      } else if (typeof columnCfg.renderer === "function") {
        value = columnValue;
      } else {
        value = (
          <span>{`${
            columnValue === ""
              ? columnCfg.emptyText || this.getEmptyValue()
              : columnValue
          }`}</span>
        );
      }
      if (columnCfg.type === ColumnTypes.VISUAL_NUMBER) {
        columnCls = "visual-number-column";
        let maxValue = this.getMaxValueOfColumn(
          this.getSortedRows(this.getFilteredRows()),
          columnCfg
        );
        let percentage = maxValue === 0 ? 0 : (columnValue / maxValue) * 100;
        let fillStyle = {
          width: `${columnValue < 0 ? 0 : percentage}%`,
        };
        columnTxt =
          columnValue === "-" || columnValue === 0 || columnValue === "0" ? (
            "-"
          ) : (
            <div className={"visual-render-container"}>
              <div className={"visual-render-holder"}>
                <div className={"visual-renderer"} style={fillStyle} />
                <span>{columnValue}</span>
              </div>
            </div>
          );
      } else if (columnCfg.type === ColumnTypes.COMPLETION_INDICATOR) {
        columnCls = "completion-status";
        let colorCls = this.getCompletionIndicatorColorCls(rowInfo, columnCfg);
        columnTxt = (
          <div className={"progress-indicator"}>
            <span className={"color-indicator " + colorCls}>
              <span className={"completion-value"}>
                {columnValue === "" ||
                columnValue === "-" ||
                columnValue === 0 ||
                columnValue === "0"
                  ? ""
                  : moment(columnValue).format(
                      columnCfg.dateFormat || "MMM D, YYYY [at] h:mm A"
                    )}
              </span>
            </span>
          </div>
        );
      } else {
        columnTxt =
          columnValue !== "" &&
          typeof columnValue !== "undefined" &&
          columnValue !== null
            ? value
            : columnCfg.emptyText || this.getEmptyValue();
      }
      let colCls =
        columnValue !== "" &&
        typeof columnValue !== "undefined" &&
        columnValue !== null
          ? ""
          : " greyout ";
      colCls += value === this.cellLoadingIndicatorValue ? " loading-view" : "";
      let canClick = this.isClickable(rowInfo.data, columnCfg);
      let title = columnCfg.toolTip
        ? {
            title:
              (typeof columnCfg.toolTip).indexOf("function") !== -1
                ? columnCfg.toolTip(rowInfo.data)
                : columnCfg.toolTip,
          }
        : {};
      columns.push(
        <div
          className={`row-item ${columnCfg.cls || ""} ${colCls} ${columnCls} ${
            canClick ? "clickable-item" : ""
          }`}
          {...title}
          onClick={
            canClick
              ? columnCfg.onClick.bind(null, rowInfo.data, i)
              : () => void 0
          }
          onMouseOver={this.setPositionFortitle.bind(
            this,
            rowInfo.data,
            columnCfg
          )}
          key={`row-${identifier}-col-${i + 1}`}
        >
          {/* false resolution is due to the node not being an html element */}
          {window.innerWidth <= 767 ? <div>{columnCfg.name}</div> : null}
          {columnTxt.type ? (
            columnTxt
          ) : (
            <span className="text--node--container">{columnTxt}</span>
          )}
          {window.innerWidth >= 768
            ? columnCfg.customRowTitle && (
                <div className={"custom-title"}>
                  {columnCfg.customRowTitle(rowInfo.data)}
                </div>
              )
            : null}
        </div>
      );
    });

    let keyNo = this.props.columns.length + 1,
      relativeCls = "";
    if (this.props.editable && window.innerWidth >= 768) {
      buttonCells.push(
        <div
          className="col-xs-1 row-item text-center editable"
          key={`row-${identifier}-col-${keyNo}`}
        >
          <AppIcon
            iconCls="icon-edit-basic"
            ctrCls="hower-icon"
            onClick={() => this.props.onEdit(rowInfo.data)}
          />
        </div>
      );
      keyNo++;
    }
    if (this.canDelete(rowInfo) && !this.props.allowMultiDelete) {
      let toRender;
      if (this.state.rowIdsBeingRemoved.contains(rowInfo.identifier)) {
        toRender = <div className="loading-spinner" />;
      } else if (rowInfo.deletionStatus) {
        toRender = (
          <div className="position-relative">
            <AppIcon ctrCls="deletion-status-icon" iconCls="icon-alert" />
            <div className="app-tooltip">{rowInfo.deletionStatus}</div>
          </div>
        );
      } else {
        toRender = (
          <AppIcon
            iconCls="icon-trash-basic"
            ctrCls="hower-icon"
            onClick={() => this.props.onDelete(rowInfo.data)}
          />
        );
      }

      buttonCells.push(
        <div
          className="col-xs-1 row-item text-center deletable"
          key={`row-${identifier}-col-${keyNo}`}
        >
          {toRender}
        </div>
      );
      if (this.state.rowIdsMarkedForRemoval.contains(rowInfo.identifier)) {
        relativeCls = " position-relative ";
        columns.push(
          <LocalizedOverlay key={`row-${identifier}-conf-${keyNo}`}>
            <div className="delete-confirmation">
              <div className="confirmation-text">
                {this.props.deleteEntryConfirmation ||
                  "Sure you want to delete this entry?"}
              </div>
              <AppButton
                buttonIconCls="icon-okay"
                buttonLabel="common.yesButton"
                buttonCls="action"
                clickHandler={this.proceedWithDeletion}
                buttonData={rowInfo}
              />
              <AppButton
                buttonIconCls="icon-close-delete"
                buttonLabel="common.noButton"
                buttonCls="secondary-button"
                clickHandler={this.cancelDelete}
                buttonData={rowInfo.identifier}
              />
            </div>
          </LocalizedOverlay>
        );
      }
    }

    let notSelectableReasonText = "";
    if (typeof rowInfo.data.notSelectableReason === "function") {
      notSelectableReasonText = rowInfo.data.notSelectableReason(rowInfo.data);
    }

    if (buttonCells.length !== 0) {
      // columns.unshift(
      //   <div
      //     className="more-button-ctr"
      //     onClick={this.showMoreButtons.bind(null, rowInfo.identifier)}
      //   >
      //     <AppIcon ctrCls="more-button-icon" iconCls="icon-more" />
      //   </div>
      // );
      let hoverButtons = (
        <div className={"hover-buttons-ctr"}>{buttonCells}</div>
      );
      if (window.innerWidth >= 768) {
        columns.push(hoverButtons);
      }
    }

    let toRender,
      ctrCls = `data-row ${
        this.state.currentRowNumber === rowInfo.identifier
          ? " slide-in"
          : "slide-out"
      } ${relativeCls}`;
    if (isSelected) {
      ctrCls += " selected ";
    }
    if (this.props.nonSelectable || toDisableRow) {
      ctrCls += " not-selectable ";
    }
    if (notSelectableReasonText.length > 0) {
      ctrCls += " block-display ";
      toRender = (
        <div
          className={ctrCls}
          data-rowid={rowInfo.identifier}
          onClick={
            toDisableRow
              ? () => void 0
              : (e) => {
                  this.toggleRowSelectionByRow(e, rowInfo);
                }
          }
          key={`row-${identifier}`}
        >
          <div className="columns">{columns}</div>
          <div className="not-selectable-reason">
            <AppIcon iconCls="icon-alert" ctrCls="not-selectable-icon" />
            <div className="not-selectable-reason-text">
              {notSelectableReasonText}
            </div>
          </div>
        </div>
      );
    } else {
      toRender = (
        <div
          className={ctrCls}
          data-rowid={rowInfo.identifier}
          onClick={
            this.props.nonSelectable || toDisableRow
              ? () => void 0
              : (e) => {
                  this.toggleRowSelectionByRow(e, rowInfo);
                }
          }
          key={`row-${identifier}`}
        >
          {columns}
        </div>
      );
    }

    return toRender;
  };
  setPositionFortitle = (data, config, e) => {
    if (config.customRowTitle) {
      let target = e.currentTarget;
      let titleEle = e.currentTarget.querySelector(".custom-title");
      let titleDimension = titleEle.getBoundingClientRect();
      titleEle.style.top = `-${titleDimension.height + 5}px`;
    }
  };
  setPositionForHeadertitle = (config, e) => {
    if (config.customHeaderTitle) {
      let target = e.currentTarget;
      let titleEle = e.currentTarget.querySelector(".custom-title");
      let titleDimension = titleEle.getBoundingClientRect();
      let targetDimension = target.getBoundingClientRect();
      if (titleDimension.height > targetDimension.top) {
        target.classList.add("bottom");
      } else {
        titleEle.style.top = `-${titleDimension.height + 5}px`;
      }
    }
  };

  showMoreButtons = (id) => {
    let currentRowNumber = this.state.currentRowNumber === id ? null : id;
    this.setState({ currentRowNumber: currentRowNumber });
  };
  cancelDelete = (e, rowIdentifier) => {
    e.stopPropagation();

    // Remove rowIdentifier from this.state.rowIdsMarkedForRemoval
    let rowIdsMarkedForRemoval = this.state.rowIdsMarkedForRemoval;
    let position = rowIdsMarkedForRemoval.indexOf(rowIdentifier);
    if (position > -1) {
      rowIdsMarkedForRemoval.splice(position, 1);
      this.setState({
        rowIdsMarkedForRemoval: rowIdsMarkedForRemoval,
      });
    }
  };
  getMaxValueOfColumn = (data, columnConfig) => {
    let values = data.map(function (rowData) {
      return rowData.data;
    });
    let columnValues = values.map(function (rowData) {
      return parseInt(rowData[columnConfig.key]);
    });
    return Math.max(columnValues);
  };
  proceedWithDeletion = (e, rowInfo) => {
    e.stopPropagation();

    // Remove rowInfo.identifier from this.state.rowIdsMarkedForRemoval
    let rowIdsMarkedForRemoval = this.state.rowIdsMarkedForRemoval;
    let position = rowIdsMarkedForRemoval.indexOf(rowInfo.identifier);
    if (position > -1) {
      rowIdsMarkedForRemoval.splice(position, 1);
    }

    // And add rowInfo.identifier from this.state.rowIdsBeingRemoved
    let rowIdsBeingRemoved = this.state.rowIdsBeingRemoved;
    rowIdsBeingRemoved.push(rowInfo.identifier);
    this.setState(
      {
        rowIdsMarkedForRemoval: rowIdsMarkedForRemoval,
        rowIdsBeingRemoved: rowIdsBeingRemoved,
      },
      () => {
        this.props.onDelete(
          rowInfo.data,
          ((failureMessage) => {
            // Remove rowInfo.identifier from this.state.rowIdsBeingRemoved
            let rowIdsBeingRemoved = this.state.rowIdsBeingRemoved;
            let position = rowIdsBeingRemoved.indexOf(rowInfo.identifier);
            if (position > -1) {
              rowIdsBeingRemoved.splice(position, 1);
              rowInfo.deletionStatus = failureMessage;
              this.setState({
                rows: this.state.rows,
                rowIdsBeingRemoved: rowIdsBeingRemoved,
              });
            }
          }).bind(this)
        );
      }
    );
  };
  canDelete = (rowInfo) => {
    if (typeof this.props.deletable === "function") {
      return this.props.deletable(rowInfo.data);
    } else {
      return this.props.deletable;
    }
  };
  isClickable = (rowData, columnConfig) => {
    return (
      typeof columnConfig.isClickable === "function" &&
      columnConfig.isClickable(rowData, columnConfig.key) === true
    );
  };
  getCompletionIndicatorColorCls = (rowData, columnConfig) => {
    let colorCls;
    if (typeof columnConfig.assessCompletionStatus === "function") {
      let completionStatus = columnConfig.assessCompletionStatus(rowData.data);
      switch (completionStatus) {
        case 1:
          colorCls = "completed";
          break;
        case -1:
          colorCls = "in-progress";
          break;
        case 0:
          colorCls = "not-started";
          break;
        default:
          colorCls = "completed";
          break;
      }
    } else {
      throw (
        "assessCompletionStatus config handler not set for column " +
        columnConfig.key
      );
    }
    return colorCls;
  };
  toggleRowSelectionByCheckbox = (checked, rowId) => {
    if (
      !this.props.allowMultiSelect &&
      this.props.onRowSelection !== "undefined"
    ) {
      this.toggleRowSelection(rowId, this.props.onRowSelection);
    } else {
      this.toggleRowSelection(rowId);
    }
  };
  toggleRowSelectionByRow = (e, rowInfo) => {
    e.stopPropagation();
    if (this.props.canToggleRowSelectionByRow) {
      const rowId = e.currentTarget.getAttribute("data-rowid");
      if (!this.state.selectedRowIds.includes(rowId)) {
        this.toggleRowSelection(rowId, this.props.onRowSelection);
      } else {
        this.toggleRowSelection(rowId);
      }
    } else {
      this.props.onRowClicked(e, rowInfo);
    }
  };

  toggleRowSelection = (rowId, onRowSelection) => {
    if (onRowSelection === undefined) {
      onRowSelection = () => void 0;
    }
    let isChecked = false;
    if (this.props.allowMultiSelect) {
      let i = this.state.selectedRowIds.indexOf(rowId);
      if (i === -1) {
        this.state.selectedRowIds.push(rowId);
        isChecked = true;
      } else {
        this.state.selectedRowIds.splice(i, 1);
        isChecked = false;
      }
    } else {
      // Incase of single select, ensure the this.state.selectedRowIds list has only rowId and toggle accly
      if (this.state.selectedRowIds.length > 0) {
        let currentSelection = this.state.selectedRowIds[0];
        if (currentSelection === rowId) {
          this.state.selectedRowIds.splice(0, this.state.selectedRowIds.length);
          isChecked = false;
        } else {
          this.state.selectedRowIds.splice(
            0,
            this.state.selectedRowIds.length,
            rowId
          );
          isChecked = true;
        }
      } else {
        this.state.selectedRowIds.push(rowId);
        isChecked = true;
      }
    }

    let allRowsSelected =
      this.state.rows.filter((r) => {
        return this.state.selectedRowIds.indexOf(r.identifier) > -1;
      }).length === this.state.rows.length;

    this.setState(
      {
        selectedRowIds: this.state.selectedRowIds,
        allRowsSelected: allRowsSelected,
      },
      () => {
        let rowData = this.state.rows.find((row, index) => {
          return row.identifier === rowId;
        });
        onRowSelection(rowData?.data, isChecked);
        if (this.props.onRowChecked !== undefined) {
          let selectedRows = this.state.rows.filter((rowInfo) => {
            return this.state.selectedRowIds.contains(rowInfo.identifier);
          });
          this.props.onRowChecked(
            selectedRows,
            rowData,
            isChecked,
            this.state.selectedRowIds
          );
        }
      }
    );
  };

  getButtons = () => {
    return (
      <AppButton
        buttonLabel="common.cancelButton"
        buttonCls="secondary-button cancel-btn"
        buttonIconCls="icon-close-delete"
        key={1}
        clickHandler={this.props.onCancel}
      />
    );
  };
  getHeaderRow = () => {
    let columns = [];

    if (!this.props.nonSelectable) {
      columns.push(
        <div className="col-xs-1 row-item checkbox-item" key="header-col-0">
          <Checkbox
            value={this.allRowsSelected()}
            disabled={!this.props.allowMultiSelect}
            onChange={this.toggleAllRowsSelection}
            label=""
          />
        </div>
      );
    }
    this.props.columns.forEach((columnCfg, i) => {
      let sortorder =
        this.state.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;
      let ctrCls =
        this.state.sortColumn === columnCfg.key
          ? `sort-${this.state.sortOrder}`
          : "sort-asc-disabled";
      let columnCls;
      switch (columnCfg.type) {
        case ColumnTypes.STRING:
          columnCls = "string-column";
          break;
        case ColumnTypes.NUMBER:
          columnCls = "number-column";
          break;
        case ColumnTypes.VISUAL_NUMBER:
          columnCls = "visual-number-column";
          break;
        case ColumnTypes.COMPLETION_INDICATOR:
          columnCls = "completion-status";
          break;
        default:
          columnCls = "string-column";
          break;
      }
      let name = columnCfg.name,
        nameTitle = columnCfg.name;
      if (typeof columnCfg.name === "function") {
        name = columnCfg.name();
        nameTitle = "";
      }
      let SortableColumnCls = columnCfg.sortable ? "sort-enabled" : "";
      columns.push(
        <div
          className={`row-item bottom text-upper ${columnCls} ${
            columnCfg.cls || ""
          }`}
          key={`header-col-${i + 1}`}
        >
          <div
            className={`header-text ${SortableColumnCls}`}
            onClick={
              columnCfg.name === ""
                ? () => void 0
                : this.changeSortOrder.bind(this, columnCfg, sortorder)
            }
          >
            <div className="sortable-header-text" title={nameTitle}>
              {name}
            </div>
            {!columnCfg.sortable ? null : (
              <div className="sortable-icon">
                {this.state.sortColumn === columnCfg.key ? (
                  <AppIcon iconCls="icon-sort" ctrCls={ctrCls} />
                ) : (
                  <AppIcon iconCls="icon-sort-both" ctrCls={ctrCls} />
                )}
              </div>
            )}
          </div>
          {columnCfg.customHeaderTitle && (
            <div className={"custom-title"}>
              {columnCfg.customHeaderTitle(columnCfg)}
            </div>
          )}
        </div>
      );
    }, this);

    let keyNo = this.props.columns.length + 1;
    let moreBtnCount = 0;
    if (this.props.editable) {
      columns.push(
        <div
          className="col-xs-1 row-item text-upper action-col-header"
          key={`header-col-${keyNo}`}
        >
          {this.props.editableActionsText}
        </div>
      );
      keyNo++;
      moreBtnCount++;
    }
    // if (this.isConditionalDeleteEnabled() && !this.props.allowMultiDelete) {
    //   columns.push(
    //     <div className="col-xs-1 row-item" key={`header-col-${keyNo}`} />
    //   );
    //   moreBtnCount++;
    // }

    // if (moreBtnCount > 0) {
    //   columns.unshift(
    //     <div className="more-button-hdr-ctr">
    //       <AppIcon ctrCls="more-button-icon" iconCls="icon-more" />
    //     </div>
    //   );
    // }
    return (
      <div className="header-row" key="headerRow">
        {columns}
      </div>
    );
  };
  toggleAllRowsSelection = () => {
    let allRowIdsToToggle = [];
    let affectedRows = this.state.rows;
    if (!this.allRowsSelected()) {
      allRowIdsToToggle = this.state.selectedRowIds.concat(
        this.getFilteredRows()
          .filter((rowInfo) => {
            return (
              !(typeof rowInfo.data.isSelectable === "function") ||
              rowInfo.data.isSelectable(rowInfo.data) === true
            );
          })
          .map((rowInfo) => {
            return rowInfo.identifier;
          })
          .filter((rowId) => {
            return this.state.selectedRowIds.indexOf(rowId) === -1;
          })
      );
    } else {
      if (
        this.props.serverSidePaging &&
        this.props.pagingType === PagingType.NUMBERED
      ) {
        //for server side paging
        //we should only deselect the ones shown to user
        let rowIdsInPage = this.state.rows.map((r) => {
          return r.identifier;
        });
        allRowIdsToToggle = this.state.selectedRowIds.filter((rId) => {
          return rowIdsInPage.indexOf(rId) === -1;
        });
      }
    }

    this.setState(
      {
        allRowsSelected: !this.allRowsSelected(),
        selectedRowIds: allRowIdsToToggle,
      },
      () => {
        let selectedRows = [];
        if (allRowIdsToToggle.length > 0) {
          selectedRows = this.state.rows.filter((rowInfo) => {
            return allRowIdsToToggle.contains(rowInfo.identifier);
          });
        }
        if (this.props.onRowChecked !== undefined) {
          this.props.onRowChecked(
            selectedRows,
            affectedRows,
            this.state.allRowsSelected,
            this.state.selectedRowIds
          );
        }
      }
    );
  };
  allRowsSelected = () => {
    let rowIdsInPage = this.state.rows.map((r) => {
      return r.identifier;
    });
    let selectedRowsIdsInPage = rowIdsInPage.filter((id) => {
      return this.state.selectedRowIds.indexOf(id) > -1;
    });
    return (
      rowIdsInPage.length > 0 &&
      selectedRowsIdsInPage.length === rowIdsInPage.length
    );
  };
  getSearchAndFilterRow = () => {
    let columns = [];
    if (!this.props.nonSelectable) {
      columns.push(
        <div
          className="col-xs-1 row-item checkbox-item"
          key="search-and-filter-col-0"
        >
          <AppIcon
            cltrCls="search-and-filter-icon"
            iconCls="icon-filter-search"
          />
        </div>
      );
    }
    // this.props.columns.forEach((columnCfg, i) => {
    //   let toRender,
    //     keyValue = `search-and-filter-col-${i + 1}`;

    //   let columnCls = columnCfg.type === 1 ? "number-column" : "string-column";

    //   toRender = (
    //     <div
    //       className={`${columnCfg.cls} row-item ${columnCls}`}
    //       key={keyValue}
    //     />
    //   );
    //   columns.push(toRender);
    // }, this);

    console.log(this.props.columnFilterValue);

    this.props.columns.forEach((columnCfg, i) => {
      var toRender,
        keyValue = `search-and-filter-col-${i + 1}`;

      var columnCls = columnCfg.type === 1 ? "number-column" : "string-column";

      if (columnCfg.searchable) {
        var searchInputState = `searchInput_${columnCfg.key}`;
        toRender = (
          <div
            className={columnCfg.cls + ` row-item ${columnCls}`}
            key={keyValue}
          >
            <input
              className="serachable-text"
              type="text"
              value={this.state[searchInputState] || ""}
              onChange={(e) => this.requestChange(e, searchInputState)}
              onBlur={this.signalSearchInputInteractionCompletion}
              title={columnCfg.name}
              placeholder={columnCfg.name}
            />
          </div>
        );
      } else if (columnCfg.filterable) {
        var dropdownItems = columnCfg?.options
          ? columnCfg.options.map((option, index) => {
              if (option.key !== void 0) {
                return {
                  value: option.key,
                  label: option.label,
                };
              } else {
                return {
                  value: index + 1,
                  label: option,
                };
              }
            })
          : [
              {
                value: 0,
                label: "All",
              },
            ]
              .concat(this.state[`filterValues_${columnCfg.key}`])
              .map((option, index) => {
                if (option.key) {
                  return {
                    value: option.key,
                    label: option.label,
                  };
                } else {
                  return {
                    value: index + 1,
                    label: option,
                  };
                }
              });

        toRender = (
          <div
            className={columnCfg.cls + ` row-item ${columnCls}`}
            key={keyValue}
          >
            <DropDown
              items={dropdownItems}
              onSelect={(e) => this.selectFilterValue(e, columnCfg)}
              data={columnCfg}
              value={
                this.props?.columnFilterValue
                  ? this.props?.columnFilterValue[columnCfg.key]
                  : null
              }
            />
          </div>
        );
      } else {
        toRender = (
          <div
            className={columnCfg.cls + ` row-item ${columnCls}`}
            key={keyValue}
          ></div>
        );
      }
      columns.push(toRender);
    });

    let keyNo = this.props.columns.length + 1;
    if (this.props.editable) {
      columns.push(
        <div
          className="col-xs-1 row-item"
          key={`search-and-filter-col-${keyNo}`}
        />
      );
      keyNo++;
    }
    if (this.isConditionalDeleteEnabled() && !this.props.allowMultiDelete) {
      columns.push(
        <div
          className="col-xs-1 row-item"
          key={`search-and-filter-col-${keyNo}`}
        />
      );
    }

    return (
      <div className="search-and-filter-row" key="searchAndFilterRow">
        {columns}
      </div>
    );
  };
  getEmptyValue = () => {
    return this.props.emptyValue || " (empty)";
  };
  selectFilterValue = (filteredValue, column) => {
    let stateObject = {};
    filteredValue.label =
      filteredValue.label === this.getEmptyValue() ? "" : filteredValue.label;
    stateObject[`filterValue_${column.key}`] = filteredValue;
    this.setState(stateObject, () => {
      this.props.onFilterChange(filteredValue, column);
    });
  };
  signalSearchInputInteractionCompletion = () => {
    this.checkAndTriggerRecordSetRenderedHandle();
  };

  requestChange = (e, stateletiable) => {
    let newValue = e.currentTarget.value;
    let newState = {};
    newState[stateletiable] = newValue;
    this.setState(newState);
  };
  isConditionalDeleteEnabled = () => {
    return (
      typeof this.props.deletable === "function" ||
      this.props.deletable === true
    );
  };
  changeSortOrder = (column, sortOrder) => {
    if (typeof column.sortable !== "undefined" && !column.sortable) {
      return;
    }
    this.setState({
      sortOrder: sortOrder,
      sortColumn: column.key,
      selectedRowIds: [],
    });
    if (
      this.props.totalCount > this.state.rows.length ||
      this.props.enforceServiceSideSorting
    ) {
      this.props.onSortChange(column, sortOrder);
    }
  };
  getPartialLoadingMask = () => {
    return (
      <div className="rendering-rows-ctr">
        <div className="animated-spinner-2" />
        <div>{this.props.processingRequestLabel || "Processing Request"}</div>
      </div>
    );
  };
  prepareAndRenderRows = (propsData) => {
    console.log(propsData);
    if (propsData.rowsData) {
      this.parseAndAssignRows(propsData.rowsData);
    } else if (this.props.ajaxOperation) {
      propsData.ajaxOperation.callback = (data) => {
        let results = JSON.parse(data);
        this.parseAndAssignRows(results);
      };
      propsData.ajaxOperation.submitRequest();
    }
    if (
      propsData.currentPaginationIndex !== this.state.currentPaginationIndex
    ) {
      this.setState({
        currentPaginationIndex: propsData.currentPaginationIndex,
      });
    }
  };
  parseAndAssignRows = (results = []) => {
    let rows = [];
    results?.forEach((result) => {
      rows.push({
        identifier: result[this.props.identifierColumn],
        data: result,
      });
    });
    this.setState(
      this.populateFilterValues({
        loadingState:
          rows.length === 0
            ? LoadingStates.FETCHED_BUT_EMPTY
            : LoadingStates.FETCHED_AND_AVAILABLE,
        rows: rows,
      }),
      () => {
        this.checkAndTriggerRecordSetRenderedHandle();
      }
    );
  };
  // Method to return a unique list of items from an array, by using an object as hash
  getUniqueList = (values) => {
    let arrayItems = {},
      unique = [],
      value;
    for (let i = 0; i < values.length; i++) {
      value = values[i] ? values[i] : this.getEmptyValue();
      if (!arrayItems[value]) {
        arrayItems[value] = true;
        unique.push(value);
      }
    }
    return unique;
  };
  populateFilterValues = (object) => {
    if (!object || !object.rows || object.rows.length === 0) {
      return object;
    }
    // Iterate through all filterable columns and set their filterable values
    this.props.columns.forEach((columnConfig, index) => {
      if (columnConfig.filterable) {
        if (columnConfig.filterValues) {
          object[`filterValues_${columnConfig.key}`] =
            columnConfig.filterValues;
        } else {
          let allColumnValues = object.rows.map((row) => {
            return this.getColumnValue(
              row.data,
              columnConfig,
              object.rows,
              index
            );
          }, this);
          object[`filterValues_${columnConfig.key}`] =
            this.getUniqueList(allColumnValues);
        }
      }
    });
    return object;
  };
  checkAndTriggerRecordSetRenderedHandle = () => {
    if (this.props.onRecordSetRendered) {
      let renderedRows = [],
        filteredRows = this.getSortedRows(this.getFilteredRows());
      for (let i = 0; i < filteredRows.length; i++) {
        let rowInfo = filteredRows[i];
        if (this.props.isPagingNeeded) {
          if (i < this.state.loadedRecordsCount) {
            renderedRows.push(rowInfo);
          } else {
            break;
          }
        } else {
          renderedRows.push(rowInfo);
        }
      }
      this.props.onRecordSetRendered(renderedRows, this.state.rows);
    }
  };
  getFilteredRows = () => {
    let filteredRows = this.state.rows.filter((rowInfo) => {
      let toInclude = true,
        columnConfig;
      for (let i = 0; i < this.props.columns.length; i++) {
        columnConfig = this.props.columns[i];
        let columnValue = this.getColumnValue(
          rowInfo.data,
          columnConfig,
          this.state.rows,
          i
        ); // rowInfo.data[columnConfig.key];
        if (columnConfig.searchable) {
          // If this column is searchable, check if the search string matches the column value
          let searchString = this.state[`searchInput_${columnConfig.key}`];
          if (searchString && searchString.length > 0) {
            toInclude =
              columnValue.toLowerCase().indexOf(searchString.toLowerCase()) !==
              -1;
          } else {
            toInclude = true;
          }
        } else if (columnConfig.filterable) {
          // If this column is filterable, check if the filtered value matches the column value
          let filterValue = this.state[`filterValue_${columnConfig.key}`].label;
          if (
            typeof filterValue !== "undefined" &&
            filterValue.toLowerCase() !== "all"
          ) {
            toInclude = filterValue === columnValue;
          } else {
            toInclude = true;
          }
        }
        if (!toInclude) {
          break;
        }
      }
      return toInclude;
    }, this);

    return filteredRows;
  };
  getSortedRows = (rowsData) => {
    let sortColumnConfig = {};
    if (
      this.props.serverSideSorting &&
      (this.props.totalCount > this.state.rows.length ||
        this.props.enforceServiceSideSorting)
    ) {
      return rowsData;
    }
    if (this.state.sortColumn !== "") {
      let sortColumn = this.state.sortColumn;
      let sortOrder = this.state.sortOrder;
      let sortColumnType = "string";
      for (let i = 0; i < this.props.columns.length; i++) {
        if (this.props.columns[i].key === sortColumn) {
          if (
            this.props.columns[i].type === ColumnTypes.COMPLETION_INDICATOR ||
            this.props.columns[i].type === ColumnTypes.DATE ||
            this.props.columns[i].type === ColumnTypes.DATE_TIME
          ) {
            sortColumnConfig = this.props.columns[i];
          }
          sortColumnType = this.props.columns[i].type;
          break;
        }
      }
      rowsData.sort((row1Data, row2Data) => {
        let firstValue = "";
        let nextValue = "";

        if (row1Data.data._isNotSortable && row2Data.data._isNotSortable) {
          return 0;
        }
        if (row1Data.data._isNotSortable) {
          return 1;
        }
        if (row2Data.data._isNotSortable) {
          return -1;
        }

        if (sortOrder === SortOrder.ASC) {
          firstValue = this.getValueForSortColumn(
            row1Data,
            sortColumnType,
            sortColumnConfig
          );
          nextValue = this.getValueForSortColumn(
            row2Data,
            sortColumnType,
            sortColumnConfig
          );
        } else {
          firstValue = this.getValueForSortColumn(
            row2Data,
            sortColumnType,
            sortColumnConfig
          );
          nextValue = this.getValueForSortColumn(
            row1Data,
            sortColumnType,
            sortColumnConfig
          );
        }
        if (firstValue < nextValue) {
          return -1;
        }
        if (firstValue > nextValue) {
          return 1;
        }

        // names must be equal
        return 0;
      });
    }

    return rowsData;
  };
  getColumnValue = (rowData, columnConfig, filteredRows, index) => {
    let columnValue =
      typeof columnConfig.renderer === "function"
        ? columnConfig.renderer(rowData, columnConfig.key, filteredRows, index)
        : rowData[columnConfig.key];
    if (
      columnConfig.type === ColumnTypes.VISUAL_NUMBER ||
      columnConfig.type === ColumnTypes.COMPLETION_INDICATOR
    ) {
      columnValue = rowData[columnConfig.key];
    }
    if (columnConfig.type === ColumnTypes.DATE) {
      columnValue = columnValue
        ? moment(columnValue).format(
            columnConfig.dateFormat || "MMM D, YYYY [at] h:mm A"
          )
        : "-";
    }
    return columnValue !== null ? columnValue : "";
  };
  getValueForSortColumn = (rowData, sortColumnType, sortColumnConfig) => {
    let value = rowData.data[this.state.sortColumn];
    let dateValue;
    switch (sortColumnType) {
      case ColumnTypes.STRING:
        return value ? value.toUpperCase() : "";
      case ColumnTypes.DATE:
        let getDate =
          value === 0 || value === null ? 0 : value.replace(/nd|th|st|rd/g, ""); // this approach is to be changed later
        dateValue = new Date(Date.parse(getDate));
        return value == undefined
          ? ""
          : moment(dateValue).format(
              sortColumnConfig.dateFormat || "MMM D, YYYY [at] h:mm A"
            );
      case ColumnTypes.COMPLETION_INDICATOR:
        switch (
          this.getCompletionIndicatorColorCls(rowData, sortColumnConfig)
        ) {
          case "not-started":
            dateValue = 0;
            break;
          case "in-progress":
            dateValue = 1;
            break;
          default:
            dateValue =
              value === undefined ||
              value === null ||
              value === 0 ||
              value === "" ||
              value === "-"
                ? 0
                : new Date(Date.parse(value));
            break;
        }
        return dateValue;
      case ColumnTypes.NUMBER:
      case ColumnTypes.VISUAL_NUMBER:
        return value === undefined || value === "-"
          ? 0
          : Number(rowData.data[this.state.sortColumn]);
    }
  };

  onPageIndexChange = (index) => {
    this.setState({
      currentPaginationIndex: index,
    });
    this.props.onPageIndexChange(index);
  };

  isProcessing = () => {
    return (
      this.state.loadingState === LoadingStates.FETCHING ||
      this.state.isProcessing === true
    );
  };
  augmentWithSearchAndFilterInputs = (object) => {
    this.props.columns.forEach((columnConfig) => {
      if (columnConfig.searchable) {
        object[`searchInput_${columnConfig.key}`] = "";
      } else if (columnConfig.filterable) {
        object[`filterValues_${columnConfig.key}`] = [];
        object[`filterValue_${columnConfig.key}`] = "";
      }
    });
    return object;
  };
  refreshFilterValues = (rows) => {
    let filterValuesObject = this.populateFilterValues({
      rows: rows,
    });
    delete filterValuesObject.rows;
    this.setState(filterValuesObject);
  };
  showLoadingSpinner = () => {
    this.setState({ loadingState: LoadingStates.FETCHING });
  };

  removeLoadingSpinner = () => {
    this.setState({ loadingState: LoadingStates.FETCHED_AND_AVAILABLE });
  };
}

SearchWidget.defaultProps = {
  title: "",
  onRecordSetRendered: () => void 0,
  excludeList: [],
  defaultSelectedList: [],
  columns: [],
  ctrCls: "",
  onCancel: () => void 0,
  onProcessSelection: () => void 0,
  nonSelectable: false,
  editable: false,
  onEdit: () => void 0,
  deletable: false,
  onDelete: () => void 0,
  searchable: true,
  hideBottomButtons: false,
  allowMultiSelect: true,
  needHorizontalScroll: false,
  useDefaultScroll: false,
  includeUseButttonInMyChildren: false,
  onRowSelection: () => void 0,
  allowMultiDelete: false,
  proceedButtonIconCls: "icon-learner",
  pageSize: 50, // Changed 100 to 50 for performance considerations
  totalCount: 0,
  isPagingNeeded: false,
  serverSidePaging: false,
  hasNextPage: false,
  loadMore: () => void 0,
  pagingType: PagingType.LOAD_MORE,
  onPageIndexChange: () => void 0,
  currentPaginationIndex: 1,
  isProcessing: false,
  onSortChange: () => void 0,
  onFilterChange: () => void 0,
  onFetchAllRecordsForSelection: (arg) => arg(),
  onClearAllSelection: () => void 0,

  selectLabel: "",
  recordsWithRowLabel: "",
  deleteLabel: "",
  loadMoreButtonLabel: "",
  showingRecordWithPageSizeLabel: "",
  clearSelectionLabel: "",
  canToggleRowSelectionByRow: true,
  onRowClicked: () => void 0,
  editableActionsText: "Actions"
};

SearchWidget.propTypes = {
  canShowSelectAllRecordsButton: PropTypes.bool,
  rowsData: PropTypes.array.isRequired,
  sortColumn: PropTypes.string,
  sortOrder: PropTypes.oneOf([SortOrder.ASC, SortOrder.DESC]),
  fetchingMessage: PropTypes.string,
  ctrCls: PropTypes.string,
  canToggleRowSelectionByRow: PropTypes.bool,
  onRowClicked: PropTypes.func,
  editableActionsText: PropTypes.string,
  itemsPerPageText: PropTypes.string,
  pageSizeText: PropTypes.string,
};

export default SearchWidget;
