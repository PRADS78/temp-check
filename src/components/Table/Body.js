import PropTypes from "prop-types";
import Row from "./Row";

function Body({
  rows,
  canSelectByClickingFullRow,
  isRowClickable,
  onRowClick,
  expandOptions,
}) {
  return (
    <tbody>
      {rows.map((row, rowIndex) => {
        return (
          <Row
            row={row}
            key={row.id}
            canSelectByClickingFullRow={canSelectByClickingFullRow}
            index={rowIndex}
            isRowClickable={isRowClickable}
            onRowClick={onRowClick}
            expandOptions={expandOptions}
          />
        );
      })}
    </tbody>
  );
}

Body.propTypes = {
  rows: PropTypes.array.isRequired,
  canSelectByClickingFullRow: PropTypes.bool.isRequired,
  isRowClickable: PropTypes.bool.isRequired,
  onRowClick: PropTypes.func.isRequired,
  expandOptions: PropTypes.object,
};

export default Body;
