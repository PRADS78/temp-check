import PropTypes from "prop-types";
import List from "./List";
import useCombinedListLogic from "./CustomHooks/useCombinedListLogic";

function FullyCustomisableList({
  onOpen,
  isOpen,
  onReachBottom,
  onExternalSearch,
  ...rest
}) {
  const {
    listRef,
    onScrollList,
    onExternalSearchHandler,
    isInitialLoading,
    isMoreItemsLoading,
  } = useCombinedListLogic({
    onOpen,
    isOpen,
    onReachBottom,
    onExternalSearch,
  });

  return (
    <List
      {...rest}
      ref={listRef}
      isLoading={isInitialLoading}
      isOpen={isOpen}
      onScroll={onScrollList}
      onExternalSearch={onExternalSearchHandler}
      isMoreItemsLoading={isMoreItemsLoading}
    />
  );
}

FullyCustomisableList.propTypes = {
  onOpen: PropTypes.func,
  onReachBottom: PropTypes.func.isRequired,
  onExternalSearch: PropTypes.func.isRequired,
  ...List.propTypes,
};

export default FullyCustomisableList;
