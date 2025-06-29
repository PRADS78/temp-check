import { DropDown } from "../../DropDown";
import { PrimaryButton } from "../../AppButton";
import styles from "./Pagination.module.scss";
import PropTypes from "prop-types";
import {
  ChipColor,
  TableLoadingOptions,
  PopperReferenceStrategies,
} from "../../../Enums";
import { useMemo } from "react";
import { LeftArrow, RightArrow } from "@disprz/icons";
import Tag from "../../Tag/Tag";
import { useLocalizerWithNameSpace } from "../../../DisprzLocalizer";
function Pagination(props) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const pages = props.table.getPageOptions().map((page) => {
    return {
      value: page + 1,
      label: <span className={styles.allPageNumbers}>{String(page + 1)}</span>,
      selectedLabel: (
        <span className={styles.selectedPageNumber}>{String(page + 1)}</span>
      ),
    };
  });

  const sizeItems = useMemo(() => {
    if (props.sizeItems) {
      return props.sizeItems;
    }
    const items = new Array(props.noOfSizeItems).fill(0).map((_, index) => {
      return {
        value: (index + 1) * props.sizeMultiplier,
        label: `${t("common.show")} ${(index + 1) * props.sizeMultiplier} ${t(
          "common.items"
        )}`,
        selectedLabel: (
          <span>
            {t("table.itemsPerPage")}
            <span className={styles.number}>
              {(index + 1) * props.sizeMultiplier}
            </span>
          </span>
        ),
      };
    });
    return items;
  }, [props.noOfSizeItems, props.sizeItems, props.sizeMultiplier, t]);

  return (
    <section
      className={`${styles.pagination} ${
        props.hasReachedBottomOfThePage ? styles.removeShadow : styles.addShadow
      } ${props.canShowScrollBar ? styles.withScrollBar : ""} `}
      data-testid="pagination-container"
    >
      <div className={styles.paging}>
        <div className={styles.pageItemsDropDown}>
          <DropDown
            ctrCls={styles.itemsPerPageDropDown}
            canShowScrollBar={false}
            items={sizeItems}
            isClearable={false}
            isSearchable={false}
            isMulti={false}
            isDisabled={props.loadingState === TableLoadingOptions.EMPTY}
            onChange={(item) => {
              props.table.setPageIndex(0);
              props.table.setPageSize(item.value);
              props.onSizeChange({ selectedSize: item.value });
            }}
            value={props.limit}
            intersectionRef={props.tableRef.current}
            canShowTickIcon={false}
            uniqueId={1667395801079}
            popperReferenceStrategy={
              props.noOfPagesDropDownOptions?.popperReferenceStrategy
            }
          />
        </div>
        {props.totalRows > -1 &&
          props.loadingState !== TableLoadingOptions.EMPTY && (
            <div className={styles.pageIndicator}>
              {`${props.offset + 1}-${
                props.table.getCanNextPage()
                  ? props.offset + props.limit
                  : props.totalRows
              } ${t("common.of")} ${props.totalRows} ${t("common.items")}`}
            </div>
          )}
      </div>
      {Object.keys(props.selectedRowIds).length > 0 ? (
        <Tag
          label={`${Object.keys(props.selectedRowIds).length} ${t(
            "common.selected"
          )} ${
            Object.keys(props.selectedRowIds).length === 1
              ? props.singularSelectedLabel
              : props.pluralSelectedLabel
          }`}
          color={ChipColor.PRIMARY}
          ctrCls={styles.selectedUsers}
          uniqueId={1667395790763}
        />
      ) : (
        <div />
      )}
      <div className={styles.navigation}>
        {pages.length > 1 && (
          <div className={styles.pageNavigation} data-testid="page-navigator">
            <div className={styles.dropDownContainer}>
              <DropDown
                ctrCls={`${styles.pageNavigationDropDown}`}
                canShowScrollBar={false}
                items={pages}
                isClearable={false}
                isSearchable={false}
                isMulti={false}
                isDisabled={false}
                onChange={(item) => {
                  props.table.setPageIndex(item.value);
                  props.onSet({ selectedPage: item.value });
                }}
                key={props.table.getState().pagination.pageIndex + 1}
                value={props.table.getState().pagination.pageIndex + 1}
                intersectionRef={props.tableRef.current}
                canShowTickIcon={false}
                uniqueId={1667395774498}
                canUsePortal={true}
                maxHeight={350}
                isMenuWidthSameAsReference={false}
                menuCtrCls={styles.menuText}
                popperReferenceStrategy={
                  props.pageSelectionDropDownOptions?.popperReferenceStrategy
                }
              />
            </div>
            <span className={styles.pageCount}>
              {t("common.of")} {pages.length} {t("table.pages")}
            </span>
          </div>
        )}
        <div className={styles.buttons}>
          <PrimaryButton
            ctrCls={styles.navigationButton}
            isDisabled={!props.table.getCanPreviousPage()}
            onClick={() => {
              props.table.previousPage();
              props.onPrevious({
                prevLimit: props.limit,
                prevOffset: props.offset,
              });
            }}
            icon={() => {
              return (
                <LeftArrow
                  className={`${styles.arrow} fill`}
                  canRenderOnlyIcon
                />
              );
            }}
            uniqueId={1667395759374}
          />
          <PrimaryButton
            isDisabled={
              props.isEndOfList ? true : !props.table.getCanNextPage()
            }
            ctrCls={styles.navigationButton}
            icon={() => {
              return (
                <RightArrow
                  className={`${styles.arrow} fill`}
                  canRenderOnlyIcon
                />
              );
            }}
            onClick={() => {
              props.table.nextPage();
              props.onNext({
                prevLimit: props.limit,
                prevOffset: props.offset,
              });
            }}
            uniqueId={1667395744404}
          />
        </div>
      </div>
    </section>
  );
}

Pagination.propTypes = {
  sizeItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.number,
    })
  ),
  sizeMultiplier: PropTypes.number,
  noOfSizeItems: PropTypes.number,
  table: PropTypes.object,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  onSizeChange: PropTypes.func,
  onSet: PropTypes.func,
  offset: PropTypes.number,
  totalRows: PropTypes.number,
  limit: PropTypes.number,
  tableRef: PropTypes.object.isRequired,
  isEndOfList: PropTypes.bool,
  selectedRowIds: PropTypes.object.isRequired,
  singularSelectedLabel: PropTypes.string,
  pluralSelectedLabel: PropTypes.string,
  hasReachedBottomOfThePage: PropTypes.bool.isRequired,
  loadingState: PropTypes.oneOf([
    TableLoadingOptions.LOADING,
    TableLoadingOptions.LOADED,
    TableLoadingOptions.EMPTY,
    TableLoadingOptions.ERROR,
  ]),
  canShowScrollBar: PropTypes.bool.isRequired,
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
};

/* istanbul ignore next */
Pagination.defaultProps = {
  sizeItems: null,
  hasReachedBottomOfThePage: false,
  sizeMultiplier: 10,
  noOfSizeItems: 4,
  onNext: () => undefined,
  onPrevious: () => undefined,
  onSizeChange: () => undefined,
  onSet: () => undefined,
  offset: 0,
  limit: 10,
  singularSelectedLabel: undefined,
  pluralSelectedLabel: undefined,
  maxCapForSelectAll: 1000,
  loadingState: TableLoadingOptions.LOADED,
};

export default Pagination;
