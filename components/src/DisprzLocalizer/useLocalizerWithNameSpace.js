import { NameSpace } from "../Enums";
import useLocalizerContext from "./useLocalizerContext";

const useLocalizerWithNameSpace = () => {
  const { getLanguageText: t } = useLocalizerContext();

  return {
    getLanguageText: (key, options) => t(`${NameSpace.DCMP}:${key}`, options),
  };
};

export default useLocalizerWithNameSpace;
