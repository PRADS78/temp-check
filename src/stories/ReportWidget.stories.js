// ReportWidget.stories.js
import AppButton from "../AppButton/AppButton";
import ColumnTypes from "../ColumnTypes";
import ReportWidget from "../ReportWidget/ReportWidget";
import { ReactComponent as AppIcon } from "./assets/AppIcons.svg";

export default {
  title: "Disprz/ReportWidget",
  component: ReportWidget,
  name: "ReportWidget",
  decorators: [
    (story) => {
      return (
        <>
          <AppIcon />
          {story()}
        </>
      );
    },
  ],
};
const Template = (args) => <ReportWidget {...args} />;

const user = {
  userName: "stagingvigneshs1",
  dbPointer: "stagingcorp",
};

const toDate = new Date();
const fromDate = new Date(toDate);
fromDate.setDate(toDate.getDate() - 91);
const to = toDate.toLocaleDateString();
const from = fromDate.toLocaleDateString();

const queryParam = {
  fromTimePeriod: from,
  toTimePeriod: to,
  offset: 0,
  fetchCount: 25,
  timezoneOffsetInMins: toDate.getTimezoneOffset(),
  includeTotalCount: true,
};

let columns = [
  {
    key: "key",
    name: "JIRA ID",
    sortable: true,
    cls: "half-string",
    type: ColumnTypes.STRING,
    isHighlight: true,
  },
  {
    key: "status",
    name: "Status",
    sortable: true,
    filterable: true,
    filterType: "list",
    options: [{ key: 1, label: "Inprogress" }, "Queued", "Completed"],
    cls: "half-string",
    type: ColumnTypes.STRING,
  },
  {
    key: "summary",
    name: "Summary",
    sortable: false,
    cls: "half-string",
    type: ColumnTypes.STRING,
    customRowTitle: (data) => {
      return (
        <div className={"title"}>
          <span className={"value"}>{data["summary"]}</span>
        </div>
      );
    },
    customHeaderTitle: () => {
      return (
        <div className={"title"}>
          <span className={"value"}>Summary</span>
        </div>
      );
    },
  },
  {
    key: "issueType",
    name: "Issue Type",
    sortable: true,
    cls: "half-string",
    type: ColumnTypes.STRING,
  },
  {
    key: "releaseMonth",
    name: "Release Month",
    cls: "half-string",
    sortable: true,
    type: ColumnTypes.DATE,
    isClickable: () => {
      console.log("isClickable");
      return true;
    },
    onClick: (info, data, e) => {
      console.log("onClick", e, data, info);
      e.preventDefault();
      e.stopPropagation();
      console.log("clicked");
    },
  },
];

export const Basic = Template.bind({});

Basic.args = {
  // ref="reportWidget",
  nonSelectable: false,
  ctrCls: "",
  queryParams: queryParam,
  searchable: false,
  identifierColumn: "keyId",
  searchPlaceholderText: "Search",
  showAdvancedSearch: true,
  analyticsColumns: columns,
  showTimeDurationFilter: true,
  defaultTimePeriodValue: "last quarter",
  allowExport: true,
  exportData: {
    downloadAnalyticsUrl:
      "https://disprzanalytics-staging.azurewebsites.net/api/analytics/downloadLearnerTimeSpentDetailedAnalytics",
  },
  isInternalDownloadProcess: true,
  accessToken:
    "8atMPFw5Azfs+n/olrTXzplZJkp8vIaSBgl2/+u6dBgCvDbjWPxGLsWmD3lyn8/kGKRHKVVLmmFn/D6y4lZa1RwV9Yj6ZKE/Dovmi92Nr8r1RSlfqJxwHBvk8nWiod7SaHe8/Paq2RrHCfVi1/uk9bq+KG8mIzGh+mKn7i+EYA5SmTZxQhLFigiyeW0WID/Krw31pjhJFuzRNbVdB61wYAkpGWnPrf3rPRzKDByhCcwXAauW+nmG6XuI432uxQeUXMl3Fyml2XwRJi5reozVC/5IGsHhTLWQoG+g+2+CMb0Pl240kIGgzlVLNXOpXdBPnq1NWbeMpC/cDsg32hNJxi6TQ1GktraKUBej3q9zhQo=",
  searchFilterLabel: "Filter",
  user: { user },
  limitedUserDefinedFieldsSummaryFetchAPIUrl:
    "https://disprzpipeline.disprz.com/demoservice/api/service/getFilteredData",
  url: "https://productrequest.azurewebsites.net/api/jira/getproductitems",
  editable: true,
  deletable: true,
  onEdit: (d) => {
    console.log({ d });
  },
  onDelete: (d) => {
    console.log({ d });
  },
  additionalButton: (
    <AppButton
      buttonLabel={"Sample"}
      type="primary"
      clickHandler={(e) => {
        console.log(e);
      }}
    ></AppButton>
  ),
  onFetchAllRecordsForSelection: (args, totalCount) => {
    const allItems = new Array(totalCount).fill(0).map((_, i) => i);
    return args(allItems);
  },
  canShowSelectAllRecordsButton: true,
  onKeyExtractor: (data, index, pageIndex, pageSize) => {
    return pageSize * (pageIndex - 1) + index;
  },
  multipleUsersLabel: (count) => {
    console.log(count);
    return `${count} users selected`;
  },
  singleUserLabel: (count) => {
    return `${count} is selected`;
  },
  allUsersSelectedSingularLabel: (count) => {
    return `All ${count} user selected`;
  },
  allUsersSelectedPluralLabel: (count) => {
    return `All ${count} selected`;
  },
  selectAllUsersLabel: (count) => {
    return `Select ${count} users`;
  },
  canToggleRowSelectionByRow: true,
  onRowClicked: (e, rowInfo) => {
    console.log("row clicked", e, rowInfo);
  },
  currentPaginationIndex: 1,
};
