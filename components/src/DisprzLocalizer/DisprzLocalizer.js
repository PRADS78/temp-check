import { useState, useEffect, useCallback } from "react";
import "./i18n";
import { useTranslation } from "react-i18next";
import _ from "lodash";
import DisprzI18nLanguageMappingKeys from "./DisprzI18nLanguageMappingKeys";
import LocalizerProvider from "./LocalizerProvider";
import TerminologyHelper from "./TerminologyHelper";
import {
  fetchClientSpecificLanguageFile,
  getResourceForALanguageForAMfe,
} from "./api";
import PropTypes from "prop-types";
import { NameSpace } from "../Enums";
import DcmpTranslation from "../../src/strings/en.json";
import { useClientSpecificCSSOverrides } from "../hooks";
const DisprzLocalizer = ({
  terminologyInfoString,
  lang,
  defaultTranslation,
  clientIdentifier,
  children,
  mfe,
}) => {
  const { i18n } = useTranslation();
  const [isLanguageFileLoaded, setIsLanguageFileLoaded] = useState(false);

  useClientSpecificCSSOverrides(mfe, clientIdentifier);

  useEffect(() => {
    if (!isLanguageFileLoaded) {
      TerminologyHelper.setTerminologyInfoItems(terminologyInfoString, lang);
      setDefaultResourceBundle(defaultTranslation);
      setDefaultResourceBundle(DcmpTranslation, NameSpace.DCMP);
      if (lang === "en") {
        setResourceBundle("en", DcmpTranslation, NameSpace.DCMP);
        setEnglishTranslation();
      } else {
        setOtherTranslation();
      }
    }
  }, [
    isLanguageFileLoaded,
    lang,
    setEnglishTranslation,
    setOtherTranslation,
    terminologyInfoString,
    defaultTranslation,
    setDefaultResourceBundle,
    setResourceBundle,
  ]);

  const setEnglishTranslation = useCallback(async () => {
    const currentLanguage = await getMergedLanguageForClientIfApplicable(
      defaultTranslation
    );
    setResourceBundle("en", currentLanguage);
    changeLanguage("en");
  }, [
    defaultTranslation,
    getMergedLanguageForClientIfApplicable,
    setResourceBundle,
    changeLanguage,
  ]);

  const setOtherTranslation = useCallback(async () => {
    const i18nLanguageKey = DisprzI18nLanguageMappingKeys.get(lang);

    const fetchCurrentLanguage = async () => {
      try {
        const currentLanguage = await getMergedLanguageForClientIfApplicable(
          await getResourceForALanguageForAMfe({
            mfe: mfe,
            lang: lang,
          })
        );
        setResourceBundle("en", currentLanguage);
      } catch (e) {
        console.error(e);
        setEnglishTranslation();
      }
    };

    const fetchDcmpLanguage = async () => {
      try {
        const dcmpLanguage = await getResourceForALanguageForAMfe({
          mfe: "disprz-components",
          lang: lang,
        });
        setResourceBundle("en", dcmpLanguage, NameSpace.DCMP);
      } catch (e) {
        console.error(e);
        setResourceBundle("en", DcmpTranslation, NameSpace.DCMP);
      }
    };

    await Promise.allSettled([fetchCurrentLanguage(), fetchDcmpLanguage()]);

    changeLanguage(i18nLanguageKey);
  }, [
    getMergedLanguageForClientIfApplicable,
    lang,
    mfe,
    setEnglishTranslation,
    setResourceBundle,
    changeLanguage,
  ]);

  const getMergedLanguageForClientIfApplicable = useCallback(
    async (translationToMergeFrom) => {
      /* istanbul ignore else */
      if (clientIdentifier !== "") {
        try {
          const clientLanguage = await fetchClientSpecificLanguageFile({
            mfe: mfe,
            lang: lang,
            clientIdentifier: clientIdentifier,
          });
          return Promise.resolve(
            _.merge(structuredClone(translationToMergeFrom), clientLanguage)
          );
        } catch (e) {
          console.error(e);
          return translationToMergeFrom;
        }
      }
      return translationToMergeFrom;
    },
    [clientIdentifier, lang, mfe]
  );

  const changeLanguage = useCallback(
    (key) => {
      i18n.changeLanguage(key);
      setIsLanguageFileLoaded(true);
    },
    [i18n]
  );

  const setResourceBundle = useCallback(
    (key, translation, namespace = "default") => {
      i18n.addResourceBundle(key, namespace, translation, true, true);
    },
    [i18n]
  );

  const setDefaultResourceBundle = useCallback(
    (translation, namespace) => {
      setResourceBundle("en", translation, namespace);
    },
    [setResourceBundle]
  );

  return (
    <LocalizerProvider>
      {isLanguageFileLoaded ? children : null}
    </LocalizerProvider>
  );
};

DisprzLocalizer.propTypes = {
  /**
   * Db pointer of the user
   */
  clientIdentifier: PropTypes.string,
  /**
   * Name of the current MFE app (from package.json)
   */
  mfe: PropTypes.string.isRequired,
  /**
   * This will be rendered after fetching the language resources
   */
  children: PropTypes.node,
  /**
   * This prop defines the terminologies used in the product
   */
  terminologyInfoString: PropTypes.object.isRequired,
  /**
   * This prop defines the current language
   */
  lang: PropTypes.string.isRequired,
  /**
   * Default translation json file
   */
  defaultTranslation: PropTypes.object,
};

DisprzLocalizer.defaultProps = {
  clientIdentifier: "",
};

export default DisprzLocalizer;
