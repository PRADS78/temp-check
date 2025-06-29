import { Component, createRef } from "react";
import PropTypes from "prop-types";
import AppButton from "../AppButton/AppButton";
import APITYPES from "../ApiTypes";
import * as Utils from "../Utils";
import "./UserSelectionWidget.scss";
import moment from "moment";
import * as Service from "../Service/Service";
import Checkbox from "../Checkbox/Checkbox";
import Scrollbars from "react-custom-scrollbars";
import SortOrder from "../SortOrder";
import AppIcon from "../AppIcon/AppIcon";
import UserSearchFilter from "../UserSearchFilter/UserSearchFilter";
import Pagination from "../Pagination/Pagination";
import withLocalizerContext from "../HOC/withLocalizerContext";

class UserSelectionWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      allUsersSelected: false,
      totalUserCount: 0,
      inactiveUserCount: 0,
      columnData: [],
      selectedUsers:
        props.selectedUsers.length !== 0 ? props.selectedUsers : [],
      currentPaginationIndex: 1,
      fetchingUserEntries: false,
      showMoreOption: false,
      additionalAllocatedOptions: [],
    };
    this.userSelectionHeaderRef = createRef();
    this.totalUsersDisplayLabelRef = createRef();
    this.userSearchFilterRef = createRef();
    this.headerButtonsRef = createRef();
    this.dropDownBoxRef = createRef();
    this.paginationComponentRef = createRef();
  }

  componentDidMount() {
    this.setState(
      {
        resultPerPage: this.props.resultPerPage,
      },
      () => {
        this.searchUsers(1);
      }
    );
    if (this.anyOptionsToRenderOutsideMenu()) {
      window.addEventListener(
        "resize",
        this.checkAndOptimallyRenderAdditionalOptions
      );
    }
  }

  anyOptionsToRenderOutsideMenu() {
    let attemptRenderOutsideMenuOptions = this.props.additionalOptions.filter(
      function (option) {
        return option.attemptRenderOutsideMenu === true;
      }
    );
    return attemptRenderOutsideMenuOptions.length > 0;
  }

  checkAndOptimallyRenderAdditionalOptions = () => {
    let buttonWidth = 160; // Assign button width as static
    let allowedSpaceWidth = this.updateAdditionalBtnAllocation();
    let allowedButtonCount = Math.floor(allowedSpaceWidth / buttonWidth);
    let additionalAllocatedOptions = [];
    this.props.additionalOptions.forEach(function (data, index) {
      if (index < allowedButtonCount && data.attemptRenderOutsideMenu) {
        additionalAllocatedOptions.push(data);
      }
    });
    this.setState({
      additionalAllocatedOptions: additionalAllocatedOptions,
    });
  };

  updateAdditionalBtnAllocation = () => {
    let wrapperEl = this.userSelectionHeaderRef?.current,
      totalUsersDisplayLabel = this.totalUsersDisplayLabelRef?.current,
      userSearchFilter = this.userSearchFilterRef?.current,
      headerButtons = this.headerButtonsRef?.current,
      wrapperWidth = wrapperEl ? wrapperEl.getBoundingClientRect().width : 0,
      totalUsersDisplayLabelWidth = totalUsersDisplayLabel
        ? totalUsersDisplayLabel.getBoundingClientRect().width
        : 0,
      userSearchFilterWidth = userSearchFilter
        ? userSearchFilter.getBoundingClientRect().width
        : 0,
      headerButtonsWidth = headerButtons
        ? headerButtons.getBoundingClientRect().width
        : 0;
    return Math.floor(
      wrapperWidth -
        (totalUsersDisplayLabelWidth +
          userSearchFilterWidth +
          headerButtonsWidth)
    );
  };
  checkAndOptimallyRenderMenuOptions = () => {
    let additionalMenuOption = [];
    if (
      this.props.additionalOptions.length !==
      this.state.additionalAllocatedOptions.length
    ) {
      additionalMenuOption = this.props.additionalOptions.filter((option) => {
        return !this.state.additionalAllocatedOptions.some(
          (allocatedOption) => {
            return JSON.stringify(option) === JSON.stringify(allocatedOption);
          }
        );
      });
    }
    return additionalMenuOption;
  };

  isUserListSubsetOfSelectedUsers = () => {
    let isSubset = true;
    this.state.userList.forEach(function (userData) {
      let isUserPresent = this.state.selectedUsers.find(function (userInfo) {
        return userData.userId === userInfo.userId;
      });
      if (!isUserPresent) {
        isSubset = false;
        return;
      }
    }, this);
    return isSubset;
  };
  selectDesectAllUsers = (selectDeselectAcrosspages) => {
    if (selectDeselectAcrosspages) {
      this.setState(
        {
          allUsersSelected: true,
        },
        this.searchUsers.bind(null, 1, this.state.searchData)
      );
    } else {
      const getPopulatedArray = () => {
        let selectedUsers = this.state.selectedUsers,
          arrayRequiresDeselection =
            this.state.selectedUsers.length !== 0 &&
            this.isUserListSubsetOfSelectedUsers();
        JSON.parse(JSON.stringify(this.state.userList)).forEach((userData) => {
          // deepcopying and iterating over array
          let userIndex = 0;
          let isUserDisabled = this.props.userIdsToDisable.includes(
            userData.userId
          );
          let isUserPresent = selectedUsers.find(function (userInfo, index) {
            if (
              typeof userInfo === "object" &&
              userData.userId === userInfo.userId
            ) {
              userIndex = index;
              return userData.userId === userInfo.userId;
            } else if (userInfo === userData.userId) {
              userIndex = index;
              return userData.userId === userInfo;
            }
          });
          if (arrayRequiresDeselection) {
            if (isUserPresent) {
              selectedUsers.splice(userIndex, 1);
            }
          } else if (!isUserPresent && !isUserDisabled) {
            selectedUsers.push(userData);
          }
        });
        return selectedUsers;
      };
      this.setState(
        {
          selectedUsers: getPopulatedArray(),
        },
        function () {
          this.props.onRowChecked(this.state.selectedUsers);
        }
      );
    }
  };

  addRemoveUser = (userData) => {
    let index = -1,
      userIsPresent = false;
    let selectedUserList = [];
    if (!this.props.allowMultiSelect) {
      selectedUserList.push(userData);
    } else {
      this.state.selectedUsers.forEach(function (userInfo, i) {
        if (
          typeof userInfo === "object" &&
          userInfo.userId === userData.userId
        ) {
          index = i;
          userIsPresent = true;
        } else if (userInfo === userData.userId) {
          index = i;
          userIsPresent = true;
        }
      });
      selectedUserList = this.state.selectedUsers;
      if (userIsPresent) {
        selectedUserList.splice(index, 1);
      } else {
        selectedUserList.push(userData);
      }
    }

    this.setState(
      {
        selectedUsers: selectedUserList,
      },
      function () {
        this.props.onRowChecked(selectedUserList);
      }
    );
  };

  searchUsers = (pageIndex, searchData) => {
    let me = this;
    let params = JSON.parse(JSON.stringify(this.props.apiParams));
    if (this.props.apiType === APITYPES.POST) {
      params = Utils.extend(params, {
        fetchOnlyActiveUsers: this.props.fetchOnlyActiveUsers,
        fetchAllUsers: this.state.allUsersSelected,
        excludeSelectedUsers: this.props.excludeSelectedUsers,
        userIdsToExclude: this.props.userIdsToExclude,
        pagingInfo: {
          pageSize: this.state.resultPerPage,
        },
        sortByField: this.state.sortColumn,
        sortOrder: this.state.sortOrder,
        fetchUserWithValidEmailIds: this.props.toValidateEmailIds,
      });
      if (searchData) {
        params = Utils.extend(params, searchData);
      }
      if (this.props.extraQueryParams) {
        params = Utils.extend(params, this.props.extraQueryParams);
      }
      params.pagingInfo.pageNumber = pageIndex ? pageIndex : 1;
      if (this.props.moduleId) {
        params.moduleId = this.props.moduleId;
      }
      if (this.props.instructorBatchId) {
        params.instructorBatchId = this.props.instructorBatchId;
      }
    }
    if (!this.state.allUsersSelected) {
      this.setState({
        fetchingUserEntries: true,
      });
    }
    // if (this.props.apiUrl !== "") {
    //     apiUrl = Skilltron.app.AppHelper.getServerUrl(this.props.apiUrl);
    // } else {
    //     apiUrl = Skilltron.app.AppHelper.getServerUrl(this.state.allUsersSelected ? "api/user/searchAllUsers" : "api/user/searchUsers");
    // }
    Service.searchUsers(
      this.props.userFetchAPIUrl,
      this.props.apiType,
      this.props.accessToken,
      params
    ).then((result) => {
      let userDetails = result?.userDetails || [];
      if (this.state.allUsersSelected) {
        let userIds = result?.userDetails.map(function (userId) {
          return { userId: userId };
        });
        this.setState({
          selectedUsers: userIds,
          allUsersSelected: false,
        });
      } else {
        let userList = [];
        let defaultColumns = [];
        if (userDetails.length !== 0) {
          defaultColumns = [
            {
              fieldDisplayName: this.props.t("userSelectionWidget.userName"),
              fieldKey: "userDisplayName",
              renderer: (data) => {
                return `${data.userFirstName} ${data.userLastName}`;
              },
            },
            {
              fieldDisplayName: this.props.t("userSelectionWidget.userId"),
              fieldKey: "userName",
            },
            {
              fieldDisplayName:this.props.t("userSelectionWidget.email"),
              fieldKey: "email",
            },
            {
              fieldDisplayName: this.props.t("userSelectionWidget.createdOn"),
              fieldKey: "createdOn",
              ctrCls: "large-cell-column",
              renderer: function (data) {
                return moment(data.createdOn).format("MMM D, YYYY [at] h:mm A");
              },
            },
          ];

          if (this.props.allowSelect) {
            defaultColumns = [
              {
                fieldDisplayName: "",
                fieldKey: "",
                checkboxField: true,
                ctrCls: "checkbox-ctr",
                columnHeaderRenderer: () => {
                  return (
                    <Checkbox
                      disabled={!this.props.allowMultiSelect}
                      value={
                        this.state.selectedUsers.length !== 0 &&
                        this.isUserListSubsetOfSelectedUsers()
                      }
                      onChange={this.selectDesectAllUsers.bind(null, false)}
                    />
                  );
                },
                renderer: (data) => {
                  let isUserSelected = this.state.selectedUsers.find(
                    (userInfo) => {
                      if (userInfo.userId) {
                        return userInfo.userId === data.userId;
                      } else {
                        return userInfo === data.userId;
                      }
                    }
                  );
                  return (
                    <Checkbox
                      value={
                        isUserSelected || this.state.allUsersSelected
                          ? true
                          : false
                      }
                      onChange={this.addRemoveUser.bind(null, data)}
                    />
                  );
                },
              },
            ].concat(defaultColumns);
          }

          if (this.props.additionalColumns.length > 0) {
            defaultColumns = defaultColumns.concat(
              this.props.additionalColumns
            );
          }

          let userDefinedColumns = [];

          userDetails[0].userFields.forEach((field) => {
            userDefinedColumns.push({
              fieldDisplayName: field.fieldName,
              fieldKey: `udf_${field.fieldId}`,
              fieldId: field.fieldId,
            });
          });

          userDefinedColumns.sort((a, b) => {
            let x = a.fieldDisplayName.toLowerCase();
            let y = b.fieldDisplayName.toLowerCase();
            if (x < y) {
              return -1;
            }
            if (x > y) {
              return 1;
            }
            return 0;
          });
          defaultColumns = defaultColumns.concat(userDefinedColumns);
          userList = userDetails;
          userList.forEach((userInfo) => {
            userInfo.userFields.forEach((field, index) => {
              userInfo[`udf_${field.fieldId}`] = field.fieldValue;
            });
          });
        }

        this.setState(
          {
            columnData:
              userDetails.length === 0 ? this.state.columnData : defaultColumns,
            userList: userList,
            fetchingUserEntries: false,
            totalUserCount: result.totalUserCount,
            inactiveUserCount: result.inactiveUserCount,
            loadingState: UserSelectionWidget.VIEWSTATE.DATA,
          },
          () => {
            if (me.anyOptionsToRenderOutsideMenu()) {
              me.checkAndOptimallyRenderAdditionalOptions();
            }
          }
        );
      }
    });
  };

  showEmptyData() {
    return (
      <div className={`user-search-widget-ctr ${this.props.ctrCls}`}>
        {this.props.t("userSelectionWidget.emptyData")}
      </div>
    );
  }

  showFetchingMessage() {
    return (
      <div className={`user-search-widget-ctr ${this.props.ctrCls}`}>
        <div className="animated-spinner-2" />
        <div>{this.props.t("userSelectionWidget.fetching")}</div>
      </div>
    );
  }

  render() {
    let footCtr = (
      <Pagination
        ref={this.paginationComponentRef}
        ctrCls="page-container"
        onFetchCountChange={(value) => {
          this.setState({ resultPerPage: value }, () => {
            if (this.state.searchData !== null) {
              this.searchUsers(1, this.state.searchData);
            } else {
              this.searchUsers(1);
            }
          });
        }}
        showingRecordWithPageSizeLabel={
          this.props.showingRecordWithPageSizeLabel
        }
        onPageIndexChange={this.updatePageIndex}
        // isProcessing={this.state.fetchingUserEntries}
        rows={this.state.userList}
        totalCount={this.state.totalUserCount}
        pageSize={this.state.resultPerPage}
        currentPaginationIndex={this.state.currentPaginationIndex}
      />
    );

    let allowcatedOptions = [];
    this.state.additionalAllocatedOptions.forEach((item, index) => {
      allowcatedOptions.push(
        <AppButton
          key={index}
          buttonLabel={item.displayValue}
          buttonCls={"cta-button " + item.ctrCls}
          buttonIconCls={item.iconCls}
          disabled={this.state.selectedUsers.length === 0 && item.disableItem}
          clickHandler={item.onClick.bind(null, this.state.selectedUsers)}
        />
      );
    });
    let cls =
      this.state.additionalAllocatedOptions.length ===
      this.props.additionalOptions.length
        ? "allocated-all"
        : "";
    let renderAllowcatedOptions =
      allowcatedOptions.length > 0 ? (
        <div className={`additional-allocated-wrapper ${cls}`}>
          {allowcatedOptions}
        </div>
      ) : null;
    let renderUI = (
      <>
        <div className={"user-search-widget-ctr  v2 " + this.props.ctrCls}>
          <div
            className="heading-ctr full-width"
            ref={this.userSelectionHeaderRef}
          >
            <div className={"total-users"} ref={this.totalUsersDisplayLabelRef}>
              {this.props.showTotalCountAsHeading
                ? `Total ${this.state.totalUserCount || 0} Users`
                : this.props.windowHeading}
            </div>
            <div
              className={`user-search-control-wrapper col-lg-12 ${
                !this.anyOptionsToRenderOutsideMenu() ? "align-to-rightx" : ""
              }`}
              ref={this.userSearchFilterRef}
            >
              <UserSearchFilter
                onSearch={this.onSearch}
                getLimitedUserDefinedFieldsSummaryUrl={
                  this.props.limitedUserDefinedFieldsSummaryFetchAPIUrl
                }
                isSearchFilterAsButton={true}
                accessToken={this.props.accessToken}
                showAdvancedSearch={this.props.showAdvancedSearch}
                isRestrictedAdminUser={this.props.isRestrictedAdminUser}
                additionalUserFilters={this.props.additionalUserFilters}
                isTimePeriodFilterAllowed={this.props.isTimePeriodFilterAllowed}
                timePeriodFilterLabels={this.props.timePeriodFilterLabels}
                user={this.props.user}
                onToggleAdvanceSearch={() => {
                  this.setState({
                    showMoreOption: false,
                  });
                }}
              />
            </div>
            {renderAllowcatedOptions}
            <div className="header-buttons" ref={this.headerButtonsRef}>
              {this.displayMoreOptions()}
            </div>
          </div>
          <Scrollbars className="user-listing-ctr">
            {this.getUserListing()}
          </Scrollbars>
          {this.state.userList.length !== 0 ? footCtr : null}
          {this.getSelectAllUsersUI()}
          <div className={"button-container full-width text-center"}>
            <AppButton
              buttonLabel={this.props.t("common.close")}
              buttonCls="secondary-button cancel-btn"
              clickHandler={this.props.onCancel}
            />
            <AppButton
              disabled={this.state.selectedUsers.length === 0}
              buttonLabel={this.getProceedLabel()}
              clickHandler={this.saveSelectedUsers}
            />
            {this.props.additionalButtons}
          </div>
        </div>
      </>
    );

    return renderUI;
  }
  getProceedLabel = () => {
    return this.props.proceedButtonLabel;
  };
  saveSelectedUsers = () => {
    var selectedUsers = [];
    for (let i = 0; i < this.state.selectedUsers.length; i++) {
      let user = this.state.selectedUsers[i];
      if (typeof user === "object") {
        user.userFullName = user.userFirstName + " " + user.userLastName;
        selectedUsers.push(user);
      } else {
        selectedUsers.push(user);
      }
    }
    this.props.onProcessSelection(selectedUsers);
  };
  onSearch = (searchData) => {
    this.setState(
      {
        currentPaginationIndex: 1,
        totalUserCount: 0,
        searchData: searchData,
        fetchingUserEntries: true,
      },
      () => {
        this.searchUsers(1, searchData);
      }
    );
    this.paginationComponentRef.current?.onUpdatePageIndex(1);
  };
  getUserListing = () => {
    let renderUI = [this.getListingHead(), this.getListingRows()];
    return renderUI;
  };
  getListingHead = () => {
    let renderUI = (
      <div className="header-ctr">
        {this.state.columnData.map((columnData, index) => {
          let sortorder =
            this.state.sortOrder == SortOrder.ASC
              ? SortOrder.DESC
              : SortOrder.ASC;
          let ctrCls =
            this.state.sortColumn == columnData.fieldKey
              ? `sort-${this.state.sortOrder}`
              : "sort-asc-disabled";
          let isSortable =
            columnData.fieldKey !== "" &&
            (typeof columnData.sortable === "undefined" || columnData.sortable);
          let columnElement = (
            <div
              key={`header-cell-${index}`}
              className={`header-text cell ${columnData.ctrCls || ""} ${
                isSortable || columnData.checkboxField ? "" : "sort-disabled"
              }`}
              onClick={
                !isSortable
                  ? () => {}
                  : this.changeSortOrder.bind(this, columnData, sortorder)
              }
            >
              <div
                className={isSortable ? "sortable-header-text" : ""}
                title={columnData.fieldKey}
              >
                {columnData.columnHeaderRenderer
                  ? columnData.columnHeaderRenderer()
                  : columnData.fieldDisplayName}
              </div>
              {!isSortable ? null : (
                <div className="sortable-icon">
                  <AppIcon iconCls="icon-join" ctrCls={ctrCls} />
                </div>
              )}
            </div>
          );
          return columnElement;
        })}
      </div>
    );
    return renderUI;
  };
  getSelectAllUsersUI = () => {
    let msg;
    let allUsersSelected =
      this.state.totalUserCount === this.state.selectedUsers.length;
    let isOnlyCurrentPageSelected =
      this.state.userList.length === this.state.selectedUsers.length;
    if (allUsersSelected) {
      msg = `${this.props.t("common.all")} ${this.state.selectedUsers.length} ${this.props.t("userSelectionWidget.userSelectedMsg")}`;
    } else if (isOnlyCurrentPageSelected) {
      msg = `All ${this.state.selectedUsers.length} ${this.props.t("userSelectionWidget.currentPageUsersSelectedMsg")}`;
    } else {
      msg = `${this.state.selectedUsers.length} ${this.props.t("userSelectionWidget.userSelectedMsg")}`;
    }
    let selectedAllPopup = (
      <div className="all-selected-users-ctr selected-row">
        <span className="message-text">{msg}</span>
        <span className="clickable" onClick={this.clearSelectedUsers}>
          {this.props.t("userSelectionWidget.deselectMsg")}
        </span>
      </div>
    );

    if (
      this.state.selectedUsers.length === 0 ||
      this.state.totalUserCount === 0
    ) {
      return null;
    } else if (this.isUserListSubsetOfSelectedUsers() || allUsersSelected) {
      return selectedAllPopup;
    } else if (this.state.selectedUsers.length) {
      return selectedAllPopup;
    } else {
      return null;
    }
  };
  getListingRows = () => {
    // let currentPaginationData = this.state.userList.slice( ((this.state.currentPaginationIndex - 1) * this.props.resultPerPage) , (this.props.resultPerPage * this.state.currentPaginationIndex));
    // console.log(currentPaginationData ,((this.state.currentPaginationIndex - 1) * this.props.resultPerPage) , (this.props.resultPerPage * this.state.currentPaginationIndex))
    if (!this.state.fetchingUserEntries) {
      if (this.state.userList.length !== 0) {
        let rows = this.state.userList.map((userData) => {
          let cls = this.props.userIdsToDisable.includes(userData.userId)
            ? "disabled-row"
            : "";
          let selectableCls = !this.props.rowSelectable
            ? " not-selectable"
            : "";
          let allowSelect =
            !this.props.userIdsToDisable.includes(userData.userId) &&
            this.props.rowSelectable
              ? true
              : false;
          return (
            <div
              key={`row-${userData.userId}`}
              className={"listing-row " + cls + selectableCls}
              onClick={
                allowSelect
                  ? this.props.onRowSelection.bind(null, userData)
                  : () => {}
              }
            >
              {this.state.columnData.map((columnInfo, index) => {
                if (columnInfo.renderer) {
                  if (columnInfo.checkboxField) {
                    return (
                      <div
                        key={`chk-${index}`}
                        onClick={this.onCheckboxClick}
                        className={`cell ${
                          columnInfo.ctrCls ? columnInfo.ctrCls : ""
                        }`}
                      >
                        {columnInfo.renderer(userData)}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={`cell-${index}`}
                        className={`cell ${
                          columnInfo.ctrCls ? columnInfo.ctrCls : ""
                        }`}
                      >
                        {columnInfo.renderer(userData)
                          ? columnInfo.renderer(userData)
                          : "-"}
                      </div>
                    );
                  }
                } else {
                  return (
                    <div
                      key={`cell-${index}`}
                      className={`cell ${
                        columnInfo.ctrCls ? columnInfo.ctrCls : ""
                      }`}
                    >
                      {userData[columnInfo.fieldKey]
                        ? userData[columnInfo.fieldKey]
                        : "-"}
                    </div>
                  );
                }
              })}
            </div>
          );
        });

        let renderUI = <div className="rows-ctr">{rows}</div>;
        return renderUI;
      } else {
        return (
          <div className="rendering-rows-ctr">
            <div>{this.props.t("userSelectionWidget.noUserMatchMsg")}</div>
          </div>
        );
      }
    } else {
      let loadingUI = (
        <div className="rendering-rows-ctr">
          <div className="animated-spinner-2" />
          <div>{this.props.t("userSelectionWidget.fetching_n")}</div>
        </div>
      );
      return loadingUI;
    }
  };
  displayMoreOptions = () => {
    let optionsItems = this.checkAndOptimallyRenderMenuOptions();
    if (optionsItems.length > 0) {
      let me = this;
      let catchClickEvent = (e) => {
        e.stopPropagation();
      };
      let optionRenderer = (dropdownItem) => {
        let cls = dropdownItem.ctrCls || "";
        cls +=
          me.state.selectedUsers.length === 0 && dropdownItem.disableItem
            ? " disabled"
            : "";

        return (
          <div
            className={"user-context-item " + cls}
            onClick={() => {
              this.setState({
                showMoreOption: false,
              });
              dropdownItem?.onClick(dropdownItem);
            }}
          >
            <div className="item-text">{dropdownItem.displayValue}</div>
          </div>
        );
      };

      const optionsItemsUI = optionsItems.map((dropdownItem) =>
        optionRenderer(dropdownItem)
      );

      return (
        <div onClick={catchClickEvent} className="dot-icon">
          <AppIcon
            iconCls="icon-more"
            ctrCls="dot-icon-more"
            onClick={() => {
              this.setState({
                showMoreOption: !this.state.showMoreOption,
              });
            }}
          ></AppIcon>
          <div
            className={`more-option ${
              this.state.showMoreOption ? "more-option-show" : ""
            }`}
          >
            {optionsItemsUI}
          </div>
        </div>
      );
    }
  };
  changeSortOrder = (column, sortOrder) => {
    if (this.state.fetchingUserEntries) {
      return;
    }
    if (typeof column.sortable !== "undefined" && !column.sortable) {
      return;
    }
    this.setState(
      {
        sortOrder: sortOrder,
        sortColumn: column.fieldKey,
      },
      () => {
        if (this.state.searchData != null)
          this.searchUsers(
            this.state.currentPaginationIndex,
            this.state.searchData
          );
        else {
          this.searchUsers(this.state.currentPaginationIndex);
        }
      }
    );
  };
  clearSelectedUsers = () => {
    this.setState({
      allUsersSelected: false,
      selectedUsers: [],
    });
  };
  updatePageIndex = (index) => {
    // if caching is available. will be used in later iteration
    // let updatedPageEntriesOnState = this.state.userList.slice( ((this.state.currentPaginationIndex - 1) * this.props.resultPerPage) , (this.props.resultPerPage * this.state.currentPaginationIndex));

    this.setState({
      currentPaginationIndex: index,
    });
    if (this.state.searchData !== null) {
      this.searchUsers(index, this.state.searchData);
    } else {
      this.searchUsers(index);
    }
  };
}

UserSelectionWidget.propTypes = {
  /**
   * Specify page size no. of record to show
   */
  resultPerPage: PropTypes.number,
  /**
   * Specify header title to show on top
   */
  windowHeading: PropTypes.string,
  /**
   * Specify accessToken for the table list API token
   */
  accessToken: PropTypes.string,
  /**
   * Specify ctrCls for the Report widget class name
   */
  ctrCls: PropTypes.string,
  /**
   * If true fetch only active user records
   */
  fetchOnlyActiveUsers: PropTypes.bool,
  /**
   * Specify extra query param to send api call
   */
  extraQueryParams: PropTypes.object,
  /**
  * Specify user object 
  * eg:  user: {
   userName: "vasanth001",
   dbPointer: "dev"
 }
  */
  user: PropTypes.object,
  /**
   * Specify user ids to disable
   */
  userIdsToDisable: PropTypes.array,
  /**
   * Specify user ids to exclude
   */
  userIdsToExclude: PropTypes.array,
  /**
   * Specify moduleId params to sent api
   */
  moduleId: PropTypes.number,
  /**
   * Specify instructorBatchId for ILT Instructor selection
   */
  instructorBatchId: PropTypes.number,
  /**
   * Specify row is selectable or not
   */
  rowSelectable: PropTypes.bool,
  /**
   * Function callback on row is clicked
   */
  onRowSelection: PropTypes.func,
  /**
  * Specify additional options 
  * [{
       displayValue: 'Trigger welcome email',
       onClick: (c) => {
         console.log(c);
       }
     }]
  */
  additionalOptions: PropTypes.array,
  /**
   * Specify additional column
   */
  additionalColumns: PropTypes.array,
  /**
   * If true show total count in header title
   */
  showTotalCountAsHeading: PropTypes.bool,
  /**
   * Specify excludeSelectedUsers params to sent api
   */
  excludeSelectedUsers: PropTypes.bool,
  /**
   * Disable header checkbox
   */
  allowMultiSelect: PropTypes.bool,
  /**
   * Specify additionalUserFilters in advance search
   */
  additionalUserFilters: PropTypes.array,
  /**
   * Specify api url to fetch
   */
  userFetchAPIUrl: PropTypes.string,
  /**
   * Specify udf api url to show advance search
   */
  limitedUserDefinedFieldsSummaryFetchAPIUrl: PropTypes.string,
  /**
   * Specify api type
   */
  apiType: PropTypes.string,
  /**
   * Specify apiParams
   */
  apiParams: PropTypes.object,
  /**
   * Function callback on row is checked
   */
  onRowChecked: PropTypes.func,
  /**
   * Function callback on processSelection button is clicked
   */
  onProcessSelection: PropTypes.func,
  /**
   * Label for processSelection button
   */
  proceedButtonLabel: PropTypes.string,
  /**
   * Function callback on cancel button is clicked
   */
  onCancel: PropTypes.func,
  /**
   * Enable chekbox to select using checkbox for all rows
   */
  allowSelect: PropTypes.bool,
  /**
   * Specify apiParams  to check email validation
   */
  toValidateEmailIds: PropTypes.bool,
  /**
   * Enable advance search with date filter
   */
  isTimePeriodFilterAllowed: PropTypes.bool,
  /**
   * Enable advance search
   */
  showAdvancedSearch: PropTypes.bool,
  /**
   * Specify advance search with date filter lable
   */
  timePeriodFilterLabels: PropTypes.object,
};
UserSelectionWidget.defaultProps = {
  resultPerPage: 25,
  ctrCls: "",
  searchData: null, // added to check and send searchdata on pagination fetch
  windowHeading: "Select Users",
  proceedButtonLabel: "Proceed",
  extraQueryParams: null,
  selectedUsers: [],
  fetchOnlyActiveUsers: true,
  userIdsToDisable: [],
  userIdsToExclude: [],
  moduleId: 0,
  instructorBatchId: 0, // For ILT Instructor selection
  rowSelectable: false,
  onCancel: () => {},
  onProcessSelection: () => {},
  onRowSelection: () => {},
  onRowChecked: () => {},
  accessToken: null,
  additionalOptions: [],
  showTotalCountAsHeading: false,
  additionalColumns: [],
  excludeSelectedUsers: true,
  allowMultiSelect: true,
  additionalUserFilters: [],
  userFetchAPIUrl: "",
  apiType: APITYPES.POST,
  apiParams: {},
  allowSelect: true,
  toValidateEmailIds: false,
  isTimePeriodFilterAllowed: false,
  showAdvancedSearch: false,
  timePeriodFilterLabels: {},
  showingRecordWithPageSizeLabel: "",
};
UserSelectionWidget.VIEWSTATE = {
  LOADING: 1,
  DATA: 2,
};
export default withLocalizerContext(UserSelectionWidget);
