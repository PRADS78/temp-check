import { useEffect } from "react";

function useWindowResize(callback) {
  useEffect(
    function bindClickToWindow() {
      window.addEventListener("resize", callback);
      return () => {
        window.removeEventListener("resize", callback);
      };
    },
    [callback]
  );
}

export default useWindowResize;
