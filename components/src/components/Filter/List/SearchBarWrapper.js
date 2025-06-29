import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import PropTypes from "prop-types";
import listStyles from "./List.module.scss";

import { SearchBar } from "../../SearchBar";

const SearchBarWrapper = forwardRef(
  ({ options, updateItems, onExternalSearch }, ref) => {
    const isExternalSearch =
      !!onExternalSearch && typeof onExternalSearch === "function";
    const [searchText, setSearchText] = useState("");
    const isFirstRender = useRef(true);

    useEffect(() => {
      //returning in first render to prevent updateitems to override options from onLoad() in case of onDemandList
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      if (!isExternalSearch) {
        onSearchTextChange();
      }
    }, [searchText, isExternalSearch, onSearchTextChange, options]);

    const onSearchTextChange = useCallback(() => {
      if (searchText) {
        const filteredItems = options.filter((item) => {
          return item.label.toLowerCase().includes(searchText.toLowerCase());
        });
        updateItems(filteredItems);
      } else {
        updateItems(options);
      }
    }, [options, searchText, updateItems]);

    const onSearchClear = useCallback(() => {
      setSearchText("");
      updateItems(options);
    }, [setSearchText, options, updateItems]);

    const onExternalSearchClear = useCallback(() => {
      updateItems([]);
      setSearchText("");
    }, [updateItems, setSearchText]);

    const onExternalSearchApply = (e) => {
      setSearchText(e.target.value);
      onExternalSearch(e.target.value).then((searchResults) => {
        updateItems(searchResults.options);
      });
    };

    const onResetSearchText = useCallback(() => {
      if (isExternalSearch) {
        onExternalSearchClear();
      } else {
        onSearchClear();
      }
    }, [isExternalSearch, onExternalSearchClear, onSearchClear]);

    useImperativeHandle(
      ref,
      () => ({
        resetSearchText: onResetSearchText,
      }),
      [onResetSearchText]
    );

    return (
      <>
        {isExternalSearch ? (
          <SearchBar
            ctrCls={listStyles.searchBar}
            value={searchText}
            uniqueId={1670336676506}
            onChangeDebounced={onExternalSearchApply}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onClear={onExternalSearchClear}
            onSearch={onExternalSearchApply}
          />
        ) : (
          <SearchBar
            ctrCls={listStyles.searchBar}
            value={searchText}
            uniqueId={1670336676505}
            onChangeDebounced={() => {}}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
            onClear={onSearchClear}
            onSearch={onSearchTextChange}
          />
        )}
      </>
    );
  }
);

SearchBarWrapper.displayName = SearchBarWrapper;

SearchBarWrapper.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      isDisabled: PropTypes.bool,
    })
  ),
  updateItems: PropTypes.func,
  onExternalSearch: PropTypes.func,
};
export default SearchBarWrapper;
