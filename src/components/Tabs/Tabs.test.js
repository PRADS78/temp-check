import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Tabs.stories";

const { Standard } = composeStories(stories);
describe("Tabs", () => {
  const data = [
    {
      label: "Digital Tools",
      panel: () => <div>Digital Tools</div>,
    },
    {
      id: "functionalSkills",
      label: "Functional Skills",
      panel: () => <div>Functional Skills</div>,
      isDisabled: true,
    },
  ];

  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-tabs-class";
    render(<Standard ctrCls={ctrCls} />);
    const tablist = await screen.findByRole("tablist");
    expect(tablist).toHaveClass(ctrCls);
  });

  test("tab elements must be rendered", async () => {
    render(<Standard data={data} />);
    const tabs = await screen.findAllByRole("tab");
    expect(tabs.length).toBe(data.length);
  });

  test("defaultTabId must be slide to selected tab by default", async () => {
    render(<Standard data={data} defaultTabId="functionalSkills" />);
    const tabArrows = await screen.findAllByRole("tab");
    expect(tabArrows[1]).toHaveClass("activeTab");
  });

  test("onChangeTab must be invoked every time the active tab is changed", async () => {
    const onTabChange = jest.fn();
    render(<Standard onTabChange={onTabChange} />);
    const tabs = await screen.findAllByRole("tab");
    fireEvent.click(tabs[0]);
    expect(onTabChange).toHaveBeenCalled();
  });

  test("isDisabled must be applied to disabled tab", async () => {
    render(<Standard data={data} />);
    const tabs = await screen.findAllByRole("tab");
    expect(tabs[1]).toHaveClass("disabled");
  });

  test("isDisabled prop must be disable all the tabs", async () => {
    render(<Standard data={data} isDisabled={true} />);
    const tabs = await screen.findAllByRole("tab");
    expect(tabs[0]).toHaveClass("disabled");
    expect(tabs[1]).toHaveClass("disabled");
  });
});
