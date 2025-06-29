import { Component } from "react";
import AppButton from "../AppButton/AppButton";
import * as Utils from "../Utils";
import moment from "moment";
import * as Service from "../Service/Service";
import DropDown from "../DropDown/DropDown";
import { UserDefinedField } from "../Models/UserDefinedField";
// import Datepicker from "../Datepicker/Datepicker";
import AppIcon from "../AppIcon/AppIcon";
import PropTypes from "prop-types";
import CascadingUserDefinedFieldSelector from "../CascadingUserDefinedFieldSelector/CascadingUserDefinedFieldSelector";
import Scrollbars from "react-custom-scrollbars";
import "./UserSearchFilter.scss";
import DateTimePicker from "../DatePicker/DateTimePicker";
import MultiSelectDropDown from "../MultiSelectDropDown/MultiSelectDropDown";
import withLocalizerContext from "../HOC/withLocalizerContext";

class UserSearchFilter extends Component {
  constructor(props) {
    super(props);
    let fromTimePeriod = null,
      toTimePeriod = null;
    if (props.userFilteredValues.timePeriodValues) {
      fromTimePeriod = this.props.userFilteredValues.timePeriodValues
        .fromTimePeriod
        ? this.props.userFilteredValues.timePeriodValues.fromTimePeriod
        : null;
      toTimePeriod = this.props.userFilteredValues.timePeriodValues.toTimePeriod
        ? this.props.userFilteredValues.timePeriodValues.toTimePeriod
        : null;
    }

    this.state = {
      showAdvancedSearch: false,
      isSearchInProgress: false,
      firstNameSearchText: "",
      lastNameSearchText: "",
      emailSearchText: "",
      userIdSearchText: "",
      udfSummaryGetInProgress: true,
      searchText: this.props.searchText,
      udfSelectedValues: this.props.userFilteredValues.udfSelectedValues || [],
      userDefinedFields: [],
      additionalFilters: this.props.additionalFilters || {},
      userSelectedValuesCount: 0,
      fromTimePeriod: fromTimePeriod,
      toTimePeriod: toTimePeriod,
      updateKey: new Date().valueOf(),
      searchActive: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    let isNotEqualProps = !Utils.areObjectsEqual(
      nextProps.udfsToExclude,
      this.props.udfsToExclude
    );
    if (isNotEqualProps) {
      let isAlreadyExcluded = this.props.udfsToExclude.filter(function (
        fieldId
      ) {
        return nextProps.udfsToExclude.includes(fieldId);
      },
      this);
      if (isAlreadyExcluded.length === 0) {
        this.getUDFFieldsSummary();
      }
    }
  }

  componentDidMount() {
    if (
      this.props.showAdvancedSearch &&
      this.props.getLimitedUserDefinedFieldsSummaryUrl
    ) {
      this.getUDFFieldsSummary();
    } else {
      this.setState({
        udfSummaryGetInProgress: false,
      });
    }
  }

  getUDFFieldsSummary = () => {
    const canHideUdfsWithZeroUsers = this.props?.canHideUdfsWithZeroUsers;
    Service.getLimitedUserDefinedFieldsSummary(
      this.props.getLimitedUserDefinedFieldsSummaryUrl,
      this.props.accessToken
    ).then((data) => {
      if (data && data?.map) {
        let userDefinedFields = data?.map(function (userDefinedField) {
          return new UserDefinedField(userDefinedField,canHideUdfsWithZeroUsers);
        }).filter((udf) => udf.fieldType === "List" ? udf.allowedValues.length > 0 : this.props.includeStringTypeUdfs );

        if (
          this.props?.user?.dbPointer?.toLowerCase() === "mnm" ||
          this.props?.user?.dbPointer?.toLowerCase() === "mnmqa"
        ) {
          userDefinedFields = this.reOrderUdfFields(userDefinedFields);
        }

        if (this.props.udfsToExclude.length > 0) {
          userDefinedFields = userDefinedFields.filter((field) => {
            return !this.props.udfsToExclude.includes(field.fieldId);
          });
        }

        this.setState({
          userDefinedFields: userDefinedFields,
          udfSummaryGetInProgress: false,
        });
      }
    });
  };
  reOrderUdfFields = (udfList) => {
    let orderedUdfList = [];
    let mnmOrder = [7, 10, 9, 12, 2, 6, 3];
    mnmOrder.forEach((orderId) => {
      udfList.forEach((udf) => {
        if (udf.fieldId === orderId) {
          orderedUdfList.push(udf);
        }
      });
    });
    return orderedUdfList;
  };
  onFromTimePeriodChange = (value) => {
    this.setState({
      fromTimePeriod: moment(value),
    });
  };

  onToTimePeriodChange = (value) => {
    this.setState({
      toTimePeriod: moment(value),
    });
  };

  getDefaultFilters = () => {
    let firstName = this.state.firstName,
      lastName = this.state.lastName,
      userId = this.state.userId,
      email = this.state.email;
    if (this.props.isFilterChanged) {
      firstName = this.state.firstName !== "" ? this.state.firstName : "";
      lastName = this.state.lastName !== "" ? this.state.lastName : "";
      userId = this.state.userId !== "" ? this.state.userId : "";
      email = this.state.email !== "" ? this.state.email : "";
    }
    let defaultFilters = [
      {
        key: "firstName",
        label: this.props.t('userSearchFilter.defaultFilters.firstNameLbl'),
        placeHolder: this.props.t('userSearchFilter.defaultFilters.firstNamePlaceholder'),
        type: "text",
        value: firstName,
      },
      {
        key: "lastName",
        label: this.props.t('userSearchFilter.defaultFilters.lastNameLbl'),
        placeHolder: this.props.t('userSearchFilter.defaultFilters.lastNamePlaceholder'),
        type: "text",
        value: lastName,
      },
      {
        key: "userId",
        label: this.props.t('userSearchFilter.defaultFilters.userIdLbl'),
        placeHolder:this.props.t('userSearchFilter.defaultFilters.userIdPlaceholder'),
        type: "text",
        value: userId,
      },
      {
        key: "email",
        label: this.props.t('userSearchFilter.defaultFilters.emailLbl') ,
        placeHolder: this.props.t('userSearchFilter.defaultFilters.emailPlaceholder'),
        type: "email",
        value: email,
      },
    ];

    return defaultFilters.map((defaultFilterCfg) => {
      return (
        <div
          className={"col-xs-3 noleft-padding udf-option default-filters"}
          key={defaultFilterCfg.key}
        >
          <div className="input-label-item">{defaultFilterCfg.label}</div>
          <div className={"input-label-item"}>
            <input
              type={defaultFilterCfg.type}
              value={defaultFilterCfg.value}
              onChange={this.requestChange.bind(
                this,
                defaultFilterCfg.key,
                null
              )}
              placeholder={defaultFilterCfg.placeHolder}
            />
          </div>
        </div>
      );
    });
  };
  getTimeFilter = () => {
    let fromTimePeriod = this.state.fromTimePeriod,
      toTimePeriod = this.state.toTimePeriod,
      fromTimePeriodLabel = this.props.t("userSearchFilter.timeFilter.fromTimePeriodLabel"),
      toTimePeriodLabel = this.props.t("userSearchFilter.timeFilter.toTimePeriodLabel"),
      timePeriodFilterLabels = this.props.timePeriodFilterLabels;
    if (this.props.isFilterChanged) {
      fromTimePeriod = this.state.fromTimePeriod
        ? this.state.fromTimePeriod
        : null;
      toTimePeriod = this.state.toTimePeriod ? this.state.toTimePeriod : null;
    }
    if (Object.keys(timePeriodFilterLabels).length > 0) {
      fromTimePeriodLabel = timePeriodFilterLabels.fromPeriodLabel;
      toTimePeriodLabel = timePeriodFilterLabels.toPeriodLabel;
    }

    let timeFilters = [
      {
        key: "timePeriodFrom",
        label: fromTimePeriodLabel,
        onDateChange: this.onFromTimePeriodChange,
        initialValue: fromTimePeriod,
      },
      {
        key: "timePeriodTo",
        label: toTimePeriodLabel,
        onDateChange: this.onToTimePeriodChange,
        initialValue: toTimePeriod,
      },
    ];

    return timeFilters.map((timeFilterCfg) => {
      return (
        <div
          className={
            "col-xs-3 noleft-padding udf-option default-filters completion-time-period"
          }
          key={timeFilterCfg.key}
        >
          <div className="input-label-item">{timeFilterCfg.label}</div>
          <div className={"input-label-item"}>
            {/* <Datepicker
              ctrCls="datepicker available-from feedback-widget"
              placeholder={timeFilterCfg.label}
              autoClose={false}
              includeTimeSelection={true}
              initialValue={timeFilterCfg.initialValue}
              onDateChange={timeFilterCfg.onDateChange}
              disabled={false}
              maxDateValue={moment()}
            /> */}
            <DateTimePicker />
          </div>
        </div>
      );
    }, this);
  };

  getAdditionalFilters = (userFilters) => {
    return userFilters.map((filterCfg) => {
      let inputControl = null;
      switch (filterCfg.type) {
        case "list":
          if (!filterCfg.multiSelect) {
            inputControl = (
              <DropDown
                key={`${filterCfg.key}_${new Date().valueOf()}`}
                ctrCls={"type-selector"}
                clearable={true}
                searchable={filterCfg.multiSelect}
                value={this.state.additionalFilters[filterCfg.key]}
                disabled={false}
                menuPosition={"fixed"}
                isMulti={filterCfg.multiSelect}
                closeMenuOnSelect={!filterCfg.multiSelect}
                backspaceToRemoveMessage={""}
                onSelect={this.additionalFilterListChange(
                  filterCfg,
                  filterCfg.multiSelect
                )}
                items={filterCfg.options}
              />
            );
          } else {
            inputControl = (
              <MultiSelectDropDown
                items={filterCfg.options}
                values={this.state.additionalFilters[filterCfg.key]}
                onSelect={this.additionalFilterListChange(
                  filterCfg,
                  filterCfg.multiSelect
                )}
              />
            );
          }
          break;
        case "daterange":
          inputControl = (
            <DateTimePicker
              onChange={this.additionalFilterListChange(filterCfg, false)}
              selectDuration={true}
              startDate={
                Date.parse(
                  this.state.additionalFilters[`${filterCfg.key}From`]
                ) || undefined
              }
              endDate={
                Date.parse(
                  this.state.additionalFilters[`${filterCfg.key}To`]
                ) || undefined
              }
            />
          );
          break;
        default:
          inputControl = (
            <input
              type={filterCfg.type}
              value={this.state.additionalFilters[filterCfg.key]}
              key={`${filterCfg.key}_${this.state.updateKey}`}
              onChange={this.additionalFilterValueChange(filterCfg.key)}
              placeholder={filterCfg.placeholder || filterCfg.label}
            />
          );
          break;
      }
      return (
        <div
          className={
            "col-xs-3 noleft-padding udf-option default-filters additional-filter"
          }
          key={`udf${filterCfg.key}`}
        >
          <div className="input-label-item">{filterCfg.label}</div>
          <div className={"input-label-item"}>{inputControl}</div>
        </div>
      );
    }, this);
  };
  requestChange = (stateletiable, associatedReactComponentRef, e) => {
    let cpt;
    if (associatedReactComponentRef) {
      cpt = this.refs[associatedReactComponentRef];
      if (cpt && typeof cpt.getValue !== "function") {
        let displayName = cpt.constructor ? cpt.constructor.displayName : cpt;
        throw (
          "React Component " + displayName + " does not implement getValue()"
        );
      }
    }

    let newValue = cpt ? cpt.getValue() : e.currentTarget.value;
    let newState = {};
    newState[stateletiable] = newValue;
    this.setState(newState);
  };

  render() {
    let loadingUDFState = "",
      defaultFilters = this.getDefaultFilters();
    let searchBtn = !this.state.isSearchInProgress ? (
      <AppButton
        buttonCls="search-button"
        buttonIconCls={this.props.searchIconCls || "icon-search"}
        clickHandler={
          !!this.state.searchText || this.state.searchActive
            ? this.triggerSearch
            : this.openSearchBar
        }
        buttonLabel={""}
        ctrCls="search-button"
        type="outlined"
      />
    ) : (
      <div className={"spinner-container"}>
        <div className="loading-spinner enabled-status" />
      </div>
    );
    if (this.state.udfSummaryGetInProgress) {
      loadingUDFState = (
        <div
          className="full-height full-width center-align"
          style={{ textAlign: "center" }}
        >
          <div className="animated-spinner-2" />
          <div>{this.props.t('userSearchFilter.fetchingSearchListLbl')}</div>
        </div>
      );
    }

    const outsideFilters = [];
    const insideFilters = [];

    if (this.props.additionalUserFilters.length > 0) {
      this.props.additionalUserFilters.forEach((filterCfg) => {
        if (filterCfg.isInsideFilter) {
          insideFilters.push(filterCfg);
        } else {
          outsideFilters.push(filterCfg);
        }
      });
    }

    if (insideFilters.length > 0) {
      defaultFilters = this.props.getLimitedUserDefinedFieldsSummaryUrl
        ? defaultFilters.concat(this.getAdditionalFilters(insideFilters))
        : [].concat(this.getAdditionalFilters(insideFilters));
    }

    if (this.props.isTimePeriodFilterAllowed) {
      let timeFilter = this.getTimeFilter();
      let timeFilterInfo = (
        <div className="tooltip-ctr">
          <AppIcon iconCls="icon-info" />
          <div className="tooltip-text">
            <strong>{this.props.t('userSearchFilter.timeFilter.tooltip.title')}</strong>
            <p>
              {this.props.t('userSearchFilter.timeFilter.tooltip.description')}
            </p>
          </div>
        </div>
      );
      timeFilter.push(timeFilterInfo);
      defaultFilters = defaultFilters.concat(timeFilter);
    }

    let udfFilterCtr = (
      <div className="udf-scroll-container">
        <CascadingUserDefinedFieldSelector
          allFieldsVisible={true}
          userDefinedFields={this.state.userDefinedFields}
          allowValuesMultiSelect={true}
          selectedFieldsAndValues={this.state.udfSelectedValues}
          user={this.props.user}
          isRestrictedAdminUser={this.props.isRestrictedAdminUser}
          ctrCls={"col-xs-3 noleft-padding"}
          fieldCls={"col-xs-12 no-padding"}
          udfFieldCls={"col-xs-12 noleft-padding"}
          containerCls={"user-search-udf-filter"}
          onChange={this.updateSelectedUdfValues}
        />
      </div>
    );

    let btnCtr = (
      <div className="btn-ctr">
        <AppButton
          buttonCls="secondary-button"
          buttonLabel={this.props.t('common.cancel')}
          clickHandler={this.toggleAdvancedSearch}
        />
        <AppButton
          buttonCls="secondary-button"
          buttonLabel={this.props.t("common.clear")}
          clickHandler={this.clearSearch}
        />
        <AppButton
          buttonCls="action"
          buttonLabel={
            this.props.searchTriggerBtnLabel !== ""
              ? this.props.searchTriggerBtnLabel
              : this.props.t("common.search")
          }
          clickHandler={this.triggerSearch}
        />
      </div>
    );
    let searchFilerLabel =
      this.props.searchFilterLabel !== ""
        ? this.props.searchFilterLabel
        : this.props.t("userSearchFilter.advancedSearch",{prefix: ''});
    let searchFilterTrigger = (
      <a className={"advance-search-link"} onClick={this.toggleAdvancedSearch}>
        {this.state.showAdvancedSearch
          ? this.props.t("userSearchFilter.advancedSearch",{prefix: `${this.props.t("common.hide")} `})
          : searchFilerLabel}
      </a>
    );
    if (this.props.isSearchFilterAsButton) {
      let userSelectedValuesCount =
        this.getUserSelectedValuesCount() > 0 ? (
          <span key={new Date().valueOf()} className={"filter-count"}>
            {this.getUserSelectedValuesCount()}
          </span>
        ) : null;
      searchFilterTrigger = (
        <AppButton
          buttonCls="icon-button"
          clickHandler={this.toggleAdvancedSearch}
          type="plain"
          ctrCls="filter-button"
        >
          <AppIcon iconCls="icon-filter" />
          {userSelectedValuesCount}
        </AppButton>
      );
    }
    let toRenderAdditionalFilterOutside = outsideFilters.length > 0;
    let additionFilterCls = toRenderAdditionalFilterOutside
      ? "has-addition-filters"
      : "";
    return (
      <div className={"user-search-control v2 col-lg-12 col-xs-12"}>
        <div className={"form-container"}>
          <div
            className={`search-form ${additionFilterCls}`}
            onSubmit={this.triggerSearch}
          >
            <div className="search-link-wrapper">
              {toRenderAdditionalFilterOutside && (
                <div className={"additional-filters"}>
                  {" "}
                  {this.getAdditionalFilters(outsideFilters)}
                </div>
              )}
              <div
                className={
                  "search-form-wrapper " +
                  (this.state.searchActive ? " active " : "")
                }
              >
                <form
                  className="search-container"
                  onSubmit={this.triggerSearch}
                >
                  <input
                    type="text"
                    placeholder={
                      this.props.searchPlaceholderText || this.props.t('userSearchFilter.searchPlaceholder')
                    }
                    className="search-input"
                    id="search-input"
                    onChange={this.setSearchText}
                    value={this.state.searchText}
                  />
                  {searchBtn}
                </form>
                {this.state.searchText && (
                  <AppButton
                    buttonCls="user-search-clear"
                    buttonIconCls="corp-close-icon"
                    clickHandler={this.clearRegularSearch}
                    type="outlined"
                    ctrCls="close-button"
                  />
                )}
              </div>
              {this.props.showAdvancedSearch && searchFilterTrigger}
            </div>
          </div>
        </div>
        <div
          className={`advance-search-container ${
            this.state.showAdvancedSearch ? "show-advanced-search" : ""
          }`}
        >
          <div className="filter-container">
            <Scrollbars>
              <div className="filter-with-scrollbar">
                {this.state.udfSummaryGetInProgress ? null : defaultFilters}
                {this.state.udfSummaryGetInProgress ? null : udfFilterCtr}
              </div>
            </Scrollbars>
          </div>
          {this.state.udfSummaryGetInProgress ? null : btnCtr}
          {loadingUDFState}
        </div>
      </div>
    );
  }

  clearRegularSearch = () => {
    this.setState(
      {
        searchText: "",
        searchActive: false,
      },
      this.triggerSearch
    );
  };

  additionalFilterValueChange = (filterKey) => {
    return (e) => {
      let additionalFilters = this.state.additionalFilters;
      additionalFilters[filterKey] = e.target.value;
      this.setState({
        additionalFilters: additionalFilters,
      });
    };
  };

  additionalFilterListChange = (filterConfig, multiSelect) => {
    return (currOption, selectedOptions) => {
      let additionalFilters = this.state.additionalFilters;
      if (!currOption) {
        delete additionalFilters[filterConfig.key];
      } else {
        if (filterConfig.type === "daterange") {
          additionalFilters[`${filterConfig.key}From`] = new Date(
            currOption[0]
          );
          additionalFilters[`${filterConfig.key}To`] = new Date(currOption[1]);
        } else {
          additionalFilters[filterConfig.key] = multiSelect
            ? (selectedOptions || []).concat(currOption)
            : currOption;
          this.setState(
            {
              additionalFilters: additionalFilters,
            },
            () => {
              this.props.onAdditionFilterChange(filterConfig, currOption);
            }
          );
        }
      }
    };
  };

  setSearchText = (e) => {
    let value = e.currentTarget.value;
    this.setState({
      searchText: value,
    });
  };
  clearSearch = () => {
    const additionalFilters = {};
    Object.keys(this.state.additionalFilters).forEach((filter, i) => {
      additionalFilters[filter] = null;
    });

    let newState = {
      searchText: "",
      userFieldFilters: [],
      firstName: "",
      lastName: "",
      udfSelectedValues: [],
      userId: "",
      email: "",
      additionalFilters: {},
      toTimePeriod: null,
      fromTimePeriod: null,
      updateKey: new Date().valueOf(),
    };
    this.state.userDefinedFields.forEach(function (fieldData) {
      if (fieldData.isStringType()) {
        newState[fieldData.fieldId] = "";
      }
    });
    this.setState(newState);
    this.props.onAdditionFilterChange(additionalFilters, null, true);
  };
  toggleAdvancedSearch = () => {
    this.setState(
      {
        showAdvancedSearch: !this.state.showAdvancedSearch,
      },
      () => {
        this.props?.onToggleAdvanceSearch();
      }
    );
  };

  updateSelectedUdfValues = (updatedSelections) => {
    this.setState({
      udfSelectedValues: updatedSelections,
    });
  };

  getUserSelectedValuesCount = () => {
    let userSelectedValuesCount = 0;
    let payload = this.getPayLoad(
      this.state.udfSelectedValues,
      this.state.additionalFilters,
      true
    );
    Object.keys(payload).forEach(function (data) {
      if (
        payload[data] &&
        data !== "userFieldFilters" &&
        data !== "searchString"
      ) {
        userSelectedValuesCount += 1;
      }
    });
    if (payload.userFieldFilters.length > 0) {
      userSelectedValuesCount += payload.userFieldFilters.length;
    }
    return userSelectedValuesCount;
  };

  getPayLoad = (selections, additionFilters, isUdfSelections) => {
    let userSelections = selections.filter(function (userFieldItem) {
      let userFieldValue = isUdfSelections
        ? userFieldItem.fieldValues[0]
        : userFieldItem.fieldValueSearchString;
      return userFieldItem.fieldType === "String"
        ? userFieldValue.trim() !== ""
        : true;
    });
    let payload = {
        searchString: this.state.searchText,
        searchText: this.state.searchText,
        userFieldFilters: userSelections,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        userId: this.state.userId,
        email: this.state.email,
        fromTimePeriod: this.state.fromTimePeriod
          ? moment(this.state.fromTimePeriod).toISOString()
          : null,
        toTimePeriod: this.state.toTimePeriod
          ? moment(this.state.toTimePeriod).toISOString()
          : null,
      },
      additionalFilters = this.state.additionalFilters;
    if (Object.keys(this.state.additionalFilters).length > 0) {
      Object.keys(this.state.additionalFilters).forEach(function (filterKey) {
        let value;
        if (
          Array.isArray(additionalFilters[filterKey]) &&
          additionalFilters[filterKey].length > 0
        ) {
          value = additionalFilters[filterKey].map(function (filter) {
            return filter.value;
          });
        } else if (
          typeof additionalFilters[filterKey] == "string" ||
          typeof additionalFilters[filterKey] == "number"
        ) {
          value = additionalFilters[filterKey];
        } else if (additionalFilters[filterKey] instanceof Date) {
          value = additionalFilters[filterKey].toISOString();
        } else if (
          additionFilters &&
          typeof additionFilters[filterKey] === "object" &&
          additionFilters[filterKey]?.key
        ) {
          value = additionFilters[filterKey].key;
        } else if (
          additionFilters &&
          typeof additionFilters[filterKey] === "object" &&
          additionFilters[filterKey]?.value
        ) {
          value = additionFilters[filterKey].value;
        }
        payload[filterKey] = value;
      });
    }
    return payload;
  };

  openSearchBar = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState(
      { searchActive: true },
      document.getElementById("search-input").focus()
    );
  };

  triggerSearch = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    let selections = this.state.udfSelectedValues.map(function (selection) {
      let fieldObject = {
        fieldId: selection.fieldId,
        fieldLabel: selection.fieldLabel,
        fieldType: selection.fieldType,
      };
      if (selection.fieldType.toLowerCase() === "list") {
        fieldObject.listItemIds = selection.fieldValues.map((value) => {
          return value.listItemId;
        });
        fieldObject.fieldValues = selection.fieldValues.map((value) => {
          return {
            label: value.label,
            value: value.listItemId,
          };
        });
      } else {
        fieldObject.fieldValueSearchString = selection.fieldValues[0];
      }
      return fieldObject;
    });
    this.setState(
      {
        showAdvancedSearch: false,
      },
      function () {
        this.props.onSearch(
          this.getPayLoad(selections, this.state.additionalFilters),
          this.state.udfSelectedValues
        );
      }
    );
  };
}

UserSearchFilter.propTypes = {
  ctrCls: PropTypes.string,
  onSearch: PropTypes.func,
  onToggleAdvanceSearch: PropTypes.func,
  user: PropTypes.object,
  additionalUserFilters: PropTypes.array,
  userFilteredValues: PropTypes.object,
  udfsToExclude: PropTypes.array,
  isSearchFilterAsButton: PropTypes.bool,
  searchFilterLabel: PropTypes.string,
  searchTriggerBtnLabel: PropTypes.string,
  isFilterChanged: PropTypes.bool,
  isTimePeriodFilterAllowed: PropTypes.bool,
  timePeriodFilterLabels: PropTypes.object,
  additionalFilters: PropTypes.object,
  includeStringTypeUdfs: PropTypes.bool,
  searchText: PropTypes.string,
};
UserSearchFilter.defaultProps = {
  ctrCls: "",
  additionalUserFilters: [],
  userFilteredValues: {},
  onAdditionFilterChange: () => {},
  onSearch: () => {},
  udfsToExclude: [],
  searchFilterLabel: "",
  searchTriggerBtnLabel: "",
  isSearchFilterAsButton: false,
  isFilterChanged: false,
  isTimePeriodFilterAllowed: false,
  timePeriodFilterLabels: {},
  additionalFilters: {},
  includeStringTypeUdfs: true,
  onToggleAdvanceSearch: () => {},
  searchText: "",
};

export default withLocalizerContext(UserSearchFilter);
