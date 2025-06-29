import { useState, useRef, useEffect } from "react";
import { debounce } from "lodash";

const useDebouncedHover = (ref) => {
  const [isHovered, setIsHovered] = useState(false);

  const onHandleMouseOut = () => {
    setIsHovered(false);
  };

  const onHandleMouseOutDebounced = useRef(debounce(onHandleMouseOut, 100));

  const onHandleMouseOver = () => {
    setIsHovered(true);
    onHandleMouseOutDebounced.current.cancel();
  };

  useEffect(() => {
    const node = ref;
    const onMouseOut = onHandleMouseOutDebounced.current;
    if (node) {
      node.addEventListener("mouseover", onHandleMouseOver);
      node.addEventListener("mouseleave", onMouseOut);
    }
    return () => {
      if (node) {
        node.removeEventListener("mouseover", onHandleMouseOver);
        node.removeEventListener("mouseleave", onMouseOut);
      }
    };
  }, [ref]);

  return {
    isHovered,
  };
};

export default useDebouncedHover;
