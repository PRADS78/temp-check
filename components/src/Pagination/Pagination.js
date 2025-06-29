import { Component } from "react";
import ReactDOM from "react-dom";
import "./Pagination.scss";
import DropDown from "../DropDown/DropDown";
import AppButton from "../AppButton/AppButton";

class Pagination extends Component {
  countLists = [
    { label: 10, value: 10 },
    { label: 15, value: 15 },
    { label: 20, value: 20 },
    { label: 25, value: 25 },
  ];

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      loadedRecordsCount: this.props.pageSize,
      currentPaginationIndex: this.props.currentPaginationIndex,
    });
  }

  updatePageIndex = (index) => {
    if (
      !this.isProcessing &&
      1 <= index &&
      index <= Math.ceil(this.props.totalCount / this.props.pageSize)
    ) {
      this.setState({
        currentPaginationIndex: index,
      });
      this.props.onPageIndexChange(index);
    }
  };

  /**
   * This is used an imperative methods to update only the pagination index without
   * calling the onPageIndexChange callback.
   * @param {pageIndex} index
   */
  onUpdatePageIndex = (index) => {
    if (
      !this.isProcessing &&
      1 <= index &&
      index <= Math.ceil(this.props.totalCount / this.props.pageSize)
    ) {
      this.setState({
        currentPaginationIndex: index,
      });
    }
  };

  getPaginationIndex = () => {
    if (this.props.isProcessing) {
      return;
    }
    let pageCount = Math.ceil(this.props.totalCount / this.props.pageSize);
    let paginatorIndices = [];

    if (pageCount < 10) {
      for (let x = 1; x <= pageCount; x++) {
        paginatorIndices.push(
          <div
            onClick={this.updatePageIndex.bind(null, x)}
            className={`paginator-cell ${
              this.state.currentPaginationIndex === x ? "active" : ""
            }`}
            key={`paginator-cell-${x}`}
          >
            {x}
          </div>
        );
      }
    } else {
      for (let x = 1; x <= pageCount; x++) {
        let paginationCell = (
          <div
            onClick={this.updatePageIndex.bind(null, x)}
            className={`paginator-cell ${
              this.state.currentPaginationIndex === x ? "active" : ""
            }`}
            key={`paginator-cell-${x}`}
          >
            {x}
          </div>
        );
        if (
          x < 4 ||
          x > pageCount - 3 ||
          x === this.state.currentPaginationIndex - 1 ||
          x === this.state.currentPaginationIndex + 1
        ) {
          paginatorIndices.push(paginationCell);
        } else if (x === 4 || x === pageCount - 3) {
          if (x === this.state.currentPaginationIndex) {
            paginatorIndices.push(paginationCell);
          } else {
            paginatorIndices.push(
              <div
                className={`${
                  this.state.currentPaginationIndex > 4 &&
                  this.state.currentPaginationIndex < pageCount - 3
                    ? "pagination-minimize"
                    : ""
                }`}
                key={`paginator-cell-${x}`}
              >
                {"..."}
              </div>
            );
          }
        } else if (x >= 4 && x === this.state.currentPaginationIndex) {
          paginatorIndices.push(paginationCell);
        }
      }
    }

    const pageCountLists = [...Array(pageCount).keys()].map((value) => ({
      label: value + 1,
      value: value + 1,
    }));

    let renderUI = (
      <div className="paginator-ctr">
        {/* {paginatorIndices} */}
        <div className="paginator-ctr-block">
          <DropDown
            items={pageCountLists}
            onSelect={({ value }) => this.updatePageIndex(value)}
            value={pageCountLists.find(
              ({ value }) => this.state.currentPaginationIndex === value
            )}
            ctrCls="drop-up"
          />
          <p>of {pageCount} pages</p>
        </div>
        <div className="paginator-button-block">
          <AppButton
            ctrCls="icon-prev"
            buttonIconCls={
              this.state.currentPaginationIndex <= 1
                ? "icon-next-disabled"
                : "icon-next"
            }
            clickHandler={this.updatePageIndex.bind(
              null,
              this.state.currentPaginationIndex - 1
            )}
            buttonLabel={""}
            disabled={this.state.currentPaginationIndex <= 1}
          />
        </div>
        <div className="paginator-button-block">
          <AppButton
            ctrCls="icon-next"
            buttonIconCls={
              this.state.currentPaginationIndex >= pageCount
                ? "icon-next-disabled"
                : "icon-next"
            }
            clickHandler={this.updatePageIndex.bind(
              null,
              this.state.currentPaginationIndex + 1
            )}
            buttonLabel={""}
            disabled={this.state.currentPaginationIndex >= pageCount}
          />
        </div>
      </div>
    );

    return pageCount === 1 || this.props.rows.length === 0 ? null : renderUI;
  };

  render() {
    return (
      <div className={`numbered-pagination-ctr ${this.props.ctrCls}`}>
        <div className="pagination-count-ctr">
          <div className="pagination-items-select">
            <span>{this.props.itemsPerPageText} </span>
            <DropDown
              items={this.countLists}
              onSelect={({ value }) => {
                this.setState({
                  loadedRecordsCount: value,
                  currentPaginationIndex: 1,
                });
                this.props.onFetchCountChange(value);
              }}
              value={this.countLists.find(
                ({ value }) => this.state.loadedRecordsCount === value
              )}
              ctrCls="drop-up"
            />
          </div>
          <div>
            {this.props.showingRecordWithPageSizeLabel ||
              ` ${
                this.props.pageSize * (this.props.currentPaginationIndex - 1) +
                1
              } - ${
                this.props.pageSize * (this.props.currentPaginationIndex - 1) +
                this.props.rows.length
              } of ${this.props.totalCount} ${this.props.pageSizeText}`}{" "}
          </div>
        </div>
        {this.getPaginationIndex()}
      </div>
    );
  }
}

Pagination.defaultProps = {
  ctrCls: "",
  isProcessing: false,
  totalCount: 0,
  pageSize: 50,
  currentPaginationIndex: 1,
  showingRecordWithPageSizeLabel: "",
  rows: [],
  onPageIndexChange: () => void 0,
  onFetchCountChange: () => void 0,
  itemsPerPageText: "Items per page: ",
  pageSizeText: "Items",

};
export default Pagination;
