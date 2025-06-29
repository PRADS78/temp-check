import PropTypes from "prop-types";
import listStyles from "./List.module.scss";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import ListItem from "./ListItem";
import Footer from "../Footer/Footer";
import { Popper } from "../../Popper";
import {
  FilterListSelectionType,
  FilterLocalizedBannerDuration,
} from "../../../Enums";
import { isEqual } from "lodash";
import LocalizedBanner from "../LocalizedBanner";
import { RadioButton } from "../../RadioButton";
import { useLocalizerWithNameSpace } from "../../../DisprzLocalizer";
import SearchBarWrapper from "./SearchBarWrapper";

const List = forwardRef(
  (
    {
      referenceElement,
      isOpen,
      options,
      onApply,
      onCancel,
      isSearchable,
      isMultiSelect,
      selectedOptions,
      popperModifiers,
      selectionType,
      isLoading,
      isMoreItemsLoading,
      isNonDiscreteApplyButton,
      onScroll,
      showErrorOnLimitReachedForAFilter,
      canRestrictItemChanges,
      min,
      max,
      isMandatory,
      onExternalSearch,
    },
    ref
  ) => {
    const { getLanguageText: t } = useLocalizerWithNameSpace();
    const [items, setItems] = useState(options);
    const [currentlySelectedItems, setCurrentlySelectedItems] =
      useState(selectedOptions);
    const [canShowLimitedSelectionBanner, setCanShowLimitedSelectionBanner] =
      useState(false);
    const [bannerMessage, setBannerMessage] = useState("");
    const autoHideBannerTimerRef = useRef(-1);
    const bannerPositionRef = useRef();
    const searchBarRef = useRef();

    const [scrollRef, setScrollRef] = useState(null);

    useEffect(() => {
      return () => {
        if (autoHideBannerTimerRef.current !== -1) {
          clearTimeout(autoHideBannerTimerRef.current);
        }
      };
    }, []);

    useEffect(() => {
      setItems(options);
    }, [options]);

    useEffect(() => {
      !isOpen && setCanShowLimitedSelectionBanner(false);
    }, [isOpen]);

    const updateItems = useCallback((callback) => {
      setItems(callback);
    }, []);

    const hasItemsUpdated = useMemo(() => {
      return isOpen && !isEqual(selectedOptions, currentlySelectedItems);
    }, [currentlySelectedItems, isOpen, selectedOptions]);

    const isMandatoryAndSelected = () =>
      isMandatory ? Object.keys(currentlySelectedItems).length > 0 : true;

    const isMinimumSelectionAvailable = () =>
      min > -1 ? Object.keys(currentlySelectedItems).length >= min : true;

    useImperativeHandle(
      ref,
      () => ({
        updateItems,
        getScrollRef: () => {
          return scrollRef;
        },
      }),
      [scrollRef, updateItems]
    );

    const clearBannerTimeout = () => {
      if (autoHideBannerTimerRef.current !== -1) {
        clearTimeout(autoHideBannerTimerRef.current);
      }
    };

    const onAutoHideBanner = () => {
      autoHideBannerTimerRef.current = setTimeout(() => {
        setCanShowLimitedSelectionBanner(false);
      }, FilterLocalizedBannerDuration.OPTION_LIMIT);
    };

    const getCanShowMaximumSelectionBanner = (_, { item }) => {
      return (
        max > -1 &&
        Object.keys(currentlySelectedItems).length === max &&
        currentlySelectedItems[item.value] === undefined
      );
    };

    const getCanShowMiminumSelectionBanner = (_, { item }) => {
      return (
        min > -1 &&
        Object.keys(currentlySelectedItems).length <= min &&
        currentlySelectedItems[item.value] !== undefined
      );
    };

    const showLimitedSelectionBanner = (e, { index }) => {
      const flexGap = 4;
      bannerPositionRef.current =
        flexGap * (index + 1) + e.target.parentElement.clientHeight * index;

      clearBannerTimeout();
      setCanShowLimitedSelectionBanner(true);
      onAutoHideBanner();
    };

    const _onChange = (e, { item, index }) => {
      if (canRestrictItemChanges) {
        return showErrorOnLimitReachedForAFilter();
      }

      if (getCanShowMaximumSelectionBanner(e, { item, index })) {
        setBannerMessage(
          `${t("filter.maxSelectionBannerText")} ${max} ${
            max === 1 ? t("common.option") : t("common.options")
          }`
        );
        showLimitedSelectionBanner(e, { item, index });
        return;
      }

      if (getCanShowMiminumSelectionBanner(e, { item, index })) {
        setBannerMessage(
          `${t("filter.minSelectionBannerText.part1")} ${min} ${
            min === 1 ? t("common.option") : t("common.options")
          } ${t("filter.minSelectionBannerText.part2")}`
        );
        showLimitedSelectionBanner(e, { item, index });
        return;
      }

      clearBannerTimeout();
      setCanShowLimitedSelectionBanner(false);

      setCurrentlySelectedItems((prevSelectedItems) => {
        prevSelectedItems = { ...prevSelectedItems };
        const isItemAlreadyAvailable =
          prevSelectedItems[item.value] !== undefined;
        if (isItemAlreadyAvailable) {
          delete prevSelectedItems[item.value];
        } else {
          if (!isMultiSelect) {
            prevSelectedItems = {};
            prevSelectedItems[item.value] = true;
          } else {
            prevSelectedItems[item.value] = true;
          }
        }
        return prevSelectedItems;
      });
    };

    const _onClearAll = () => {
      if (min > -1) {
        setBannerMessage(
          `${t("filter.minSelectionBannerText.part1")} ${min} ${
            min === 1 ? t("common.option") : t("common.options")
          } ${t("filter.minSelectionBannerText.part2")}`
        );
        clearBannerTimeout();
        setCanShowLimitedSelectionBanner(true);
      }
      setCurrentlySelectedItems({});
      searchBarRef?.current?.resetSearchText();
    };

    const _onCancel = () => {
      if (isNonDiscreteApplyButton) {
        _onApply();
      } else {
        onCancel();
        setCurrentlySelectedItems(selectedOptions);
        searchBarRef?.current?.resetSearchText();
      }
    };

    const _onApply = () => {
      searchBarRef?.current?.resetSearchText();
      onApply(currentlySelectedItems);
      if (selectionType === FilterListSelectionType.FILTERING) {
        setCurrentlySelectedItems({});
      }
    };

    const renderFooter = () => {
      if (isMoreItemsLoading) {
        return <div className={listStyles.loading}>Loading...</div>;
      }
      if (isNonDiscreteApplyButton) {
        return null;
      }
      return (
        <Footer
          canShowClearAll={Object.keys(currentlySelectedItems).length > 0}
          onApply={_onApply}
          onClearAll={_onClearAll}
          onCancel={_onCancel}
          canApply={
            hasItemsUpdated &&
            isMandatoryAndSelected() &&
            isMinimumSelectionAvailable()
          }
        />
      );
    };

    const renderMultiSelectionList = () => {
      return items.map((item, index) => {
        const isSelected = currentlySelectedItems[item.value] !== undefined;
        return (
          <ListItem
            key={item.value}
            isSelected={isSelected}
            onChange={_onChange}
            label={item.label}
            value={item.value}
            isDisabled={item.isDisabled}
            index={index}
          />
        );
      });
    };

    const renderSingleSelectionList = () => {
      const groups = items.map((item) => {
        return { ...item, id: String(item.value) };
      });
      return (
        <RadioButton
          uniqueId={1704053151690}
          ctrCls={listStyles.radioBtn}
          groups={groups}
          selectedGroupId={Object.keys(currentlySelectedItems)[0]}
          onChange={(e, item) => {
            _onChange(e, { item: item });
          }}
        />
      );
    };

    useEffect(() => {
      const ref = scrollRef;
      const _onScroll = (e) => {
        setCanShowLimitedSelectionBanner(false);
        if (typeof onScroll === "function") {
          onScroll(e);
        }
      };
      if (ref) {
        ref.addEventListener("scroll", _onScroll);
      }
      return () => {
        if (ref) {
          ref.removeEventListener("scroll", _onScroll);
        }
      };
    }, [onScroll, scrollRef]);

    const renderSearchBar = () => (
      <SearchBarWrapper
        ref={searchBarRef}
        options={options}
        onExternalSearch={onExternalSearch}
        updateItems={updateItems}
      />
    );

    const renderLocalizedBanner = () => (
      <LocalizedBanner
        uniqueId={1695806860992}
        style={{
          top: `${bannerPositionRef.current - (scrollRef?.scrollTop ?? 0)}px`,
        }}
        message={bannerMessage}
        ctrCls={`${listStyles.localizedBanner} ${
          canShowLimitedSelectionBanner ? listStyles.active : ""
        }`}
      />
    );

    const renderItemsContainer = () => (
      <div
        className={listStyles.itemsContainer}
        ref={setScrollRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
        role="listbox"
      >
        {isMultiSelect
          ? renderMultiSelectionList()
          : renderSingleSelectionList()}
      </div>
    );

    return (
      <>
        <Popper
          isVisible={isOpen}
          referenceElement={referenceElement}
          innerCtrCls={listStyles.container}
          isPortal
          onClickOutside={_onCancel}
          modifiers={popperModifiers}
          placement="bottom-end"
        >
          {isLoading ? (
            <div className={listStyles.loader}>Loading...</div>
          ) : (
            <>
              {isSearchable && renderSearchBar()}
              {(max > -1 || min > -1) && renderLocalizedBanner()}
              {renderItemsContainer()}
              {renderFooter()}
            </>
          )}
        </Popper>
      </>
    );
  }
);

List.displayName = "FilterList";

List.propTypes = {
  // This is used in Global/External Filter

  selectedOptions: PropTypes.array,
  onCancel: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  referenceElement: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      isDisabled: PropTypes.bool,
    })
  ).isRequired,
  isSearchable: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  popperModifiers: PropTypes.array,
  selectionType: PropTypes.oneOf([
    FilterListSelectionType.FILTERING,
    FilterListSelectionType.NON_FILTERING,
  ]),
  onScroll: PropTypes.func,
  isLoading: PropTypes.bool,
  isMoreItemsLoading: PropTypes.bool,
  isNonDiscreteApplyButton: PropTypes.bool,
  showErrorOnLimitReachedForAFilter: PropTypes.func,
  max: PropTypes.number,
  min: PropTypes.number,
  canRestrictItemChanges: PropTypes.bool,
  isMandatory: PropTypes.bool,
  onExternalSearch: PropTypes.func,
};

List.defaultProps = {
  selectedOptions: {},
  isSearchable: true,
  isMultiSelect: true,
  popperModifiers: [],
  selectionType: FilterListSelectionType.NON_FILTERING,
  onScroll: undefined,
  isLoading: false,
  isMoreItemsLoading: false,
  isNonDiscreteApplyButton: false,
  showErrorOnLimitReachedForAFilter: () => undefined,
  max: -1,
  min: -1,
  onExternalSearch: undefined,
  options: [],
};

export default List;
