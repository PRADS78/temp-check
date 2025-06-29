import { useMemo } from "react";
import LocalizerContext from "./LocalizerContext";
import TerminologyHelper from "./TerminologyHelper";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { NameSpace } from "../Enums";

const LocalizerProvider = ({ children }) => {
  const { t } = useTranslation([NameSpace.DEFAULT, NameSpace.DCMP]);

  const localizerConfig = useMemo(() => {
    return {
      getLanguageText: (key, options) =>
        TerminologyHelper.getTermValue(t(key, options)),
    };
  }, [t]);

  return (
    <LocalizerContext.Provider value={localizerConfig}>
      {children}
    </LocalizerContext.Provider>
  );
};

LocalizerProvider.propTypes = {
  children: PropTypes.node,
};

export default LocalizerProvider;
