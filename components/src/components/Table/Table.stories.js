import { useCallback, useEffect, useMemo, useState } from "react";
import { useArgs } from "@storybook/client-api";
import { Table } from ".";
import { Edit, Trash } from "@disprz/icons";
import { Title, ArgsTable } from "@storybook/addon-docs";
import {
  TableFilterTypes,
  TableExpansionType,
  TableLoadingOptions,
} from "../../Enums";
import { ButtonTypes } from "../../Enums";
import { getLimitedUserDefinedFieldsSummary } from "../../Service/Service";
import { UserDefinedField } from "../../Models/UserDefinedField";

const storyConfig = {
  title: "Disprz/DisprzTable",
  component: Table,
  parameters: {
    docs: {
      page: () => {
        return (
          <>
            <Title />
            <ArgsTable />
          </>
        );
      },
    },
  },
};

export default storyConfig;

const getDefaultFilters = (defaultFilters) => {
  return Object.entries(defaultFilters).map(([key, entries]) => {
    return {
      fieldName: key,
      value: Array.isArray(entries) ? entries : Object.keys(entries),
    };
  });
};

function Template(args) {
  // eslint-disable-next-line no-unused-vars
  const [_, updateArgs] = useArgs();

  const [offset, setOffset] = useState(args.pageOptions.offset);
  const [limit, setLimit] = useState(args.pageOptions.limit);
  const [totalCount, setTotalCount] = useState(-1);
  const [rows, setRows] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setOrderBy] = useState(null);
  const [searchText, setSearchText] = useState(args.searchOptions.value);
  const [debouncedSearchText, setDebouncedSearchText] = useState(
    args.searchOptions.value
  );
  const [isTruncated, setIsTruncated] = useState(false);
  const [filters, setFilters] = useState(
    [
      args.filterOptions?.columnFilters?.defaultFilters
        ? getDefaultFilters(args.filterOptions.columnFilters.defaultFilters)
        : [],
      args.filterOptions?.globalFilters?.defaultFilters
        ? getDefaultFilters(args.filterOptions.globalFilters.defaultFilters)
        : [],
    ].flat()
  );
  const [isUdfLoaded, setIsUdfLoaded] = useState(false);
  const [allFilterOptions, setAllFilterOptions] = useState({});
  const [loadingState, setLoadingState] = useState(TableLoadingOptions.LOADING);

  const templateStyle = {
    minWidth: "500px",
    height: "80vh",
    padding: "50px",
  };

  useEffect(() => {
    if (args.filterOptions.canEnableGlobalFilter) {
      const _globalFilter = {};
      setLoadingState(TableLoadingOptions.LOADING);
      fetch("https://storybookapi.disprz.com/tablefilters", {
        method: "GET",
      })
        .then((result) => result.json())
        .then((response) => {
          _globalFilter["bookingDate"] = {
            id: "bookingDate",
            label: "Booking Date",
            type: TableFilterTypes.DATE,
            isPinned: true,
            minDate: new Date(response.bookingDate[0]),
            maxDate: new Date(response.bookingDate[1]),
            onQuickActions: (actions) => {
              actions.splice(0, actions.length);
              const quickActionRange = {
                id: "last-24",
                label: "Last 24 hours",
                range: 0,
                onCustomRange: (callback) => {
                  const today = new Date();
                  const last24Hours = new Date();
                  last24Hours.setDate(today.getDate() - 1);
                  const dates = [last24Hours, today];
                  callback(dates);
                },
              };
              actions.push(quickActionRange);
            },
          };
          _globalFilter["favoriteNumber"] = {
            id: "favoriteNumber",
            label: "Favorite Number",
            type: TableFilterTypes.NUMBER,
            isPinned: true,
            min: response.favoriteNumber[0],
            max: response.favoriteNumber[1],
          };
          getLimitedUserDefinedFieldsSummary(
            "https://storybookapi.disprz.com/udfs/",
            ""
          ).then((response) => {
            const userDefinedFields = response
              ?.filter((userDefinedField) => {
                return (
                  userDefinedField.fieldType === "List" &&
                  userDefinedField.allowedValues.length > 0
                );
              })
              .map((udf) => {
                return new UserDefinedField(udf);
              });
            userDefinedFields.forEach((userDefinedField, index) => {
              _globalFilter[userDefinedField.fieldId] = {
                id: userDefinedField.fieldId,
                label: userDefinedField.fieldName,
                type: TableFilterTypes.LIST,
                options: userDefinedField.allowedValues.map((value) => {
                  return {
                    value: value.listItemId,
                    label: value.listItemValue,
                  };
                }),
                isPinned: index === 0,
                isMultiSelect: true,
              };
            });
            setAllFilterOptions({
              globalFilters: {
                items: _globalFilter,
                defaultFilters:
                  args.filterOptions.globalFilters?.defaultFilters,
              },
            });
            setIsUdfLoaded(true);
          });
        });
    }
  }, [
    args.filterOptions.canEnableGlobalFilter,
    args.filterOptions.globalFilters,
  ]);

  useEffect(() => {
    if (args.filterOptions.canEnableGlobalFilter && !isUdfLoaded) {
      return;
    }
    if (args.canSetTotalCount) {
      setLoadingState(TableLoadingOptions.LOADING);
      fetch("https://storybookapi.disprz.com/table", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit,
          offset,
          sortBy,
          sortOrder,
          searchText: debouncedSearchText,
          filters: filters,
        }),
      })
        .then((result) => {
          return result.json();
        })
        .then((jsonResult) => {
          const { users, total } = jsonResult;
          setRows(users);
          setTotalCount(total);
          if (total > 0) setLoadingState(TableLoadingOptions.LOADED);
          else setLoadingState(TableLoadingOptions.EMPTY);
          updateArgs({ totalRows: total });
        });
    } else {
      setLoadingState(TableLoadingOptions.LOADING);
      fetch("https://storybookapi.disprz.com/tableWithoutTotal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit,
          offset,
          sortBy,
          sortOrder,
          searchText: debouncedSearchText,
          filters: filters,
        }),
      })
        .then((result) => {
          return result.json();
        })
        .then((jsonResult) => {
          const { users } = jsonResult;
          if (users.length > 0) setLoadingState(TableLoadingOptions.LOADED);
          else setLoadingState(TableLoadingOptions.EMPTY);
          setRows(users);
          setIsTruncated(jsonResult.isTruncated);
        });
    }
  }, [
    args.canSetTotalCount,
    debouncedSearchText,
    offset,
    sortBy,
    sortOrder,
    limit,
    updateArgs,
    filters,
    args.filterOptions.canEnableGlobalFilter,
    isUdfLoaded,
  ]);

  const onNext = useCallback(
    ({ prevLimit }) => setOffset((prevCount) => prevCount + prevLimit),
    []
  );

  const onPrevious = useCallback(
    ({ prevLimit }) => setOffset((prevCount) => prevCount - prevLimit),
    []
  );

  const onSizeChange = ({ selectedSize }) => {
    setLimit(selectedSize);
    setOffset(0);
  };

  const onSet = useCallback(
    ({ selectedPage }) => {
      setOffset(limit * (selectedPage - 1));
    },
    [limit]
  );

  const pagination = useMemo(() => {
    return {
      offset,
      limit,
      onNext: args.pageOptions.onNext ?? onNext,
      onPrevious: args.pageOptions.onPrevious ?? onPrevious,
      onSizeChange: args.pageOptions.onSizeChange ?? onSizeChange,
      onSet: args.pageOptions.onSet ?? onSet,
      sizeItems: args.pageOptions.sizeItems ?? null,
      sizeMultiplier: args.pageOptions.sizeMultiplier ?? 10,
      noOfSizeItems: args.pageOptions.noOfSizeItems ?? 4,
    };
  }, [
    offset,
    limit,
    args.pageOptions.onNext,
    args.pageOptions.onPrevious,
    args.pageOptions.onSizeChange,
    args.pageOptions.onSet,
    args.pageOptions.sizeItems,
    args.pageOptions.sizeMultiplier,
    args.pageOptions.noOfSizeItems,
    onNext,
    onPrevious,
    onSet,
  ]);

  const onSortChange = ({ sortBy, sortOrder }) => {
    setSortBy(sortBy);
    setOrderBy(sortOrder);
  };

  const sortOptions = useMemo(() => {
    return {
      by: args.sortOptions.by ?? sortBy,
      order: args.sortOptions.order ?? sortOrder,
      onChange: args.sortOptions.onChange ?? onSortChange,
    };
  }, [
    args.sortOptions.by,
    args.sortOptions.onChange,
    args.sortOptions.order,
    sortBy,
    sortOrder,
  ]);

  const onSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const onSearchSubmit = useCallback((e) => {
    setSearchText(e.target.value);
    setDebouncedSearchText(e.target.value);
    setOffset(0);
  }, []);

  const onSearchClear = useCallback(() => {
    setDebouncedSearchText("");
    setSearchText("");
  }, []);

  const onSearchTextChangeDebounced = useCallback((e) => {
    setDebouncedSearchText(e.target.value);
  }, []);

  const searchOptions = useMemo(() => {
    return {
      value: searchText,
      onChange: args.searchOptions.onChange ?? onSearchTextChange,
      onSearch: args.searchOptions.onSearch ?? onSearchSubmit,
      onClear: args.searchOptions.onClear ?? onSearchClear,
      placeholder: args.searchOptions.placeholder ?? "Search...",
      onChangeDebounced:
        args.searchOptions.onSearchTextChangeDebounced ??
        onSearchTextChangeDebounced,
      debounceDelay: 1000,
      canShowSearch: args.searchOptions.canShowSearch ?? false,
    };
  }, [
    args.searchOptions.canShowSearch,
    args.searchOptions.onChange,
    args.searchOptions.onClear,
    args.searchOptions.onSearch,
    args.searchOptions.onSearchTextChangeDebounced,
    args.searchOptions.placeholder,
    onSearchClear,
    onSearchSubmit,
    onSearchTextChangeDebounced,
    searchText,
  ]);

  const expandOptions = useMemo(() => {
    return {
      onRenderer:
        args.expandOptions.onRenderer ?? args.expandOptions.onRenderer,
      canExpandRow:
        args.expandOptions.canExpandRow ?? args.expandOptions.canExpandRow,
      onChange: args.expandOptions.onChange ?? args.expandOptions.onChange,
      enableExpanding: args.expandOptions.enableExpanding ?? false,
      type: args.expandOptions.type ?? TableExpansionType.NON_COHESIVE,
    };
  }, [
    args.expandOptions.onRenderer,
    args.expandOptions.canExpandRow,
    args.expandOptions.onChange,
    args.expandOptions.enableExpanding,
    args.expandOptions.type,
  ]);

  // eslint-disable-next-line no-unused-vars
  const onRowSelect = (args) => {
    // console.log("Row selection props are ", args);
  };

  const onRowIdExtractor = ({ row }) => {
    return row.userName;
  };

  const onSelectAllPageRows = () => {
    return fetch(`https://storybookapi.disprz.com/table/usernames`)
      .then((result) => {
        return result.json();
      })
      .then((jsonResult) => {
        return jsonResult;
      });
  };

  const selectOptions = useMemo(() => {
    return {
      canEnableRowSelection: args.selectOptions.canEnableRowSelection ?? false,
      canEnableMultiRowSelection:
        args.selectOptions.canEnableMultiRowSelection ?? false,
      onRowSelect: args.selectOptions.onRowSelect ?? onRowSelect,
      onRowIdExtractor: args.selectOptions.onRowIdExtractor ?? onRowIdExtractor,
      canSelectByClickingFullRow:
        args.selectOptions.canSelectByClickingFullRow ?? true,
      onSelectAllPageRows:
        args.selectOptions.onSelectAllPageRows ?? onSelectAllPageRows,
      canEnableAllPageRowsSelection:
        args.selectOptions.canEnableAllPageRowsSelection ?? false,
      actions: args.selectOptions.actions ?? [],
      singularSelectedLabel: args.selectOptions.singularSelectedLabel ?? "",
      pluralSelectedLabel: args.selectOptions.pluralSelectedLabel ?? "",
      maxCapForSelectAll: args.selectOptions.maxCapForSelectAll ?? undefined,
      noOfSelectActionsToShowUpFront:
        args.selectOptions.noOfSelectActionsToShowUpFront ?? 4,
      defaultSelectedRowIds: args.selectOptions.defaultSelectedRowIds ?? [],
      defaultSelectedRows: args.selectOptions.defaultSelectedRows ?? [],
    };
  }, [
    args.selectOptions.canEnableRowSelection,
    args.selectOptions.canEnableMultiRowSelection,
    args.selectOptions.onRowSelect,
    args.selectOptions.onRowIdExtractor,
    args.selectOptions.canSelectByClickingFullRow,
    args.selectOptions.onSelectAllPageRows,
    args.selectOptions.canEnableAllPageRowsSelection,
    args.selectOptions.actions,
    args.selectOptions.singularSelectedLabel,
    args.selectOptions.pluralSelectedLabel,
    args.selectOptions.maxCapForSelectAll,
    args.selectOptions.noOfSelectActionsToShowUpFront,
    args.selectOptions.defaultSelectedRows,
    args.selectOptions.defaultSelectedRowIds,
  ]);

  const actions = useMemo(() => {
    return args.actions ?? [];
  }, [args.actions]);

  const filterOptions = useMemo(() => {
    return {
      onApply:
        args.filterOptions.onApply ??
        function onApply({ columnFilters = {}, globalFilters = {} }) {
          const _columnFilters = Object.entries(columnFilters).map(
            ([key, value]) => ({
              fieldName: key,
              value: Array.isArray(value) ? value : Object.keys(value),
            })
          );
          const _globalFilters = Object.entries(globalFilters).map(
            ([key, value]) => ({
              fieldName: key,
              value: Array.isArray(value) ? value : Object.keys(value),
            })
          );
          const allFilters = [..._columnFilters, ..._globalFilters];
          setFilters(allFilters);
        },
      columnFilters: args.filterOptions.columnFilters ?? {},
      globalFilters: {
        items: allFilterOptions.globalFilters?.items ?? {},
        defaultFilters: args.filterOptions.globalFilters?.defaultFilters ?? {},
      },
      canEnableFilter: args.filterOptions.canEnableFilter ?? false,
      canEnableColumnFilter: args.filterOptions.canEnableColumnFilter ?? false,
      canEnableGlobalFilter: args.filterOptions.canEnableGlobalFilter ?? false,
    };
  }, [
    allFilterOptions.globalFilters?.items,
    args.filterOptions.canEnableColumnFilter,
    args.filterOptions.canEnableFilter,
    args.filterOptions.canEnableGlobalFilter,
    args.filterOptions.columnFilters,
    args.filterOptions.globalFilters,
    args.filterOptions.onApply,
  ]);

  return (
    <div data-testid="table-container" style={templateStyle}>
      <Table
        {...args}
        pageOptions={pagination}
        totalRows={totalCount}
        isEndOfList={isTruncated}
        rows={rows}
        sortOptions={sortOptions}
        searchOptions={searchOptions}
        expandOptions={expandOptions}
        selectOptions={selectOptions}
        actions={actions}
        title={args.title}
        uniqueId={1667545108367}
        isRowClickable={args.isRowClickable}
        onRowClick={args.onRowClick}
        filterOptions={filterOptions}
        loadingState={loadingState}
      />
    </div>
  );
}

export const Standard = Template.bind({});
Standard.args = {
  columns: [
    {
      canShowAvatar: true,
      id: "name",
      key: (row) => `${row.firstName} ${row.lastName}`,
      title: "Name",
      ctrCls: "name",
      imageUrl: ({ row }) => {
        return row.imageUrl;
      },
    },
    {
      key: "username",
      title: "Username",
      isSortable: true,
    },
    {
      key: "email",
      title: "Email",
    },
    { key: "gender", title: "Gender", isSortable: true },
    {
      key: "age",
      title: "Age",
      isSortable: false,
      onRenderer: ({ row }) => {
        return <b>{row.age}</b>;
      },
    },
  ],
  pageOptions: {
    offset: 0,
    limit: 10,
  },
  sortOptions: {
    by: null,
    order: null,
    onChange: null,
  },
  searchOptions: {
    value: "",
    canShowSearch: false,
  },
  selectOptions: {
    canEnableRowSelection: false,
    canEnableMultiRowSelection: false,
    onRowIdExtractor: "username",
    maxCapForSelectAll: 500,
  },
  canSetTotalCount: true,
  title: "List of Users",
  filterOptions: {},
  expandOptions: {},
};

export const WithSearch = Template.bind({});
WithSearch.args = {
  ...Standard.args,
  searchOptions: {
    canShowSearch: true,
    value: "",
    placeholder: "Search by user name",
  },
  selectOptions: {
    canEnableRowSelection: false,
    canEnableMultiRowSelection: false,
    onRowIdExtractor: "username",
  },
};

export const RowSelectionMulti = Template.bind({});
RowSelectionMulti.args = {
  ...WithSearch.args,
  searchOptions: {
    canShowSearch: true,
    value: "",
    placeholder: "Search by user name",
  },
  selectOptions: {
    canEnableRowSelection: true,
    canEnableMultiRowSelection: true,
    onRowIdExtractor: "username",
    canEnableAllPageRowsSelection: true,
    singularSelectedLabel: "User",
    pluralSelectedLabel: "Users",
    maxCapForSelectAll: 500,
    actions: [
      {
        label: "Edit User",
        icon: () => {
          return <Edit className="fill" canRenderOnlyIcon />;
        },
        value: 0,
        onClick: () => {},
      },
      {
        label: "Delete User",
        value: 1,
        onClick: () => {},
        icon: () => {
          return <Trash className="fill" canRenderOnlyIcon />;
        },
      },
      {
        label: "Make Active",
        value: 2,
        onClick: () => {},
      },
      {
        label: "Make Inactive",
        value: 3,
        onClick: () => {},
      },
      {
        label: "Send email",
        value: 4,
        onClick: () => {},
      },
    ],
  },
};

export const DefaultRowSelection = Template.bind({});
DefaultRowSelection.args = {
  ...RowSelectionMulti.args,
  selectOptions: {
    ...RowSelectionMulti.args.selectOptions,
    onRowIdExtractor: ({ index }) => {
      return index;
    },
    defaultSelectedRowIds: [1, 2],
    defaultSelectedRows: [],
  },
};

export const DisableSpecificRowSelection = Template.bind({});
DisableSpecificRowSelection.args = {
  ...RowSelectionMulti.args,
  selectOptions: {
    ...RowSelectionMulti.args.selectOptions,
    onRowIdExtractor: ({ index }) => {
      return index;
    },
    canEnableRowSelection: ({ index }) => index !== 1,
  },
};

export const RowSelectionSingle = Template.bind({});
RowSelectionSingle.args = {
  ...Standard.args,
  selectOptions: {
    canEnableRowSelection: true,
    canEnableMultiRowSelection: false,
    onRowIdExtractor: "username",
    actions: [
      {
        label: "Send Notification",
        value: 0,
        onClick: () => {},
      },
    ],
  },
};

export const SelectOnlyViaCheckIcon = Template.bind({});
SelectOnlyViaCheckIcon.args = {
  ...WithSearch.args,
  selectOptions: {
    canEnableRowSelection: true,
    canEnableMultiRowSelection: false,
    onRowIdExtractor: "username",
    canSelectByClickingFullRow: false,
  },
};

export const WithoutTotalCount = Template.bind({});
WithoutTotalCount.args = {
  ...RowSelectionMulti.args,
  canSetTotalCount: false,
};

export const WithTableActions = Template.bind({});
WithTableActions.args = {
  ...RowSelectionMulti.args,
  canSetTotalCount: true,
  actions: [
    {
      label: "Edit User",
      icon: () => {
        return <Edit className="fill" canRenderOnlyIcon />;
      },
      value: 0,
      onClick: () => {},
    },
    {
      label: "Add New",
      value: 1,
      onClick: () => {},
    },
  ],
};

export const WithoutTitleWithSearch = Template.bind({});
WithoutTitleWithSearch.args = {
  ...WithSearch.args,
  title: "",
};

export const ColumnClickable = Template.bind({});
ColumnClickable.args = {
  ...Standard.args,
  title: "",
  columns: [
    {
      canShowAvatar: true,
      id: "name",
      key: (row) => `${row.firstName} ${row.lastName}`,
      title: "Name",
      ctrCls: "name",
    },
    {
      key: "username",
      title: "Username",
      isSortable: true,
      isClickable: ({ index }) => {
        return index % 2 === 0;
      },
      onClick: (_, { row }) => {
        console.log("The column is clicked", row);
      },
    },
    {
      key: "email",
      title: "Email",
      isClickable: true,
      onClick: () => {
        console.log("The column is clicked");
      },
    },
    { key: "gender", title: "Gender", isSortable: true },
    {
      key: "age",
      title: "Age",
      isSortable: false,
      onRenderer: ({ row }) => {
        return <b>{row.age}</b>;
      },
    },
  ],
};

export const RowClickable = Template.bind({});
RowClickable.args = {
  ...Standard.args,
  isRowClickable: true,
  onRowClick: (_, { row }) => {
    console.log("The row is clicked", row);
  },
};

export const RowExpandable = Template.bind({});

RowExpandable.args = {
  ...Standard.args,
  expandOptions: {
    enableExpanding: true,
    onRenderer: ({ row }) => {
      const subColumns = [
        {
          id: "proficiencyLevel",
          key: "proficiencyLevel",
          title: "Proficiency Level",
          ctrCls: "",
          width: "150px",
        },
        {
          key: "assessmentType",
          title: "Assessment Type",
          ctrCls: "",
        },
        {
          key: "assessmenturl",
          title: "Assessment URL",
          ctrCls: "",
        },
      ];
      const subRows = [
        {
          proficiencyLevel: "Level1",
          assessmentType: "Type",
          assessmenturl: "URL",
        },
      ];
      return (
        <table
          style={{
            background: "#f0f0f0",
            borderRadius: "4px",
            borderCollapse: "initial",
            marginBottom: 0,
            padding: "20px",
          }}
          key={row.name}
        >
          <tr style={{ paddingLeft: 0 }}>
            {subColumns.map((header) => {
              return (
                <th
                  key={header.key}
                  className={header.ctrCls}
                  style={{ minWidth: header.width, width: header.width }}
                >
                  {header.title}
                </th>
              );
            })}
          </tr>
          {subRows.map((innerrow, index) => {
            return (
              <tr style={{ paddingLeft: 0 }} key={index}>
                {subColumns.map((header, index) => {
                  if (typeof header.onRenderer === "function") {
                    return (
                      <td style={{ paddingLeft: 0 }} key={index}>
                        {header.onRenderer({
                          subRow: innerrow,
                          currentRow: row,
                        })}
                      </td>
                    );
                  }
                  return (
                    <td
                      style={{
                        minWidth: header.width,
                        width: header.width,
                        paddingLeft: 0,
                      }}
                      key={index}
                    >
                      {innerrow[header.key]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </table>
      );
    },
    canExpandRow: ({ row }) => {
      console.log(row);
      return true;
    },
    type: TableExpansionType.NON_COHESIVE,
    onChange: ({ expandedRowIds, expandedRows }) => {
      console.log(expandedRowIds, expandedRows);
    },
  },
};

export const ConditionalTableSelectActions = Template.bind();
ConditionalTableSelectActions.args = {
  ...RowSelectionMulti.args,
  selectOptions: {
    ...RowSelectionMulti.args.selectOptions,
    actions: [
      {
        label: "Male only Option",
        value: 0,
        onClick: () => {},
        canShow: ({ selectedRows }) => {
          return selectedRows.every((row) => row.gender === "male");
        },
      },
      {
        label: "Hidden option",
        value: 1,
        onClick: () => {},
        icon: () => {
          return <Trash className="fill" canRenderOnlyIcon />;
        },
        canShow: false,
      },
      {
        label: "Make Active",
        value: 2,
        onClick: () => {},
      },
      {
        label: "Make Inactive",
        value: 3,
        onClick: () => {},
      },
      {
        label: "Send email",
        value: 4,
        onClick: () => {},
      },
    ],
  },
};

export const TableSelectActionAsDropdownButton = Template.bind({});
TableSelectActionAsDropdownButton.args = {
  ...RowSelectionMulti.args,
  selectOptions: {
    ...RowSelectionMulti.args.selectOptions,
    actions: [
      {
        label: "Change Evaluator",
        value: 0,
        onClick: () => {},
        type: ButtonTypes.DROP_DOWN,
        menuItems: [
          {
            id: 1,
            label: "Reporting Manager",
          },
          {
            id: 2,
            label: "Buddy",
          },
          {
            id: 3,
            label: "Specific People",
          },
        ],
        onMenuItemClick: () => {},
      },
    ],
  },
};

export const TableWithFilter = Template.bind({});
TableWithFilter.args = {
  ...Standard.args,
  columns: [
    {
      canShowAvatar: true,
      id: "name",
      key: (row) => `${row.firstName} ${row.lastName}`,
      title: "Name",
      ctrCls: "name",
      isFilterable: false,
    },
    {
      key: "username",
      title: "Username",
      isSortable: true,
    },
    {
      key: "email",
      title: "Email",
    },
    { key: "gender", title: "Gender", isSortable: true, isFilterable: true },
    {
      id: "joiningDate",
      title: "Joining Date",
      isSortable: true,
      isFilterable: true,
      key: (row) =>
        `${new Date(row.joiningDate).toLocaleDateString("en-us", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}`,
    },
    {
      id: "age",
      title: "Age",
      isSortable: true,
      isFilterable: true,
      key: (row) => {
        return new Date().getFullYear() - new Date(row.age).getFullYear();
      },
    },
  ],
  filterOptions: {
    onApply: undefined,
    canEnableFilter: true,
    canEnableGlobalFilter: false,
    canEnableColumnFilter: true,
    columnFilters: {
      items: {
        gender: {
          type: TableFilterTypes.LIST,
          isMultiSelect: false,
          options: [
            {
              label: "Male",
              value: "male",
            },
            {
              label: "Female",
              value: "female",
            },
          ],
        },
        joiningDate: {
          type: TableFilterTypes.DATE,
          minDate: new Date("2022-10-01"),
          maxDate: new Date("2023-12-31"),
        },
        age: {
          type: TableFilterTypes.NUMBER,
          min: 0,
          max: 100,
        },
      },
      defaultFilters: {},
    },
    globalFilters: {},
  },
};

export const TableWithFilterPreApplied = Template.bind({});
TableWithFilterPreApplied.args = {
  ...TableWithFilter.args,
  filterOptions: {
    ...TableWithFilter.args.filterOptions,
    columnFilters: {
      ...TableWithFilter.args.filterOptions.columnFilters,
      defaultFilters: {
        gender: {
          female: true,
        },
        joiningDate: [new Date("2020-11-01"), new Date("2020-12-31")],
        age: [20, 30],
      },
    },
  },
};

export const TableWithGlobalFilters = Template.bind({});
TableWithGlobalFilters.args = {
  ...TableWithFilter.args,
  filterOptions: {
    canEnableFilter: true,
    canEnableGlobalFilter: true,
    canEnableColumnFilter: true,
    columnFilters: {
      items: {
        gender: {
          id: "gender",
          type: TableFilterTypes.LIST,
          isMultiSelect: false,
          options: [
            {
              label: "Male",
              value: "male",
            },
            {
              label: "Female",
              value: "female",
            },
          ],
        },
        joiningDate: {
          id: "joiningDate",
          type: TableFilterTypes.DATE,
          minDate: new Date("2022-10-01"),
          maxDate: new Date("2023-12-31"),
        },
        age: {
          id: "age",
          type: TableFilterTypes.NUMBER,
          min: 0,
          max: 100,
        },
      },
      defaultFilters: {},
    },
    // The below object is for testing purposes only. Actual UDF is fetched from API
    globalFilters: {
      items: {
        1: {
          id: 1,
          label: "Location",
          type: TableFilterTypes.LIST,
          isPinned: true,
          isMultiSelect: true,
          options: [
            {
              label: "Chennai",
              value: "chennai",
            },
            {
              label: "Mumbai",
              value: "mumbai",
            },
            {
              label: "Bangalore",
              value: "bangalore",
            },
            {
              label: "Hyderabad",
              value: "hyderabad",
            },
            {
              label: "Pune",
              value: "pune",
            },
            {
              label: "Delhi",
              value: "delhi",
            },
            {
              label: "Kolkata",
              value: "kolkata",
            },
            {
              label: "Ahmedabad",
              value: "ahmedabad",
            },
          ],
        },
        2: {
          id: 2,
          label: "Department",
          type: TableFilterTypes.LIST,
          isPinned: false,
          isMultiSelect: true,
          options: [
            {
              label: "CSE",
              value: "cse",
            },
            {
              label: "ECE",
              value: "ece",
            },
            {
              label: "EEE",
              value: "eee",
            },
            {
              label: "MECH",
              value: "mech",
            },
            {
              label: "CIVIL",
              value: "civil",
            },
            {
              label: "IT",
              value: "it",
            },
            {
              label: "AERO",
              value: "aero",
            },
            {
              label: "CHEM",
              value: "chem",
            },
            {
              label: "MBA",
              value: "mba",
            },
          ],
        },
        3: {
          id: 3,
          label: "Designation",
          type: TableFilterTypes.LIST,
          isPinned: false,
          isMultiSelect: true,
          options: [
            {
              label: "Manager",
              value: "manager",
            },
            {
              label: "Senior Manager",
              value: "seniormanager",
            },
            {
              label: "Team Lead",
              value: "teamlead",
            },
            {
              label: "Senior Team Lead",
              value: "seniorteamlead",
            },
            {
              label: "Associate",
              value: "associate",
            },
            {
              label: "Senior Associate",
              value: "seniorassociate",
            },
            {
              label: "Analyst",
              value: "analyst",
            },
            {
              label: "Senior Analyst",
              value: "senioranalyst",
            },
          ],
        },
      },
      defaultFilters: {},
    },
  },
};

export const TableWithPreAppliedGlobalFilters = Template.bind({});
TableWithPreAppliedGlobalFilters.args = {
  ...TableWithGlobalFilters.args,
  filterOptions: {
    ...TableWithGlobalFilters.args.filterOptions,
    globalFilters: {
      ...TableWithGlobalFilters.args.filterOptions.globalFilters,
      defaultFilters: {
        1: {
          101: true,
        },
        favoriteNumber: [20, 30],
      },
    },
  },
};

export const EmptyRowMessage = Template.bind({});
EmptyRowMessage.args = {
  ...TableWithFilter.args,
  searchOptions: {
    canShowSearch: true,
    value: "test value",
    placeholder: "Search by user name",
  },
  emptyOptions: {
    message: "No results found!",
    actionText: "Clear All",
    onAction: () => {},
    canShowAction: true,
  },
};

export const ConfigureEmptyRowMessage = Template.bind({});
ConfigureEmptyRowMessage.args = {
  ...EmptyRowMessage.args,
  emptyOptions: {
    onRenderer: ({ filter, searchOptions }) => {
      console.log(filter, searchOptions);
      return <div>No rows Found!</div>;
    },
  },
};
