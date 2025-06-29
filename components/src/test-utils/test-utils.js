import { render, queries, within, screen } from "@testing-library/react";
import { AutomationIdPrefixProvider } from "../AutomationIdPrefix";
import { PortalDomProvider } from "../components/PortalDomProvider";
import PropTypes from "prop-types";
import * as customQueries from "./custom-queries";
import userEvent from "@testing-library/user-event";
import { DisprzLocalizer } from "../DisprzLocalizer";
import EN from "../../src/strings/en.json";
const userEventPro = userEvent.setup({
  advanceTimers: jest.advanceTimersByTime,
});

const allQueries = {
  ...queries,
  ...customQueries,
};

const CustomProviders = ({ children }) => {
  return (
    <AutomationIdPrefixProvider value="stories">
      <DisprzLocalizer
        lang={"en"}
        defaultTranslation={EN}
        clientIdentifier=""
        mfe=""
        terminologyInfoString={{
          en: [
            {
              itemIdentifier: "term_skill_short",
              itemName: "Skill",
              singularForm: "Skill",
              pluralForm: "Skills",
              examples: ["Courses"],
            },
          ],
        }}
      >
        <PortalDomProvider>{children}</PortalDomProvider>
      </DisprzLocalizer>
    </AutomationIdPrefixProvider>
  );
};

CustomProviders.propTypes = {
  children: PropTypes.node,
  isStandalone: PropTypes.bool,
};

const customScreen = within(document.body, allQueries, {
  debug: screen.debug,
  logTestingPlaygroundURL: screen.logTestingPlaygroundURL,
});
const customWithin = (element) => within(element, allQueries);

const customRender = (ui, options) =>
  render(ui, { wrapper: CustomProviders, queries: allQueries, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export {
  customRender as render,
  customScreen as screen,
  customWithin as within,
  userEventPro,
};
