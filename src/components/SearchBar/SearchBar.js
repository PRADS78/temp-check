import styles from "./SearchBar.module.scss";
import PropTypes from "prop-types";
import { SearchCloseIcon, SearchIcon } from "../../Icons";
import { forwardRef, useRef, useEffect } from "react";
import { debounce } from "lodash";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";

const SearchBar = forwardRef((props, ref) => {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "SearchBar");
    invariantUniqueId(props.uniqueId, "SearchBar");
  }, [automationIdPrefix, props.uniqueId]);

  const onChangeDebounced = useRef(
    debounce(props.onChangeDebounced, props.debounceDelay)
  );

  const onChange = (e) => {
    props.onChange(e);
    onChangeDebounced.current(e);
  };

  const onSearch = () => {
    const e = { target: { value: props.value } };
    props.onSearch(e);
    onChangeDebounced.current.cancel();
  };

  return (
    <div
      className={`${styles.searchBar} ${props.ctrCls} ${
        props.isDisabled ? styles.isDisabled : ""
      }`}
      role="region"
      aria-roledescription="searchbar"
      ref={ref}
      data-dz-unique-id={`${automationIdPrefix}-${props.uniqueId}-searchbar`}
    >
      <SearchIcon
        onClick={onSearch}
        className={`${styles.iconContainer} ${
          props.value.length === 0 ? "no-hover cursor-default" : ""
        }`}
        uniqueId={1666950041798}
        isDisabled={props.value.length === 0 || props.isDisabled}
      />
      <input
        ref={props.inputRef}
        type="text"
        spellCheck={false}
        autoCorrect={"off"}
        name={props.name}
        onChange={onChange}
        placeholder={props.placeholder}
        value={props.value}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            props.onSearch(e);
          }
        }}
        disabled={props.isDisabled}
      />
      <SearchCloseIcon
        onClick={props.onClear}
        className={styles.clearButton}
        style={{
          visibility: props.value.length > 0 ? "visible" : "hidden",
        }}
        uniqueId={1666949962223}
        isDisabled={props.isDisabled}
      />
    </div>
  );
});

SearchBar.displayName = SearchBar;

SearchBar.propTypes = {
  /**
   * Container class that will be applied to the component
   */
  ctrCls: PropTypes.string,
  /**
   * Value for the Search Bar
   */
  value: PropTypes.string,
  /**
   * Sets the name attribute of the input
   */
  name: PropTypes.string,
  /**
   * Determine if the Searchbar is disabled
   */
  isDisabled: PropTypes.bool,
  /**
   * On change handler for the search bar
   */
  onChange: PropTypes.func.isRequired,
  /**
   * On change debounced handler for the search bar
   */
  onChangeDebounced: PropTypes.func,
  /**
   * Delay for debounce handler
   */
  debounceDelay: PropTypes.number,
  /**
   * On clear handler for the search bar
   */
  onClear: PropTypes.func.isRequired,
  /**
   * Sets the placeholder attribute of the input
   */
  placeholder: PropTypes.string,
  /**
   * On search handler for the search icon
   */
  onSearch: PropTypes.func.isRequired,
  /**
   * Sets the ref for the input
   */
  inputRef: PropTypes.oneOfType([
    // Either a function
    PropTypes.func,
    // Or the instance of a DOM native element (see the note about SSR)
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

SearchBar.defaultProps = {
  ctrCls: "",
  value: "",
  name: "",
  placeholder: "Search",
  inputRef: () => undefined,
  onChangeDebounced: () => undefined,
  debounceDelay: 500,
  isDisabled: false,
};

export default SearchBar;
