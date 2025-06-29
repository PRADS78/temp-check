import PropTypes from "prop-types";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { PlainButton, PrimaryButton } from "../AppButton";
import styles from "./Container.module.scss";
import {
  FilterLocalizedBannerDuration,
  TableFilterListSubTypes,
  TableFilterTypes,
} from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import {
  invariant,
  invariantAutomationPrefixId,
  invariantUniqueId,
} from "../../Utils";
import MoreOptions from "./MoreOptions";
import { isEqual } from "lodash";
import RangeExceededTooltip from "./RangeExceededTooltip";
import LocalizedBanner from "./LocalizedBanner";
import PinnedItems from "./PinnedItems";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const MandatoryItems = PinnedItems;

const Container = forwardRef(
  (
    {
      items,
      boundaryRef,
      onApply,
      onCancel,
      selectedItems,
      onClearAll,
      uniqueId,
      isNonDiscreteApplyButton,
      limitCount,
      ctrCls,
      innerCtrCls,
      // eslint-disable-next-line react/prop-types
      temp_isTableView = false,
    },
    ref
  ) => {
    /**
     * Rewrite the logic with custom hooks/mvc/composition pattern
     */
    const automationIdPrefix = useAutomationIdPrefix();
    const { getLanguageText: t } = useLocalizerWithNameSpace();
    useEffect(() => {
      invariantAutomationPrefixId(automationIdPrefix, "FilterContainer");
      invariantUniqueId(uniqueId, "FilterContainer");
    }, [automationIdPrefix, uniqueId]);

    const [recentlyAddedItemsId, setRecentlyAddedItemsId] = useState(() => {
      return Object.keys(selectedItems).reduce((acc, selectedItem) => {
        if (selectedItem in items) {
          return {
            ...acc,
            [selectedItem]: true,
          };
        }
        return acc;
      }, {});
    });
    const [refreshKey, setRefreshKey] = useState(Date.now());
    const [canShowLimitedSelectionBanner, setCanShowLimitedSelectionBanner] =
      useState(false);

    const mapPreselectedNonDiscreteFiltersWithProvidedFilters = (
      _selectedItems
    ) => {
      if (isNonDiscreteApplyButton) {
        return Object.entries(_selectedItems).reduce((acc, [key, value]) => {
          invariant(
            items[key] !== undefined,
            `Default filters with ${key} doesn't have an equivalent item prop on filterOptions`
          );
          return {
            ...acc,
            [key]: {
              id: key,
              selectedItem: value,
              type: items[key].type,
            },
          };
        }, {});
      }
      return {};
    };

    const [nonDiscreteSavedFilters, setNonDiscreteSavedFilters] = useState(
      isNonDiscreteApplyButton
        ? mapPreselectedNonDiscreteFiltersWithProvidedFilters(selectedItems)
        : {}
    );
    const prevDiscreteSavedFiltersRef = useRef(
      isNonDiscreteApplyButton
        ? mapPreselectedNonDiscreteFiltersWithProvidedFilters(selectedItems)
        : {}
    );
    const autoHideBannerTimerRef = useRef(-1);

    useImperativeHandle(
      ref,
      () => {
        return {
          clear: () => {
            if (isNonDiscreteApplyButton) {
              setNonDiscreteSavedFilters(prevDiscreteSavedFiltersRef.current);
              setRefreshKey(Date.now());
            }
          },
        };
      },
      [isNonDiscreteApplyButton]
    );

    const _onCancel = (args) => {
      onCancel(args);
    };

    const _onApply = (_selectedFilters) => {
      if (isNonDiscreteApplyButton) {
        setNonDiscreteSavedFilters((prev) => {
          let newNonDiscreteSavedFilters = { ...prev };
          if (
            _selectedFilters.selectedItem &&
            Object.keys(_selectedFilters.selectedItem).length === 0
          ) {
            delete newNonDiscreteSavedFilters[_selectedFilters.id];
            return newNonDiscreteSavedFilters;
          } else {
            newNonDiscreteSavedFilters[_selectedFilters.id] = _selectedFilters;
            return newNonDiscreteSavedFilters;
          }
        });
      } else {
        onApply(_selectedFilters);
      }
    };

    const onHideBanner = () => {
      if (autoHideBannerTimerRef.current !== -1) {
        clearTimeout(autoHideBannerTimerRef.current);
      }
    };

    const onAutoHideBanner = () => {
      autoHideBannerTimerRef.current = setTimeout(() => {
        setCanShowLimitedSelectionBanner(false);
      }, FilterLocalizedBannerDuration.FILTER_LIMIT);
    };

    const showErrorOnLimitReachedForAFilter = () => {
      onHideBanner();
      setCanShowLimitedSelectionBanner(true);
      onAutoHideBanner();
    };

    const onApplyDiscreteFilter = () => {
      prevDiscreteSavedFiltersRef.current = nonDiscreteSavedFilters;
      onApply(nonDiscreteSavedFilters);
    };

    let doesAnyFilterHasAMultiSelectItem = false;
    const mandatoryItems = Object.values(items).filter((value) => {
      if (value.isMultiSelect) {
        doesAnyFilterHasAMultiSelectItem = true;
      }
      return value.isMandatory === true;
    });

    const limitCountWithMandatoryItems = limitCount + mandatoryItems.length;

    const optionalItems = Object.values(items).filter((value) => {
      return value.isMandatory === false || value.isMandatory === undefined;
    });

    const itemsCount = mandatoryItems.length + optionalItems.length;

    const pinnedItems = Object.values(optionalItems).filter((value) => {
      return value.isPinned || value.id in recentlyAddedItemsId;
    });

    const unPinnedItems = Object.values(optionalItems)
      .filter((value) => !(value.id in recentlyAddedItemsId) && !value.isPinned)
      .map((value) => ({
        value: value.id,
        label: value.label,
      }));

    const isLimitReachedForAFilter = () => {
      return (
        Object.keys(nonDiscreteSavedFilters).length >=
        limitCountWithMandatoryItems
      );
    };
    const onRemoveFilter = (type, id) => {
      setRecentlyAddedItemsId((prevItems) => {
        const newRecentlyAddedItemsId = { ...prevItems };
        delete newRecentlyAddedItemsId[id];
        return newRecentlyAddedItemsId;
      });
      if (isNonDiscreteApplyButton) {
        setNonDiscreteSavedFilters((prev) => {
          const newNonDiscreteSavedFilters = { ...prev };
          delete newNonDiscreteSavedFilters[id];
          return newNonDiscreteSavedFilters;
        });
      } else {
        onApply({ selectedItem: {}, id, type });
      }
    };

    const onAddMore = (_selectedItems) => {
      setRecentlyAddedItemsId((prevRecentlyAddedItemsId) => {
        return { ...prevRecentlyAddedItemsId, ..._selectedItems };
      });
    };

    const renderBorder = () => {
      return <div className={styles.border} />;
    };

    const isAllMandatoryItemsSelected = () => {
      const mandatoryItemIds = mandatoryItems.map((item) => `${item.id}`);
      return mandatoryItemIds.every(
        (id) => nonDiscreteSavedFilters[id] !== undefined
      );
    };

    const renderNonDiscreteActionButtons = () => {
      const hasFiltersChanged = !isEqual(
        nonDiscreteSavedFilters,
        prevDiscreteSavedFiltersRef.current
      );
      const canDisableApplyButton = !(
        hasFiltersChanged && isAllMandatoryItemsSelected()
      );
      return (
        <>
          {renderBorder()}
          <PrimaryButton
            ctrCls={styles.applyButton}
            label={t("common.apply")}
            uniqueId={1694414059759}
            onClick={onApplyDiscreteFilter}
            isDisabled={canDisableApplyButton}
          />
          {Object.keys(nonDiscreteSavedFilters).length > 0 &&
            renderClearAllButton()}
        </>
      );
    };

    const renderClearAllButton = () => {
      return (
        <PlainButton
          label={`${t("common.clear")} ${t("common.all")}`}
          uniqueId={1672985105047}
          onClick={() => {
            if (isNonDiscreteApplyButton) {
              setNonDiscreteSavedFilters({});
            } else {
              onClearAll();
            }
            setRefreshKey(Date.now());
          }}
        />
      );
    };

    const renderFilterRangeExceededTooltip = () => {
      return (
        isNonDiscreteApplyButton && (
          <RangeExceededTooltip
            doesAnyFilterHasAMultiSelectItem={doesAnyFilterHasAMultiSelectItem}
            itemsCount={itemsCount}
            filterLimitCount={limitCountWithMandatoryItems}
            temp_isTableView={temp_isTableView}
          />
        )
      );
    };

    return (
      <div
        className={`${styles.container} ${ctrCls}`}
        role="region"
        data-role="filter-container"
        data-dz-unique-id={`${automationIdPrefix}-${uniqueId}-filter-container`}
      >
        <div className={`${styles.innerContainer} ${innerCtrCls}`}>
          {mandatoryItems.length > 0 && (
            <>
              <MandatoryItems
                items={mandatoryItems}
                showErrorOnLimitReachedForAFilter={
                  showErrorOnLimitReachedForAFilter
                }
                isLimitReachedForAFilter={isLimitReachedForAFilter}
                onApply={_onApply}
                onCancel={_onCancel}
                boundaryRef={boundaryRef}
                recentlyAddedItemsId={recentlyAddedItemsId}
                isNonDiscreteApplyButton={isNonDiscreteApplyButton}
                nonDiscreteSavedFilters={nonDiscreteSavedFilters}
                selectedItems={selectedItems}
                refreshKey={refreshKey}
                onRemove={onRemoveFilter}
              />
              {pinnedItems.length > 0 && renderBorder()}
            </>
          )}
          <PinnedItems
            items={pinnedItems}
            showErrorOnLimitReachedForAFilter={
              showErrorOnLimitReachedForAFilter
            }
            isLimitReachedForAFilter={isLimitReachedForAFilter}
            onApply={_onApply}
            onCancel={_onCancel}
            boundaryRef={boundaryRef}
            recentlyAddedItemsId={recentlyAddedItemsId}
            isNonDiscreteApplyButton={isNonDiscreteApplyButton}
            nonDiscreteSavedFilters={nonDiscreteSavedFilters}
            selectedItems={selectedItems}
            refreshKey={refreshKey}
            onRemove={onRemoveFilter}
          />
          {unPinnedItems.length > 0 && (
            <MoreOptions
              items={unPinnedItems}
              boundaryRef={boundaryRef}
              onAdd={onAddMore}
              key={unPinnedItems.length}
            />
          )}
          {isNonDiscreteApplyButton
            ? renderNonDiscreteActionButtons()
            : Object.keys(selectedItems).length > 0 && (
                <>
                  {renderBorder()}
                  {renderClearAllButton()}
                </>
              )}
        </div>
        {isNonDiscreteApplyButton && (
          <LocalizedBanner
            message={`${t(
              "filter.maxSelectionBannerText"
            )} ${limitCountWithMandatoryItems} ${
              limitCountWithMandatoryItems === 1
                ? t("common.filter")
                : t("common.filters")
            }`}
            ctrCls={`${styles.localizedBanner} ${
              canShowLimitedSelectionBanner ? styles.active : ""
            }`}
          />
        )}
        {renderFilterRangeExceededTooltip()}
      </div>
    );
  }
);

Container.displayName = "Container";

Container.propTypes = {
  /**
   * Items for the filter
   *
   * Example:
   *
   * ```js
   * items: {
   *   1: {
   *      id: 1,
   *      label: "Location",
   *      type: TableFilterTypes.LIST,
   *      subType: TableFilterListSubTypes.ON_DEMAND,
   *      isMultiSelect: true,
   *      isPinned: true,
   *      isMandatory: true,
   *      options: [
   *        {
   *          label: "Chennai",
   *          value: "chennai",
   *        },
   *      ],
   *      min: 0,
   *      max: 100,
   *      minDate: new Date(),
   *      maxDate: new Date(),
   *      onOpen: () => {},
   *      onReachBottom: () => {},
   *    },
   *    2: {
   *      id: 2,
   *      label: "Joining Date",
   *      type: TableFilterTypes.DATE,
   *      minDate: new Date("2022-12-01"),
   *      maxDate: new Date("2023-03-30"),
   *      onQuickActions: (actions) => actions.splice(0, actions.length) // Check DatePicker onQuickActions doc for more information
   *    },
   *    3: {
   *      id: 3,
   *      label: "Salary",
   *      type: TableFilterTypes.NUMBER,
   *      min: 0,
   *      max: 100,
   *    },
   * },
   * ```
   *
   */
  items: PropTypes.shape({
    id: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.oneOf(Object.values(TableFilterTypes)),
      subType: PropTypes.oneOf([
        TableFilterListSubTypes.ON_DEMAND,
        TableFilterListSubTypes.PAGINATED,
      ]),
      isMultiSelect: PropTypes.bool,
      isSearchable: PropTypes.bool,
      isPinned: PropTypes.bool,
      isMandatory: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
      ),
      min: PropTypes.number,
      max: PropTypes.number,
      minDate: PropTypes.instanceOf(Date),
      maxDate: PropTypes.instanceOf(Date),
      isDisabled: PropTypes.bool,
      onOpen: PropTypes.func,
      onReachBottom: PropTypes.func,
      onQuickActions: PropTypes.func,
      onExternalSearch: PropTypes.func,
    }),
  }),
  /**
   * Selected items for the filter
   *
   * Example:
   *
   * ```js
   * selectedItems: {
   *    1:{
   *      chennai: true,
   *      bangalore: true,
   *    },
   *    2: [new Date("2022-12-01"), new Date("2023-03-30")],
   *    3: [5000, 10000],
   * }
   * ```
   *
   */
  selectedItems: PropTypes.object,
  /**
   * Container ref for the popper (This is used in Table) to set the boundary where it should flip
   */
  boundaryRef: PropTypes.object,
  /**
   * Callback function to be called when the filter is applied
   */
  onApply: PropTypes.func.isRequired,
  /**
   * Callback function to be called when the filter is cancelled
   */
  onCancel: PropTypes.func.isRequired,
  /**
   * Callback function to be called when the all filter is cleared
   */
  onClearAll: PropTypes.func.isRequired,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Instead of `Apply` and `Clear All` button on individual filter, this gives a global `Apply` and `Clear All` button
   */
  isNonDiscreteApplyButton: PropTypes.bool,
  /**
   * Container class for the filter container
   */
  ctrCls: PropTypes.string,
  /**
   * Container class that contains pinned, more, apply and clear all buttons
   */
  innerCtrCls: PropTypes.string,
  /**
   * Limits the number of filters that can be applied
   */
  limitCount: PropTypes.number, // TODO: Rename this
};

Container.defaultProps = {
  items: {},
  selectedItems: {},
  isNonDiscreteApplyButton: false,
  limitCount: 3,
};

export default Container;
