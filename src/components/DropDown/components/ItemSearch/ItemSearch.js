import { forwardRef } from "react";
import styles from "./ItemSearch.module.scss";
import { SearchIcon } from "../../../../Icons";
import { useDropDownContext } from "../../hooks";
import actionTypes from "../../state/actionTypes";
import PropTypes from "prop-types";
import { useLocalizerWithNameSpace } from "../../../../DisprzLocalizer";

const ItemSearch = forwardRef(function (props, ref) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();

  const context = useDropDownContext();
  const { dropDownState, dropDownDispatch } = context;

  const onChange = (event) => {
    dropDownDispatch({
      type: actionTypes.UPDATE_SEARCH_TEXT,
      payload: { searchText: event.target.value },
    });

    const filteredItems = props.menuItems.filter((item) => {
      return item.label
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });

    dropDownDispatch({
      type: actionTypes.SET_FILTERED_ITEMS,
      payload: { filteredItems },
    });
    dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
  };

  return (
    <div className={styles.itemSearch}>
      <SearchIcon
        className={`no-hover cursor-default ${styles.iconContainer}`}
      />
      <input
        ref={ref}
        type="text"
        value={dropDownState.searchText}
        onChange={onChange}
        onClick={(event) => event.stopPropagation()}
        placeholder={t("common.search")}
      />
    </div>
  );
});

ItemSearch.displayName = "ItemSearch";
ItemSearch.propTypes = {
  menuItems: PropTypes.array,
};

export default ItemSearch;
