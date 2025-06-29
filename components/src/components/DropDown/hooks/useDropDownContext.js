import { useContext } from "react";
import { Context } from "../context/DropDownProvider";
function useDropDownContext() {
  return useContext(Context);
}

export default useDropDownContext;
