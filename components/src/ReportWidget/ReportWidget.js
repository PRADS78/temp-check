import { createRef, Component } from "react";
import PropTypes from "prop-types";

import SortOrder from "../SortOrder";
import * as Utils from "../Utils";
import Logger from "../Logger";
import * as FileHelper from "../FileHelper";
import LoadingStates from "../LoadingStates";
import EmptyDataView from "../EmptyDataView/EmptyDataView";
import SearchWidget from "../SearchWidget/SearchWidget";
import PagingType from "../PagingType";
import * as Service from "../Service/Service";
import UserSearchFilter from "../UserSearchFilter/UserSearchFilter";
import "./ReportWidget.scss";
import AppButton from "../AppButton/AppButton";
import { ExportProcessResponse } from "../Models/ExportProcessResponse";
import ConversionStatus from "../ConversionStatus";
import ProgressToast from "../ProgressToast/ProgressToast";
import moment from "moment";
import DialogControl from "../DialogControl/DialogControl";
import DateTimePicker from "../DatePicker/DateTimePicker";
import withLocalizerContext from "../HOC/withLocalizerContext";

class ReportWidget extends Component {
  constructor(props) {
    super(props);
    const yesterday = moment().subtract(1, "days");
    const toDate = yesterday.format("YYYY-MM-DD");
    const toTime = "23:59:59";
    const fromTime = "00:00:00";

    this.getFromDay = (number, metric) => {
      const fromDay = moment(
        moment().subtract(number, metric).format("YYYY-MM-DD") + " " + fromTime
      );
      return fromDay;
    };

    this.getLastQuarter = () => {
      const lastQuarter = Math.floor(yesterday.month() / 3);
      let to, from;
      if (lastQuarter === 0) {
        from = moment(`10/01/${yesterday.year() - 1}`);
        to = moment(`12/31/${yesterday.year() - 1}`);
      } else if (lastQuarter === 1) {
        from = moment(`01/01/${yesterday.year()}`);
        to = moment(`03/31/${yesterday.year()}`);
      } else if (lastQuarter === 2) {
        from = moment(`04/01/${yesterday.year()}`);
        to = moment(`06/30/${yesterday.year()}`);
      } else if (lastQuarter === 3) {
        from = moment(`07/01/${yesterday.year()}`);
        to = moment(`09/30/${yesterday.year()}`);
      }
      return { from, to };
    };

    this.getCurrentQuarter = () => {
      const currentQuarter = Math.ceil(yesterday.month() / 3);
      let from;
      if (currentQuarter === 1) {
        from = moment(`01/01/${yesterday.year()}`);
      } else if (currentQuarter === 2) {
        from = moment(`04/01/${yesterday.year()}`);
      } else if (currentQuarter === 3) {
        from = moment(`07/01/${yesterday.year()}`);
      } else if (currentQuarter === 4) {
        from = moment(`10/01/${yesterday.year()}`);
      }
      return from;
    };

    this.timeOptions = [
      {
        value: 1,
        label: this.props.t("datePicker.last24Hrs"),
        availableUntil: moment(toDate + " " + toTime),
        availableFrom: this.getFromDay(24, "hours"),
      },
      {
        value: 2,
        label: this.props.t("datePicker.last7"),
        availableUntil: moment(toDate + " " + toTime),
        availableFrom: this.getFromDay(7, "days"),
      },
      {
        value: 3,
        label: this.props.t("datePicker.last14"),
        availableUntil: moment(toDate + " " + toTime),
        availableFrom: this.getFromDay(14, "days"),
      },
      {
        value: 4,
        label: this.props.t("datePicker.last30"),
        availableUntil: moment(toDate + " " + toTime),
        availableFrom: this.getFromDay(30, "days"),
      },
      {
        value: 5,
        label: this.props.t("datePicker.currentMonth"),
        availableUntil: moment(toDate + " " + toTime),
        availableFrom: moment(
          `${yesterday.month() + 1}/01/${yesterday.year()}` + " " + fromTime
        ),
      },
      {
        value: 6,
        label: this.props.t("datePicker.lastMonth"),
        availableUntil: moment(
          `${yesterday.month() === 0 ? 12 : yesterday.month()}/31/${
            yesterday.month() === 0 ? yesterday.year() - 1 : yesterday.year()
          }` +
            " " +
            toTime
        ),
        availableFrom: moment(
          `${yesterday.month() === 0 ? 12 : yesterday.month()}/01/${
            yesterday.month() === 0 ? yesterday.year() - 1 : yesterday.year()
          }` +
            " " +
            fromTime
        ),
      },
      {
        value: 7,
        label: this.props.t("datePicker.currentQuarter"),
        availableUntil: moment(toDate + " " + toTime),
        availableFrom: this.getCurrentQuarter(),
      },
      {
        value: 8,
        label: this.props.t("datePicker.lastQuarter"),
        availableUntil: this.getLastQuarter().to,
        availableFrom: this.getLastQuarter().from,
      },
      {
        value: 9,
        label: this.props.t("datePicker.customPeriod"),
      },
    ];
    this.defaultTimePeriodValue = this.getDefaultValue(
      this.timeOptions,
      props.defaultTimePeriodValue
    );
    this.state = {
      currentPaginationIndex: props.currentPaginationIndex,
      userDefinedFields: props.userDefinedFields,
      userSelectedValues: [],
      totalUserCount: 0,
      showAlert: false,
      sortColumn: "",
      operationMessage: "",
      isDownloading: false,
      columnFilter: {},
      isDataLoading: true,
      loadingState: LoadingStates.FETCHING,
      sortOrder: SortOrder.ASC,
      pageSize: props.queryParams ? props.queryParams.fetchCount : 0,
      updateKey: new Date().valueOf(),
      reportData: [],
      fromDate: this.defaultTimePeriodValue
        ? this.defaultTimePeriodValue.availableFrom
        : moment().subtract(7, "days"),
      toDate: this.defaultTimePeriodValue
        ? this.defaultTimePeriodValue.availableUntil
        : moment(),
      columnFilterValue: null,
      selectedDateRange: this.defaultTimePeriodValue,
    };
    this.progressToastRef = createRef();
  }

  componentDidMount() {
    if (this.props.supportLog) {
      Logger.initializeLogger();
    }
    this.getReport();
  }

  render() {
    let reportWidgetRenderer = "";
    let timeFilterCls = this.props.showTimeDurationFilter
      ? "has-time-duration-filter"
      : "";
    let message = this.props.fetchingMessage || this.props.t("reportWidget.processing");
    switch (this.state.loadingState) {
      case LoadingStates.FETCHING:
        reportWidgetRenderer = (
          <EmptyDataView
            displayMsg={message}
            showLoader={true}
            iconCls="icon-modules"
          />
        );
        break;
      // reportWidgetRenderer = (
      //     <EmptyDataView
      //         displayMsg={this.props.emptyDataMsg || "No data to show."}
      //         iconCls="icon-feedback"
      //         ctrCls={
      //             "student-analytics-ctr white-bg text-center " + this.props.ctrCls
      //         }
      //     />
      // );
      // break;
      case LoadingStates.FETCHED_BUT_EMPTY:
      case LoadingStates.FETCHED_AND_AVAILABLE:
        reportWidgetRenderer = (
          <SearchWidget
            nonSelectable={this.props.nonSelectable}
            rowsData={this.state.reportData}
            emptyMessage={this.props.emptyDataMsg}
            currentPaginationIndex={this.state.currentPaginationIndex}
            totalCount={this.state.totalUserCount}
            columns={this.props.analyticsColumns}
            ctrCls={"col-xs-12 no-padding "}
            onFetchAllRecordsForSelection={
              this.props.onFetchAllRecordsForSelection
            }
            {...this.props}
            onRowChecked={this.props.onRowChecked}
            pageLoadingState={this.state.loadingState}
            isPagingNeeded={this.props.isPagingNeeded}
            onFilterChange={this.handleFilterChange}
            searchable={this.props.searchable}
            onPageIndexChange={this.handlePageIndexChange}
            onFetchCountChange={this.handleFetchCountChange}
            pagingType={this.props.pagingType}
            isProcessing={this.state.isDataLoading}
            onSortChange={this.handleSortChange}
            serverSideSorting={true}
            serverSidePaging={true}
            pageSize={this.state.pageSize}
            sortColumn={this.state.sortColumn}
            enforceServiceSideSorting={this.props.enforceServiceSideSorting}
            sortOrder={this.state.sortOrder}
            columnFilterValue={this.state.columnFilterValue}
            onEdit={this.props.onEdit}
            onDelete={this.props.onDelete}
            editableActionsText={this.props.editableActionsText}
            itemsPerPageText={this.props.itemsPerPageText}
            pageSizeText={this.props.pageSizeText}
          />
        );
        break;
    }
    return (
      <div
        className={`report-analytics-view v2 ${this.props.ctrCls} ${timeFilterCls}`}
      >
        <div className={"report-wrapper"}>
          <div className={"report-filter-wrapper"}>
            {this.props.showTimeDurationFilter && this.getTimeDurationFilter()}
            {this.props.showSearchFilter && this.getReportFilter()}
            {this.props.allowExport && (
              <AppButton
                buttonLabel={this.props.exportData.exportButtonText || this.props.t("common.export")}
                tooltipText={this.props.exportData.exportButtonTooltip}
                buttonCls="session-analytics-export-btn "
                disabled={
                  this.state.isDownloading ||
                  this.state.loadingState === LoadingStates.FETCHED_BUT_EMPTY ||
                  this.props.disableExportButton
                }
                clickHandler={this.exportExcel.bind(null, false)}
                // buttonIconCls="icon-download"
                type="primary"
              />
            )}
            {this.props.additionalButton}
            {this.state.isDownloading && (
              <ProgressToast
                ref={(currrentRef) => {
                  this.progressToastRef = currrentRef;
                }}
              >
                <div className={"progress-loading-wrapper"}>
                  <div className={"progress-text"}>
                    {this.state.operationMessage}
                  </div>
                  <div className={"progress"}>
                    <div
                      className={
                        "progress-bar progress-bar-success progress-bar-striped active"
                      }
                    />
                  </div>
                </div>
              </ProgressToast>
            )}
            {this.renderAlert()}
          </div>
          {reportWidgetRenderer}
        </div>
      </div>
    );
  }

  setLoadingState = (loadingState) => {
    this.setState({
      loadingState: loadingState,
    });
  };
  handleFilterChange = (selectedValue, columConfig) => {
    let columnFilter = this.state.columnFilter;
    columnFilter[columConfig.key] = selectedValue.value;
    console.log(
      "ReportWidget -> handleFilterChange -> selectedValue",
      [columConfig.key],
      selectedValue,
      {
        ...this.state.columnFilterValue,
        [columConfig.key]: selectedValue,
      }
    );
    const filterState = {
      ...this.state.columnFilterValue,
      [columConfig.key]: selectedValue,
    };
    this.setState({
      columnFilterValue: filterState,
    });
    this.setState(
      {
        columnFilter,
        isDataLoading: true,
      },
      () => {
        this.getReport();
      }
    );
  };
  handleAdditionalFilterChange = (
    columConfig,
    selectedValue,
    isCleared = false
  ) => {
    let columnFilter = this.state.columnFilter;
    if (!columConfig?.multiSelect && columConfig?.type === "daterange") {
      columnFilter[columConfig.key] = selectedValue.value;
    } else if (columConfig?.key) {
      if (Array.isArray(selectedValue)) {
        columnFilter[columConfig.key] = `[${selectedValue.map(
          ({ value }) => value
        )}]`;
      } else {
        columnFilter[columConfig.key] =
          selectedValue.key || selectedValue.value;
      }
    } else {
      columnFilter = columConfig;
    }
    this.setState(
      {
        columnFilter,
        isDataLoading: !columConfig.isInsideFilter && !isCleared ? true : false,
      },
      () => {
        if (!columConfig.isInsideFilter && !isCleared) {
          this.getReport();
        }
      }
    );
  };
  getTimeDurationFilter = () => {
    return (
      <DateTimePicker
        onChange={(dates, selectedTimePeriod) =>
          this.setDateRange(dates, selectedTimePeriod)
        }
        label={this.props.t("datePicker.selectDuration")}
        selectDuration={true}
        startDate={Date.parse(this.state.fromDate)}
        endDate={Date.parse(this.state.toDate)}
        selectRange={this.state.selectedDateRange}
      />
    );
  };
  getDefaultValue = (timeOptions, value) => {
    if (value) {
      value = value.toLowerCase();
      return timeOptions.find((timeOption) => {
        return timeOption.label.toLowerCase() === value;
      });
    }
  };
  setDateRange = (dates, selectedTimePeriod) => {
    const [start, end] = dates;
    if (end)
      this.setState(
        {
          fromDate: new Date(start),
          isDataLoading: true,
          toDate: new Date(end),
          selectedDateRange: selectedTimePeriod,
        },
        () => {
          this.getReport();
        }
      );
  };
  getSelectedTimePeriod = () => {
    return this.state.selectedDateRange;
  };
  getReportFilter = () => {
    let additionalFilters = this.props.additionalUserFilters;
    // let filterColumns = this.props.analyticsColumns.filter((column) => {
    //   return column.filterable;
    // });
    // filterColumns.forEach((column) => {
    //   let options = [];
    //   if (column.filterType === "list") {
    //     options.push({
    //       value: 0,
    //       label: "All",
    //     });
    //     column.options?.forEach((option, index) => {
    //       if (option.key) {
    //         options.push({
    //           value: option.key,
    //           label: option.label,
    //         });
    //       } else {
    //         options.push({
    //           value: index + 1,
    //           label: option,
    //         });
    //       }
    //     });
    //   }
    //   let isFilterExist = additionalFilters.find((filter) => {
    //     return filter.key === column.key;
    //   });
    //   if (!isFilterExist) {
    //     additionalFilters.push({
    //       type: column.filterType,
    //       key: column.key,
    //       label: column.name,
    //       multiSelect: column.allowMultiSelect || false,
    //       options: options,
    //     });
    //   }
    // });

    return (
      <UserSearchFilter
        onSearch={this.onSearch}
        getLimitedUserDefinedFieldsSummaryUrl={
          this.props.limitedUserDefinedFieldsSummaryFetchAPIUrl
        }
        accessToken={this.props.accessToken}
        searchIconCls={this.props.searchIconCls}
        isRestrictedAdminUser={this.props.isRestrictedAdminUser}
        onAdditionFilterChange={this.handleAdditionalFilterChange}
        additionalUserFilters={additionalFilters}
        isTimePeriodFilterAllowed={this.props.isTimePeriodFilterAllowed}
        isSearchFilterAsButton={this.props.isSearchFilterAsButton}
        searchPlaceholderText={this.props.searchPlaceholderText}
        searchFilterLabel={this.props.searchFilterLabel}
        showAdvancedSearch={this.props.showAdvancedSearch}
        timePeriodFilterLabels={this.props.timePeriodFilterLabels}
        user={this.props.user}
        searchText={this.props.defaultSearchText}
      />
    );
  };
  onSearch = (selections, udfSelectedValues) => {
    var userSelectedValues = this.state.isFilterCleared
      ? []
      : Utils.getFilteredValues(selections);
    this.setState(
      {
        isDataLoading: true,
        userSelectedValues: userSelectedValues,
        currentPaginationIndex: 1,
        totalUserCount: 0,
      },
      () => {
        this.getReport();
      }
    );
  };
  handleSortChange = (column, sortOrder) => {
    this.setState(
      {
        sortColumn: column.key,
        sortOrder: sortOrder,
        isDataLoading: true,
      },
      () => {
        this.getReport();
        this.props.onSort();
      }
    );
  };
  handlePageIndexChange = (index) => {
    if (this.state.isDataLoading) {
      return;
    }
    this.setState(
      {
        currentPaginationIndex: index || 1,
        isDataLoading: true,
      },
      () => {
        this.getReport();
      }
    );
  };
  handleFetchCountChange = (count) => {
    if (this.state.isDataLoading) {
      return;
    }
    this.setState(
      {
        pageSize: count || 25,
        isDataLoading: true,
        currentPaginationIndex: 1,
      },
      () => {
        this.getReport();
      }
    );
  };
  setKeyIndex = (report) => {
    report.forEach((data, index) => {
      if (typeof this.props.onKeyExtractor === "function") {
        data[this.props.identifierColumn] = String(
          this.props.onKeyExtractor(
            data,
            index,
            this.state.currentPaginationIndex,
            this.state.pageSize
          )
        );
      } else {
        if (this.props.identifierColumn === "keyId") {
          data.keyId = String(
            this.state.pageSize * (this.state.currentPaginationIndex - 1) +
              index
          );
        }
      }
    });
  };

  getReport = (filterUrl) => {
    const urlWithParams = this.generateQueryString(filterUrl, 1);
    // console.log(urlWithParams);
    if (this.props.supportLog) {
      Logger.logInfo({
        dbPointer: this.props.user.dbPointer,
        logText: "Report opened",
        host: window.location.host,
        level: "INFO",
        logSender: this.props.logData.logSender,
        userAgentString: navigator.userAgent,
        userName: this.props.user.userName,
        additionalData: {
          url: window.location.href,
          serviceUrl: urlWithParams,
          reportDetail: this.props.logData.reportDetail,
          reportLevel: this.props.logData.reportLevel,
          pageNo:
            this.props.queryParams.offset / this.props.queryParams.fetchCount +
            1,
        },
      });
    }

    const startTime = new Date();

    Service.getReportData(urlWithParams, this.props.accessToken)
      .then((data) => {
        const endTime = new Date();
        if (this.props.supportLog) {
          Logger.logInfo({
            dbPointer: this.props.user.dbPointer,
            logText: "Report loaded",
            host: window.location.host,
            level: "INFO",
            logSender: this.props.logData.logSender,
            userAgentString: navigator.userAgent,
            userName: this.props.user.userName,
            timeTaken:
              Math.round((((endTime - startTime) / 1000) % 60) * 10) / 10,
            additionalData: {
              url: window.location.href,
              serviceUrl: urlWithParams,
              reportDetail: this.props.logData.reportDetail,
              reportLevel: this.props.logData.reportLevel,
              pageNo:
                this.props.queryParams.offset /
                  this.props.queryParams.fetchCount +
                1,
            },
          });
        }
        let report = data || [],
          totalUserCount = this.state.totalUserCount;
        if (report && report.length === 0) {
          this.setState(
            {
              reportData: report,
              totalUserCount: 0,
              // updateKey: new Date().valueOf(),
              isDataLoading: false,
              isLearnerAnalytics: report.list && report.totalUserCount,
              loadingState: LoadingStates.FETCHED_BUT_EMPTY,
            },
            function () {
              this.props.onReportDataFetch(
                report,
                report && report.length === 0
              );
            }
          );
        } else {
          let fetchedReport = report;
          if (this.props.isPagingNeeded) {
            if (Array.isArray(report)) {
              fetchedReport = report;
            } else {
              if (this.props.rowMappingName) {
                fetchedReport = report[this.props.rowMappingName];
              } else if (report.list) {
                fetchedReport = report.list;
              } else {
                fetchedReport = report.items;
              }
            }
          } else {
            fetchedReport = report;
          }
          if (
            fetchedReport?.length > 0 &&
            this.state.currentPaginationIndex ===
              this.props.currentPaginationIndex &&
            this.props.isPagingNeeded
          ) {
            if (this.props.totalCountMappingName) {
              totalUserCount =
                report[this.props.totalCountMappingName] ||
                this.state.totalUserCount;
            } else if (report.totalUserCount) {
              totalUserCount =
                report.totalUserCount || this.state.totalUserCount;
            } else {
              totalUserCount = report.totalCount || this.state.totalUserCount;
            }
          }
          if (this.props.isPagingNeeded) {
            this.setKeyIndex(fetchedReport);
          }
          this.setState(
            {
              reportData: fetchedReport,
              totalUserCount: totalUserCount,
              updateKey: new Date().valueOf(),
              isDataLoading: false,
              isLearnerAnalytics: report.list && report.totalUserCount,
              loadingState:
                fetchedReport?.length > 0
                  ? LoadingStates.FETCHED_AND_AVAILABLE
                  : LoadingStates.FETCHED_BUT_EMPTY,
            },
            function () {
              this.props.onReportDataFetch(
                fetchedReport,
                fetchedReport && fetchedReport?.length === 0,
                data
              );
            }
          );
        }
      })
      .catch((error) => {
        const endTime = new Date();
        if (this.props.supportLog) {
          Logger.logError({
            dbPointer: this.props.user.dbPointer,
            logText: "Report loading failed",
            host: window.location.host,
            level: error.message,
            logSender: this.props.logData.logSender,
            userAgentString: navigator.userAgent,
            userName: this.props.user.userName,
            timeTaken:
              Math.round((((endTime - startTime) / 1000) % 60) * 10) / 10,
            additionalData: {
              url: window.location.href,
              serviceUrl: urlWithParams,
              reportDetail: this.props.logData.reportDetail,
              reportLevel: this.props.logData.reportLevel,
              pageNo:
                this.props.queryParams.offset /
                  this.props.queryParams.fetchCount +
                1,
            },
          });
        }
        this.props.onReportDataFetchFailure(error);
      });
  };
  renderAlert = () => {
    if (this.state.showAlert) {
      return (
        <DialogControl
          ctrCls={"error-dialog"}
          showOkButton={false}
          onCloseButtonClick={() => {
            this.setState({
              showAlert: false,
            });
          }}
          showHeaderCloseButton={true}
          title={this.props.t("common.error.label")}
          showCloseButton={true}
          content={<div>{this.state.errorMessage}</div>}
        />
      );
    }
  };
  exportExcel = () => {
    let request = {},
      summary = {};
    summary[this.props.reportTitle] = this.props.reportValue || "";
    request.urlWithParams = this.generateQueryString(
      this.props.exportData.downloadAnalyticsUrl,
      2
    );
    request.excludeCredentials = this.props.exportData.excludeCredentials;
    request.bodyParams = {
      workSheetName: this.props.exportData.worksheetName || "Report",
      fileName: `${
        this.props.exportData.fileName || "Report"
      }-${moment().format("MM-DD-YYYY-HH:mm")}.xlsx`,
      summary: summary,
    };
    if (this.props.isInternalDownloadProcess) {
      this.getExcelExport(request, request.urlWithParams);
    } else if (window.parent) {
      window.parent.postMessage(
        { type: "reportview-download", msg: { request: request } },
        "*"
      );
    }
  };
  getExcelExport = (request, urlWithParams) => {
    this.setState({
      isDownloading: true,
      operationMessage:
        this.props.exportData.exportingMessage || this.props.t("reportWidget.exporting"),
    });

    var startTime = new Date();
    if (this.props.supportLog) {
      Logger.logInfo({
        dbPointer: this.props.user.dbPointer,
        logText: "Export Starting",
        host: window.location.host,
        level: "INFO",
        logSender: this.props.logData.logSender,
        userAgentString: navigator.userAgent,
        userName: this.props.user.userName,
        additionalData: {
          url: window.location.href,
          serviceUrl: urlWithParams,
          reportDetail: this.props.logData.reportDetail,
          reportLevel: this.props.logData.reportLevel,
          pageNo:
            this.props.queryParams.offset / this.props.queryParams.fetchCount +
            1,
        },
      });
    }
    //ToDo start export message
    Service.downloadReportData(
      request.urlWithParams,
      this.props.accessToken,
      request.bodyParams
    ).then((parsedResult) => {
      const endTime = new Date();
      let errorMessage = parsedResult.errorMessage;
      if (errorMessage) {
        this.setState({ isDownloading: false });
        if (this.props.supportLog) {
          Logger.logError({
            dbPointer: this.props.user.dbPointer,
            logText: "Export Error",
            host: window.location.host,
            level: JSON.stringify(parsedResult.errorMessage),
            logSender: this.props.logData.logSender,
            userAgentString: navigator.userAgent,
            userName: this.props.user.userName,
            timeTaken:
              Math.round((((endTime - startTime) / 1000) % 60) * 10) / 10,
            additionalData: {
              url: window.location.href,
              serviceUrl: urlWithParams,
              reportDetail: this.props.logData.reportDetail,
              reportLevel: this.props.logData.reportLevel,
              pageNo:
                this.props.queryParams.offset /
                  this.props.queryParams.fetchCount +
                1,
            },
          });
        }
        //TODo operation End
        //ToDo show error alert
      } else {
        let exportProcessResponse = new ExportProcessResponse(parsedResult);
        this.checkAndTrackExportStatus(
          exportProcessResponse,
          request.urlWithParams,
          startTime
        );
        if (!this.progressTimer) {
          this.progressTimer = setTimeout(
            this.checkExportProgress.bind(
              this,
              parsedResult,
              request.urlWithParams,
              startTime
            ),
            2000
          );
        }
      }
    });
  };
  checkAndTrackExportStatus = (
    exportProcessResponse,
    urlWithParams,
    startTime
  ) => {
    switch (exportProcessResponse.exportStatus) {
      case ConversionStatus.COMPLETED:
        const endTime = new Date();
        if (this.progressToastRef && this.progressToastRef.destroy) {
          this.progressToastRef.destroy();
        }

        this.setState({ isDownloading: false });
        clearTimeout(this.progressTimer);
        this.progressTimer = null;
        FileHelper.downloadUrlAsFile(exportProcessResponse.fileUrl);
        if (this.props.supportLog) {
          Logger.logInfo({
            dbPointer: this.props.user.dbPointer,
            logText: "Export Completed",
            host: window.location.host,
            level: "INFO",
            logSender: this.props.logData.logSender,
            userAgentString: navigator.userAgent,
            userName: this.props.user.userName,
            timeTaken:
              Math.round((((endTime - startTime) / 1000) % 60) * 10) / 10,
            additionalData: {
              url: window.location.href,
              serviceUrl: urlWithParams,
              reportDetail: this.props.logData.reportDetail,
              reportLevel: this.props.logData.reportLevel,
              pageNo:
                this.props.queryParams.offset /
                  this.props.queryParams.fetchCount +
                1,
            },
          });
        }
        break;
      case ConversionStatus.INPROGRESS:
        this.setState(
          {
            operationMessage:
              this.props.exportData.exportingInProgressMessage ||
              this.props.t("reportWidget.inprogress"),
          },
          () => {
            this.progressTimer = setTimeout(
              this.checkExportProgress.bind(this, exportProcessResponse),
              2000
            );
          }
        );
        break;
      case ConversionStatus.ERROR:
        let isExceedsOutOfRangeError =
          exportProcessResponse.errorMessage ===
            "Array dimensions exceeded supported range." ||
          exportProcessResponse.errorMessage === "Row out of range" ||
          exportProcessResponse.errorMessage ===
            "Insufficient memory to continue the execution of the program.";
        // let errorMsg = isExceedsOutOfRangeError ? S.getLocaleText("common.rowOutOfRangeErrorMsg") : S.getLocaleText("analyticsView.completionRatioAnalytics.excelReport.errorOnDownload");
        if (this.progressToastRef && this.progressToastRef.destroy) {
          this.progressToastRef.destroy();
        }
        this.setState({
          isDownloading: false,
          showAlert: true,
          errorMessage: this.props.t("reportWidget.errorMsg"),
        });
        if (this.props.supportLog) {
          Logger.logError({
            dbPointer: this.props.user.dbPointer,
            logText: "Export Error",
            host: window.location.host,
            level: "INFO",
            logSender: this.props.logData.logSender,
            userAgentString: navigator.userAgent,
            userName: this.props.user.userName,
            timeTaken:
              Math.round((((endTime - startTime) / 1000) % 60) * 10) / 10,
            additionalData: {
              url: window.location.href,
              serviceUrl: urlWithParams,
              reportDetail: this.props.logData.reportDetail,
              reportLevel: this.props.logData.reportLevel,
              pageNo:
                this.props.queryParams.offset /
                  this.props.queryParams.fetchCount +
                1,
            },
          });
        }

        break;
    }
  };
  checkExportProgress = (conversionStatusRequest, urlWithParams, startTime) => {
    let exportToken = `exportToken=${conversionStatusRequest.exportToken}`;
    let serviceUrl = `${
      this.props.exportStatusAPIUrl ||
      "https://disprzanalytics.azurewebsites.net/api/analytics/getExportTokenStatus"
    }?${exportToken}`;
    Service.getExportStatus(serviceUrl, this.props.accessToken).then((data) => {
      let exportResponse = new ExportProcessResponse(data);
      if (exportResponse.exportStatus === 3 && exportResponse.fileUrl === "") {
        this.refs.progressToast.destroy();
        this.setState({ isDownloading: false });
        //TODo show alert
      } else {
        this.checkAndTrackExportStatus(
          exportResponse,
          urlWithParams,
          startTime
        );
      }
    });
  };
  generateQueryString = (
    filterUrl,
    type,
    includeDate = true,
    isExperimentalReportHub = false
  ) => {
    let params = this.props.queryParams;
    if (!includeDate) {
      delete params.fromTimePeriod;
      delete params.toTimePeriod;
    }
    params.fetchCount = this.state.pageSize;
    params.offset =
      ((this.state.currentPaginationIndex || 1) - 1) * this.state.pageSize;
    params.orderBy = this.state.sortColumn || "";
    params.orderByType = this.state.sortOrder || SortOrder.ASC;
    params.timezoneOffsetInMins = new Date().getTimezoneOffset();
    if (this.props.showTimeDurationFilter && type === 1) {
      params.fromTimePeriod = encodeURIComponent(
        this.state.fromDate.toISOString()
      );
      params.toTimePeriod = encodeURIComponent(this.state.toDate.toISOString());
    }
    Object.keys(params).forEach((param) => {
      if (param === "fetchTotalCount" || param === "fetchTotalUserCount") {
        params[param] =
          this.state.currentPaginationIndex ===
          this.props.currentPaginationIndex;
      }
    });
    Object.keys(this.state.columnFilter).forEach((key) => {
      if (this.state.columnFilter[key]) {
        params[key] = this.state.columnFilter[key];
      } else {
        delete params[key];
      }
    });
    if (type === 1) {
      params.isReport = false;
    }
    if (type === 2) {
      delete params.offset;
      delete params.fetchCount;
      params.fetchUdfDetails = this.props.fetchUdfDetails;
      params.fetchCompletionDetails = this.props.fetchCompletionDetails;
      params.isReport = true;
    }
    let urlWithParams;
    if (isExperimentalReportHub) {
      urlWithParams = `${
        filterUrl ? filterUrl : this.props.url
      }?${Utils.getQueryString(params, [])}`;
    } else {
      urlWithParams = `${
        filterUrl ? filterUrl : this.props.url
      }?${Utils.getQueryString(params, this.state.userSelectedValues)}`;
    }
    return urlWithParams;
  };
}

ReportWidget.defaultProps = {
  //   ref: "reportWidget",
  userSelectedValues: [],
  analyticsColumns: [],
  isPagingNeeded: true,
  nonSelectable: true,
  pagingType: PagingType.NUMBERED,
  toFetchDetailedAnalytics: false,
  isSearchFilterAsButton: true,
  searchPlaceholderText: "",
  fetchUdfDetails: true,
  fetchCompletionDetails: true,
  deletable: false,
  showSearchFilter: true,
  ctrCls: "",
  showTimeDurationFilter: false,
  defaultTimeDuration: null,
  customTimePeriod: false,
  reportTitle: "",
  allowExport: false,
  additionalUserFilters: [],
  queryParams: {},
  exportData: {
    downloadAnalyticsUrl: "",
    exportButtonTooltip: "",
    exportStatusAPIUrl: "",
    worksheetName: "",
    exportButtonText: "",
    fileName: "Report",
    excludeCredentials: false,
    exportingMessage: "",
    exportingInProgressMessage: "",
  },
  disableExportButton: false,
  showAdvancedSearch: true,
  identifierColumn: "keyId",
  hideBottomButtons: true,
  editable: false,
  searchFilterLabel: "Search / Filter",
  searchable: true,
  additionalButton: null,
  supportLog: false,
  onReportDataFetch: () => void 0,
  onReportDataFetchFailure: () => void 0,
  onRowChecked: () => void 0,
  onEdit: () => void 0,
  onDelete: () => void 0,
  onFetchAllRecordsForSelection: (arg) => arg(),
  canShowSelectAllRecordsButton: false,
  onSort: () => void 0,
  onKeyExtractor: undefined,
  currentPaginationIndex: 1,
};

ReportWidget.propTypes = {
  /**
   * Specify ctrCls for the Report widget class name
   */
  ctrCls: PropTypes.string,
  /**
     * Specify queryParams for the Report widget listing API
     * let queryParam = {
      maxItems: 25,
      offset: 0,
      fetchCount: 25,
      filterIds: ["test", "test2"],
      includeTotalCount: true,
    };
     */
  queryParams: PropTypes.any.isRequired,
  /**
   * Specify showSearchFilter for the Report widget basic search and advance search hide & and show purpose
   */
  showSearchFilter: PropTypes.bool,
  /**
   * Specify showTimeDurationFilter for the Report widget datefilter hide & and show purpose
   */
  showTimeDurationFilter: PropTypes.bool,
  /**
   * Specify nonSelectable for the table rows checkbox option hide & and show purpose
   */
  nonSelectable: PropTypes.bool,
  /**
   * Specify isPagingNeeded for the table pagination hide & and show purpose. But API results should be an array format.
   */
  isPagingNeeded: PropTypes.bool,
  /**
     * Specify analyticsColumns for the table eacg columns detail as an array format.
     * [
     *  {
        key: "key",
        name: "JIRA ID",
        sortable: true,
        cls: "half-string",
        type: ColumnTypes.STRING,
        isHighlight: true,
      },
     * ]
     */
  analyticsColumns: PropTypes.array.isRequired,
  /**
     * Specify user object, which is DB related thing,
     * {
      userName: "stagingvigneshs1",
      dbPointer: "stagingcorp",
      }
     *
     */
  user: PropTypes.object.isRequired,
  /**
   * Specify searchable for the table column filter option as dropdown hide & and show purpose
   */
  searchable: PropTypes.bool,
  /**
   * Specify allowExport for the table export option hide & and show purpose
   */
  allowExport: PropTypes.any,
  /**
     * Specify exportData for the table export url link as object
     * {
      downloadAnalyticsUrl:
      "https://disprzanalytics-staging.azurewebsites.net/api/analytics/downloadLearnerTimeSpentDetailedAnalytics",
    }
     *
     */
  exportData: PropTypes.object,
  /**
   * Specify limitedUserDefinedFieldsSummaryFetchAPIUrl for the table advance search fields generated by link
   */
  limitedUserDefinedFieldsSummaryFetchAPIUrl: PropTypes.string,
  /**
   * Specify accessToken for the table list API token
   */
  accessToken: PropTypes.string.isRequired,
  /**
   * Specify url for the table list API link
   */
  url: PropTypes.string.isRequired,
  /**
   * Specify editable for the table rows edit option hide & and show purpose
   */
  editable: PropTypes.bool,
  /**
   * Specify deletable for the table delete option hide & and show purpose
   */
  deletable: PropTypes.bool,
  /**
   * Specify onEdit for the table row edit function with row detail
   */
  onEdit: PropTypes.func,
  /**
   * Specify onDelete for the table delete function on that row data
   */
  onDelete: PropTypes.func,
  /**
   * Specify additionalButton to show on top right. param allow react element
   */
  additionalButton: PropTypes.any,
  /**
   * Specify mapping name for the row element from the server's response data
   */
  rowMappingName: PropTypes.string,
  /**
   * Specify mapping name for the total items to display in report widget from the server's response data
   */
  totalCountMappingName: PropTypes.string,
  /**
   * Enforce server side sorting if there are total number of items less than or equal to row items
   */
  enforceServiceSideSorting: PropTypes.bool,
  /**
   * Specify if logging is required
   */
  supportLog: PropTypes.bool,
  /**
   * The value that will be passed to UserSearchFilter's searchText prop
   */
  defaultSearchText: PropTypes.string,
  /**
   * Callback on API failure
   */
  onReportDataFetchFailure: PropTypes.func,
  /**
   * Callback on API success
   */
  onReportDataFetch: PropTypes.func,
  /**
   * Function which accepts the row identifier to select the rows
   */
  onFetchAllRecordsForSelection: PropTypes.func,
  /**
   * Shows select all records  button for all the pages
   */
  canShowSelectAllRecordsButton: PropTypes.bool,
  /**
   * Custom key to identity rows on the Report Widget, defaults to index
   */
  onKeyExtractor: PropTypes.func,
  /**
   * Callback on sort
   */
  onSort: PropTypes.func,
  /**
   * Boolean to determine whether a row can be selected or not by clicking the full row
   */
  canToggleRowSelectionByRow: PropTypes.bool,
  /**
   * Callback when a row is clicked when `canToggleRowSelectionByRow` is false
   */
  onRowClicked: PropTypes.func,
  /**
   * Denotes default pagination index when loaded for the first time (1 based index)
   */
  currentPaginationIndex: PropTypes.number,
  /**
   * Denotes the text to be displayed for the editable actions column
   */
  editableActionsText: PropTypes.string,
  /**
   * text to be displayed for the items per page
   */
  itemsPerPageText: PropTypes.string,
  /**
   * text to be displayed for the page size
   */
  pageSizeText: PropTypes.string,
};


export default withLocalizerContext(ReportWidget);
