import PropTypes from "prop-types";
import List from "./List";
import useCombinedListLogic from "./CustomHooks/useCombinedListLogic";

function PaginatedList({ onReachBottom, ...rest }) {
  const { listRef, onScrollList } = useCombinedListLogic({
    onReachBottom,
  });

  return <List {...rest} ref={listRef} onScroll={onScrollList} />;
}

PaginatedList.propTypes = {
  onReachBottom: PropTypes.func.isRequired,
};

PaginatedList.defaultProps = {};

export default PaginatedList;
