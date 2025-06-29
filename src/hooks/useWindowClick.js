import { useEffect } from "react";
function useWindowClick(callback) {
  useEffect(
    function bindClickToWindow() {
      window.addEventListener("click", callback);
      return () => {
        window.removeEventListener("click", callback);
      };
    },
    [callback]
  );
}

export default useWindowClick;
