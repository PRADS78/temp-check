import { useContext } from "react";
import { AutomationIdPrefixContext } from "./AutomationIdPrefixContext";

const useAutomationIdPrefix = () => {
  const automationContext = useContext(AutomationIdPrefixContext);
  return automationContext;
};

export { useAutomationIdPrefix };
