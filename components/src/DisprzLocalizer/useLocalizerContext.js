import { useContext } from "react";
import LocalizerContext from "./LocalizerContext";

const useLocalizerContext = () => {
  return useContext(LocalizerContext);
};

export default useLocalizerContext;
