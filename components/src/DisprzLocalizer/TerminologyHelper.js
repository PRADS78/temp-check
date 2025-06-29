import _ from "lodash";

class TerminologyHelper {
  static #TERM_REGEX = /\{(term_\w*)_(.)}/g;
  static #userTerminology = {};

  static setTerminologyInfoItems = (terminologyInfoString, lang) => {
    const defaultLanguage = "en";
    let terminologyInfoItems = terminologyInfoString[lang]
      ? terminologyInfoString[lang]
      : {};
    if (_.isEmpty(terminologyInfoItems)) {
      console.warn(
        `Language key "${lang}" not available. So fallback to ${defaultLanguage}`
      );
      terminologyInfoItems = terminologyInfoString[defaultLanguage];
    }
    terminologyInfoItems.forEach((terminologyInfoItem) => {
      this.#userTerminology[terminologyInfoItem.itemIdentifier] = {
        singularForm: terminologyInfoItem.singularForm,
        pluralForm: terminologyInfoItem.pluralForm,
      };
    });
  };

  /* istanbul ignore next */
  static getTerminologyInfoItems = () => {
    return this.#userTerminology;
  };

  static #getSingularForm = (termType) => {
    return this.#userTerminology[termType]?.singularForm || termType;
  };

  static #getPluralForm = (termType) => {
    return this.#userTerminology[termType]?.pluralForm || termType;
  };

  static getTermValue = (text) => {
    return text.replace(this.#TERM_REGEX, (match, termType, multiplicity) => {
      return multiplicity === "1"
        ? this.#getSingularForm(termType)
        : this.#getPluralForm(termType);
    });
  };
}

export default TerminologyHelper;
