import PropTypes from "prop-types";
import { SortOrder } from "../../Enums";
import { TableSort } from "../../Icons";
import styles from "./Table.module.scss";

function ColumnLevelSort({
  sortOrder,
  sortBy,
  onSortChange,
  columnId,
  headerId,
}) {
  const onSort = () => {
    const nextSortOrder =
      sortBy === columnId
        ? sortOrder === SortOrder.ASCENDING
          ? SortOrder.DESCENDING
          : SortOrder.ASCENDING
        : SortOrder.ASCENDING;
    onSortChange({
      sortBy: headerId,
      sortOrder: nextSortOrder,
    });
  };

  if (sortBy === columnId) {
    return (
      <TableSort
        className={`${styles.tableSort} ${
          sortOrder === SortOrder.DESCENDING
            ? styles.descending
            : styles.ascending
        }`}
        data-role="sort-icon"
        onClick={onSort}
        uniqueId={`${1717666223138}-${columnId}`}
      />
    );
  } else {
    return (
      <TableSort
        className={`${styles.tableSort}`}
        data-role="sort-icon"
        onClick={onSort}
        uniqueId={`${1717666262021}-${columnId}`}
      />
    );
  }
}

ColumnLevelSort.propTypes = {
  columnId: PropTypes.string.isRequired,
  headerId: PropTypes.string.isRequired,
  sortBy: PropTypes.string,
  sortOrder: PropTypes.oneOf([null, SortOrder.ASCENDING, SortOrder.DESCENDING]),
  onSortChange: PropTypes.func,
};

/* istanbul ignore next */
ColumnLevelSort.defaultProps = {
  sortBy: null,
  sortOrder: null,
  onSortChange: () => undefined,
};

export default ColumnLevelSort;
