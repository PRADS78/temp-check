import { useState, useRef, useCallback } from "react";

export const useDragAndDrop = (options = {}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const dragCounterRef = useRef(0);
  const scrollIntervalRef = useRef(null);

  const getScrollContainer = useCallback(() => {
    if (typeof options.scrollContainer === "function") {
      return options.scrollContainer();
    }
    return options.scrollContainer || null;
  }, [options.scrollContainer]);

  const handleAutoScroll = useCallback(
    (clientY) => {
      if (!options.autoScroll) return;

      const container = getScrollContainer();
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const threshold = 50;
      const scrollSpeed = 5;

      if (clientY < containerRect.top + threshold) {
        container.scrollTop = Math.max(0, container.scrollTop - scrollSpeed);
      } else if (clientY > containerRect.bottom - threshold) {
        container.scrollTop = Math.min(
          container.scrollHeight - container.clientHeight,
          container.scrollTop + scrollSpeed,
        );
      }
    },
    [options.autoScroll, getScrollContainer],
  );

  const startAutoScroll = useCallback(
    (clientY) => {
      if (scrollIntervalRef.current) return;

      scrollIntervalRef.current = setInterval(() => {
        handleAutoScroll(clientY);
      }, 16);
    },
    [handleAutoScroll],
  );

  const stopAutoScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  const onDragStart = (e, item) => {
    setIsDragging(true);
    setDraggedItem(item);

    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copyMove";

    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const onDragEnd = (e) => {
    setIsDragging(false);
    setDraggedItem(null);
    setDropTarget(null);
    dragCounterRef.current = 0;
    stopAutoScroll();

    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";

    if (isDragging) {
      handleAutoScroll(e.clientY);
    }
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;

    if (e.currentTarget instanceof HTMLElement) {
      const targetId = e.currentTarget.getAttribute("data-drop-target");
      if (targetId) {
        setDropTarget(targetId);
      }
    }

    if (isDragging) {
      startAutoScroll(e.clientY);
    }
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;

    if (dragCounterRef.current === 0) {
      setDropTarget(null);
      stopAutoScroll();
    }
  };

  const onDrop = (e, targetId, position) => {
    e.preventDefault();
    e.stopPropagation();
    setDropTarget(null);
    dragCounterRef.current = 0;
    stopAutoScroll();

    try {
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;

      const item = JSON.parse(data);

      if (options.acceptTypes && !options.acceptTypes.includes(item.type)) {
        return;
      }

      const result = {
        targetId,
        position,
        action: e.ctrlKey || e.metaKey ? "copy" : "move",
      };

      options.onDrop?.(item, result);
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave,
    isDragging,
    draggedItem,
    dropTarget,
  };
};

export const createDragItem = (id, type, data) => ({
  id,
  type,
  data,
});
