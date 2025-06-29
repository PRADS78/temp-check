import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { debounce } from "lodash";

function useCombinedListLogic({
  isOpen,
  onOpen,
  onReachBottom,
  onExternalSearch,
}) {
  const [isInitialLoading, setIsInitialLoading] = useState(!!onOpen);
  const [isMoreItemsLoading, setIsMoreItemsLoading] = useState(false);

  const listRef = useRef(null);
  const hasReachedBottom = useRef(false);
  const isEndOfList = useRef(false);

  useEffect(() => {
    if (isOpen && onOpen && isInitialLoading && listRef.current) {
      const onLoad = async () => {
        const { options } = await onOpen();
        listRef.current.updateItems((prevItems) => {
          return prevItems.concat(options);
        });
        setIsInitialLoading(false);
      };
      onLoad();
    }
  }, [isInitialLoading, isOpen, listRef, onOpen]);

  const onScrollList = useCallback(
    async (e) => {
      const isBottom =
        e.target.scrollHeight - e.target.scrollTop - 80 <=
        e.target.clientHeight;
      if (isBottom && !hasReachedBottom.current && !isEndOfList.current) {
        hasReachedBottom.current = true;
        setIsMoreItemsLoading(true);
        try {
          const { options, isEndOfList: _isEndOfList } = await onReachBottom();
          //TODO handle selected items while updating
          listRef.current.updateItems((prevItems) => {
            return prevItems.concat(options);
          });
          isEndOfList.current = _isEndOfList;
          hasReachedBottom.current = false;
        } catch (err) {
          console.error("Error fetching more items", err);
        } finally {
          setIsMoreItemsLoading(false);
        }
      }
    },
    [onReachBottom]
  );

  const scrollListFn = useMemo(() => {
    return debounce(onScrollList, 500);
  }, [onScrollList]);

  useEffect(() => {
    const debouncedFn = scrollListFn;
    return () => {
      debouncedFn.cancel();
    };
  }, [scrollListFn]);

  const onExternalSearchHandler = useCallback(
    (searchText) => {
      isEndOfList.current = false;
      const scrollRef = listRef.current.getScrollRef();
      typeof scrollRef.scrollTo === "function" && scrollRef?.scrollTo(0, 0);
      return onExternalSearch(searchText);
    },
    [onExternalSearch]
  );

  return {
    isInitialLoading,
    listRef,
    onScrollList: scrollListFn,
    onExternalSearchHandler,
    isMoreItemsLoading,
  };
}

export default useCombinedListLogic;
