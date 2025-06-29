import { AutomationIdPrefixContext } from "./AutomationIdPrefixContext";
import PropTypes from "prop-types";
import { invariantSkipProd } from "../Utils";

const AutomationIdPrefixProvider = ({ value, children }) => {
  invariantSkipProd(
    value != undefined && value.trim() != "",
    "Value is required for AutomationIdPrefixProvider, basically they are route names"
  );
  return (
    <AutomationIdPrefixContext.Provider value={value.toLowerCase()}>
      {children}
    </AutomationIdPrefixContext.Provider>
  );
};

AutomationIdPrefixProvider.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export { AutomationIdPrefixProvider };
