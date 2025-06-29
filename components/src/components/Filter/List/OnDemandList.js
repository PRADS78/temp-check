import PropTypes from "prop-types";
import List from "./List";
import useCombinedListLogic from "./CustomHooks/useCombinedListLogic";

function OnDemandList({ onOpen, isOpen, ...rest }) {
  const { isInitialLoading, listRef } = useCombinedListLogic({
    isOpen,
    onOpen,
  });

  return (
    <List
      {...rest}
      ref={listRef}
      isLoading={isInitialLoading}
      isOpen={isOpen}
    />
  );
}

OnDemandList.propTypes = {
  onOpen: PropTypes.func,
  ...List.propTypes,
};

export default OnDemandList;
