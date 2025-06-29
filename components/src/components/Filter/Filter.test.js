import {
  render,
  screen,
  act,
  within,
  fireEvent,
  userEventPro,
} from "test-utils";
import { TableFilterTypes, FilterLocalizedBannerDuration } from "../../Enums";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Filter.stories";
import { waitFor } from "@testing-library/react";
import { patchTimeToEndOfDay } from "../../Utils";

const {
  Standard,
  WithPreSelectedItems,
  PaginatedListItems,
  OnDemandListItems,
  NonDiscreteApplyButton,
  DifferentTypeFilters,
  WithMandatoryItems,
} = composeStories(stories);

describe("Filter", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const items = {
    1: {
      id: 1,
      label: "Location",
      type: TableFilterTypes.LIST,
      isPinned: true,
      isMultiSelect: true,
      options: [
        {
          label: "Chennai",
          value: "chennai",
        },
      ],
    },
    2: {
      id: 2,
      label: "Designation",
      type: TableFilterTypes.LIST,
      isPinned: false,
      isMultiSelect: true,
      options: [
        {
          label: "Software Engineer",
          value: "software-engineer",
        },
      ],
    },
  };

  test("must render popper correctly", async () => {
    await act(
      async () => await render(<Standard {...Standard.args} items={items} />)
    );
    const container = screen.getByRole("region");
    expect(container).toBeInTheDocument();
  });

  test("must render list correctly", async () => {
    await act(
      async () => await render(<Standard {...Standard.args} items={items} />)
    );
    const container = screen.getByRole("region");
    const filterButtons = screen.getAllByRole("button").filter((button) => {
      return button.dataset.role === "filter-button";
    });
    fireEvent.click(filterButtons[0]);
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  test("must render list with subtype on demand correctly", async () => {
    await act(
      async () =>
        await render(<OnDemandListItems {...OnDemandListItems.args} />)
    );
    const container = screen.getByRole("region");
    const filterButtons = screen.getAllByRole("button").filter((button) => {
      return button.dataset.role === "filter-button";
    });
    fireEvent.click(filterButtons[0]);
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  test("must render list with subtype paginated list correctly", async () => {
    await act(
      async () =>
        await render(<PaginatedListItems {...PaginatedListItems.args} />)
    );
    const container = screen.getByRole("region");
    const filterButtons = screen.getAllByRole("button").filter((button) => {
      return button.dataset.role === "filter-button";
    });
    fireEvent.click(filterButtons[0]);
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(container).toBeInTheDocument();
  });

  test("must render date range correctly", async () => {
    await act(
      async () =>
        await render(
          <Standard
            {...Standard.args}
            items={{
              1: {
                id: 1,
                isPinned: true,
                label: "Joining Date",
                type: TableFilterTypes.DATE,
              },
            }}
          />
        )
    );
    const container = screen.getByRole("region");
    expect(container).toBeInTheDocument();
    const filterButtons = within(container)
      .getAllByRole("button")
      .filter((button) => {
        return button.dataset.role === "filter-button";
      });
    fireEvent.click(filterButtons[0]);
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
  });

  test("must render number range correctly", async () => {
    await act(
      async () =>
        await render(
          <Standard
            {...Standard.args}
            items={{
              1: {
                id: 1,
                isPinned: true,
                label: "Experience",
                type: TableFilterTypes.NUMBER,
                min: 0,
                max: 100,
              },
            }}
          />
        )
    );
    const container = screen.getByRole("region");
    expect(container).toBeInTheDocument();
    const filterButtons = screen.getAllByRole("button").filter((button) => {
      return button.dataset.role === "filter-button";
    });
    fireEvent.click(filterButtons[0]);
    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
  });

  test("must reflect number of pinned items", async () => {
    const pinnedItemsLength = Object.values(items).filter(
      (value) => value.isPinned
    ).length;
    await act(
      async () => await render(<Standard {...Standard.args} items={items} />)
    );
    const container = screen.getByRole("region");
    const buttons = within(container)
      .getAllByRole("button")
      .filter((button) => {
        return button.dataset.role === "filter-button";
      });
    expect(buttons.length).toBe(pinnedItemsLength);
  });

  test("must reflect number of mandatory items accurately", async () => {
    const expectedMandatoryItemsLength = 2;
    await act(
      async () =>
        await render(<WithMandatoryItems {...WithMandatoryItems.args} />)
    );
    const container = screen.getByRole("region");
    const buttons = within(container)
      .getAllByRole("button")
      .filter((button) => {
        return button.dataset.role === "filter-button";
      });
    expect(buttons.length).toBe(expectedMandatoryItemsLength);
    buttons.forEach((button) => {
      const span = within(button).getByTestId("mandatory-item");
      expect(span).toHaveClass("mandatoryItem");
    });
  });

  test("must render More button when unpinned items are available", async () => {
    await act(
      async () => await render(<Standard {...Standard.args} items={items} />)
    );
    const container = screen.getByRole("region");
    const moreButton = within(container)
      .getAllByRole("button")
      .filter((button) => {
        return (
          button.dataset.role !== "filter-button" &&
          button.textContent !== "Clear All"
        );
      });
    expect(moreButton.length).toBe(1);
    expect(moreButton[0]).toBeInTheDocument();
  });

  test("must not render More button when unpinned items are not available", async () => {
    await act(
      async () =>
        await render(
          <Standard
            {...Standard.args}
            items={{
              ...items,
              2: {
                ...items[2],
                isPinned: true,
              },
            }}
          />
        )
    );
    const container = screen.getByRole("region");
    const moreButton = within(container)
      .getAllByRole("button")
      .filter((button) => {
        return button.dataset.role !== "filter-button";
      });
    expect(moreButton.length).toBe(0);
  });

  test("must not render clear all button when selected items are not available", async () => {
    await act(
      async () => await render(<Standard {...Standard.args} items={items} />)
    );
    const container = screen.getByRole("region");
    const clearButton = within(container)
      .queryAllByRole("button")
      .filter((button) => {
        return button.textContent === "Clear All";
      });
    expect(clearButton.length).toBe(0);
  });

  test("must render clear all button when selected items are available", async () => {
    await act(
      async () =>
        await render(<WithPreSelectedItems {...WithPreSelectedItems.args} />)
    );
    const container = screen.getByRole("region");
    const clearButton = within(container)
      .queryAllByRole("button")
      .filter((button) => {
        return button.textContent === "Clear All";
      });
    expect(clearButton.length).toBe(1);
  });

  test("clear all button must clear all items  and show warning icon for mandatory item", async () => {
    await act(
      async () =>
        await render(<WithMandatoryItems {...WithMandatoryItems.args} />)
    );
    const container = screen.getByRole("region");
    const clearButton = within(container)
      .queryAllByRole("button")
      .filter((button) => {
        return button.textContent === "Clear All";
      });
    expect(clearButton.length).toBe(1);
    //expect badges and icons
    const badges = within(container).getAllByRole("status");
    expect(badges.length).toBe(1);
    const mandatoryWarningIcons = screen.getAllByDzUniqueId(
      "svgwarningfilled-1671119351781"
    );
    expect(mandatoryWarningIcons.length).toBe(1);
    await userEventPro.click(clearButton[0]);
    const badgesAfterClearAll = within(container).queryAllByRole("status");
    expect(badgesAfterClearAll.length).toBe(0);
    const mandatoryWarningIconsAfterClearAll = screen.getAllByDzUniqueId(
      "svgwarningfilled-1671119351781"
    );
    expect(mandatoryWarningIconsAfterClearAll.length).toBe(2);
  });

  test("new filter must be displayed when added from menu", async () => {
    await act(
      async () =>
        await render(
          <Standard
            {...Standard.args}
            items={{
              ...items,
              3: {
                id: 3,
                label: "Department",
                type: TableFilterTypes.LIST,
                isPinned: false,
                isMultiSelect: true,
                options: [
                  {
                    label: "Engineering",
                    value: "engineering",
                  },
                ],
              },
            }}
          />
        )
    );
    const container = screen.getByRole("region");
    const allButtons = within(container).getAllByRole("button");
    const initialFilterButtons = allButtons.filter((button) => {
      return button.dataset.role === "filter-button";
    });
    const moreButton = allButtons.filter((button) => {
      return button.dataset.role !== "filter-button";
    })[0];
    fireEvent.click(moreButton);
    const menu = screen.getByRole("menu");
    const menuItems = within(menu).getAllByRole("checkbox");
    fireEvent.click(menuItems[0]);
    const footer = screen.getAllByRole("region").filter((region) => {
      return region.dataset.role === "filter-footer";
    });
    const applyButton = within(footer[0]).getAllByRole("button")[1];
    fireEvent.click(applyButton);
    const allButtons1 = within(container).getAllByRole("button");
    const updatedFilterButtons = allButtons1.filter((button) => {
      return button.dataset.role === "filter-button";
    });
    expect(updatedFilterButtons.length).toBe(initialFilterButtons.length + 1);
  });

  test("new filter must be removed and moved into menu when close button is pressed", async () => {
    await act(
      async () => await render(<Standard {...Standard.args} items={items} />)
    );
    const container = screen.getByRole("region");
    const allButtons = within(container).getAllByRole("button");
    const initialFilterButtons = allButtons.filter((button) => {
      return button.dataset.role === "filter-button";
    });
    const moreButton = allButtons.filter((button) => {
      return button.dataset.role !== "filter-button";
    })[0];
    fireEvent.click(moreButton);
    const menu = screen.getByRole("menu");
    const menuItems = within(menu).getAllByRole("checkbox");
    fireEvent.click(menuItems[0]);
    const footer = screen.getAllByRole("region").filter((region) => {
      return region.dataset.role === "filter-footer";
    });
    const applyButton = within(footer[0]).getAllByRole("button")[1];
    fireEvent.click(applyButton);
    const updatedFilterButtons = within(container)
      .getAllByRole("button")
      .filter((button) => {
        return button.dataset.role === "filter-button";
      });
    expect(updatedFilterButtons.length).toBe(initialFilterButtons.length + 1);
    const recentlyAddedButton = within(container)
      .getAllByRole("button")
      .filter((button) => {
        return button.dataset.role === "filter-button";
      })[1];
    const closeButton = within(recentlyAddedButton).getByRole("button");
    fireEvent.click(closeButton);
    const updatedFilterButtonsAgain = within(container)
      .getAllByRole("button")
      .filter((button) => {
        return button.dataset.role === "filter-button";
      });
    expect(updatedFilterButtonsAgain.length).toBe(initialFilterButtons.length);
  });

  describe("Discrete apply button", () => {
    test("on outside click more options menu must be closed", async () => {
      await act(
        async () => await render(<Standard {...Standard.args} items={items} />)
      );
      const container = screen.getByRole("region");
      const allButtons = within(container).getAllByRole("button");
      const moreButton = allButtons.filter((button) => {
        return button.dataset.role !== "filter-button";
      })[0];
      fireEvent.click(moreButton);
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
      fireEvent.click(document);
      expect(menu).not.toBeInTheDocument();
    });

    test("onApply should be invoked ", async () => {
      const onApply = jest.fn();
      await act(
        async () =>
          await render(
            <Standard {...Standard.args} items={items} onApply={onApply} />
          )
      );
      const container = screen.getByRole("region");
      const filterButton = within(container)
        .getAllByRole("button")
        .filter((button) => {
          return button.dataset.role === "filter-button";
        })[0];
      fireEvent.click(filterButton);
      const menu = screen.getByRole("menu");
      const menuItems = within(menu).getAllByRole("checkbox");
      fireEvent.click(menuItems[0]);
      const footer = screen.getAllByRole("region").filter((region) => {
        return region.dataset.role === "filter-footer";
      });
      const applyButton = within(footer[0]).getAllByRole("button")[1];
      fireEvent.click(applyButton);
      expect(onApply).toBeCalled();
    });

    test("onCancel must be invoked", async () => {
      const onCancel = jest.fn();
      await act(
        async () =>
          await render(
            <Standard {...Standard.args} items={items} onCancel={onCancel} />
          )
      );
      const container = screen.getByRole("region");
      const filterButton = within(container)
        .getAllByRole("button")
        .filter((button) => {
          return button.dataset.role === "filter-button";
        })[0];
      fireEvent.click(filterButton);
      const footer = screen.getAllByRole("region").filter((region) => {
        return region.dataset.role === "filter-footer";
      });
      const cancelButton = within(footer[0]).getAllByRole("button")[0];
      fireEvent.click(cancelButton);
      expect(onCancel).toBeCalled();
    });

    test("badge must be displayed when filter is applied", async () => {
      await act(
        async () => await render(<Standard {...Standard.args} items={items} />)
      );
      const container = screen.getByRole("region");
      const filterButton = within(container)
        .getAllByRole("button")
        .filter((button) => {
          return button.dataset.role === "filter-button";
        })[0];
      fireEvent.click(filterButton);
      const menu = screen.getByRole("menu");
      const menuItems = within(menu).getAllByRole("checkbox");
      fireEvent.click(menuItems[0]);
      const footer = screen.getAllByRole("region").filter((region) => {
        return region.dataset.role === "filter-footer";
      });
      const applyButton = within(footer[0]).getAllByRole("button")[1];
      fireEvent.click(applyButton);
      const badge = within(container).getByRole("status");
      expect(badge).toBeInTheDocument();
    });

    test("badges value must be displayed according to filter type", async () => {
      await act(
        async () =>
          await render(
            <WithPreSelectedItems
              {...WithPreSelectedItems.args}
              selectedItems={{
                1: {
                  chennai: true,
                  mumbai: true,
                },
                3: [new Date("2022-12-01"), new Date("2023-03-30")],
                4: [5000, 10000],
              }}
            />
          )
      );
      const container = screen.getByRole("region");
      const badges = within(container).getAllByRole("status");
      console.log("badges", badges[0].textContent);
      expect(badges[0]).toHaveTextContent("2");
      expect(badges[1]).toHaveTextContent("1");
      expect(badges[2]).toHaveTextContent("1");
    });
  });

  describe("Non discrete apply button", () => {
    test("badge must be displayed when clicked outside", async () => {
      await act(async () => await render(<NonDiscreteApplyButton />));
      const container = screen.getByRole("region");
      const filterButton = within(container)
        .getAllByRole("button")
        .filter((button) => {
          return button.dataset.role === "filter-button";
        })[0];
      await userEventPro.click(filterButton);
      const menu = screen.getByRole("menu");
      const options = within(menu).getAllByRole("checkbox");
      await userEventPro.click(options[0]);

      await userEventPro.click(document.body);

      const badge = within(container).getByRole("status");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("1");

      const applyButton = screen.getByDzUniqueId(
        "stories-1694414059759-button"
      );
      await userEventPro.click(applyButton);
    });

    test("badge must be displayed after applying", async () => {
      await act(async () => await render(<NonDiscreteApplyButton />));
      const container = screen.getByRole("region");
      const filterButton = within(container)
        .getAllByRole("button")
        .filter((button) => {
          return button.dataset.role === "filter-button";
        })[0];
      await userEventPro.click(filterButton);
      const menu = screen.getByRole("menu");
      const options = within(menu).getAllByRole("checkbox");
      await userEventPro.click(options[0]);

      await userEventPro.click(document.body);

      const applyButton = screen.getByDzUniqueId(
        "stories-1694414059759-button"
      );
      await userEventPro.click(applyButton);

      const badge = within(container).getByRole("status");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent("1");
    });

    test("filter info button, tooltip should be displayed when isNonDiscreteApplyButton is set and filters count is more than limit ", async () => {
      const limitCount = 1;
      await act(
        async () =>
          await render(<NonDiscreteApplyButton limitCount={limitCount} />)
      );
      const container = screen.getByRole("region");
      const buttons = within(container).getAllByRole("button");
      const infoButton = buttons.filter((button) => {
        return button.dataset.role === "tooltip-trigger";
      })[0];
      expect(infoButton).toHaveClass("limitExceededTooltipIcon");
      await userEventPro.hover(infoButton);
      const tooltip = screen.getAllByRole("tooltip")[0];
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(
        `You have the flexibility to choose up to ${limitCount} filter`
      );
      const applyButton = screen.getAllByDzUniqueId(
        "stories-1694414059759-button"
      );
      expect(applyButton[0]).toBeDisabled();
    });

    test("tooltip should not be visible when filters count is less than limit", async () => {
      const limitCount = 4;
      await act(
        async () =>
          await render(<NonDiscreteApplyButton limitCount={limitCount} />)
      );
      const container = screen.getByRole("region");
      const buttons = within(container).getAllByRole("button");
      const infoButton = buttons.filter((button) => {
        return button.dataset.role === "tooltip-trigger";
      })[0];
      expect(infoButton).toBe(undefined);
    });

    test("tooltip should show accurate message when filters more than limit with multi select enabled in table view", async () => {
      const limitCount = 1;
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              temp_isTableView={true}
              limitCount={limitCount}
            />
          )
      );
      const container = screen.getByRole("region");
      const buttons = within(container).getAllByRole("button");
      const infoButton = buttons.filter((button) => {
        return button.dataset.role === "tooltip-trigger";
      })[0];
      expect(infoButton).toHaveClass("limitExceededTooltipIcon");
      await userEventPro.hover(infoButton);
      const tooltip = screen.getAllByRole("tooltip")[0];
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(
        `You have the flexibility to choose up to ${limitCount} filter and 5 options per filter`
      );
    });

    test("tooltip should show accurate message when filters more than limit with multi select disabled in table view", async () => {
      const limitCount = 1;
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              items={{
                1: {
                  ...NonDiscreteApplyButton.args.items[1],
                  isMultiSelect: false,
                },
                2: {
                  ...NonDiscreteApplyButton.args.items[2],
                  isMultiSelect: false,
                },
              }}
              temp_isTableView={true}
              limitCount={limitCount}
            />
          )
      );
      const container = screen.getByRole("region");
      const buttons = within(container).getAllByRole("button");
      const infoButton = buttons.filter((button) => {
        return button.dataset.role === "tooltip-trigger";
      })[0];
      expect(infoButton).toHaveClass("limitExceededTooltipIcon");
      await userEventPro.hover(infoButton);
      const tooltip = screen.getAllByRole("tooltip")[0];
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(
        `You have the flexibility to choose up to ${limitCount} filter`
      );
    });

    test("tooltip should show accurate message when filters less than limit but multi select enabled in table view", async () => {
      const limitCount = 4;
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              temp_isTableView={true}
              limitCount={limitCount}
            />
          )
      );
      const container = screen.getByRole("region");
      const buttons = within(container).getAllByRole("button");
      const infoButton = buttons.filter((button) => {
        return button.dataset.role === "tooltip-trigger";
      })[0];
      expect(infoButton).toHaveClass("limitExceededTooltipIcon");
      await userEventPro.hover(infoButton);
      const tooltip = screen.getAllByRole("tooltip")[0];
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(
        `You have the flexibility to choose up to 5 options per filter`
      );
    });

    test("tooltip should show accurate message when filters less than limit and multi select disabled in table view", async () => {
      const limitCount = 4;
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              items={{
                1: {
                  ...NonDiscreteApplyButton.args.items[1],
                  isMultiSelect: false,
                },
                2: {
                  ...NonDiscreteApplyButton.args.items[2],
                  isMultiSelect: false,
                },
              }}
              temp_isTableView={true}
              limitCount={limitCount}
            />
          )
      );
      const container = screen.getByRole("region");
      const buttons = within(container).getAllByRole("button");
      const infoButton = buttons.filter((button) => {
        return button.dataset.role === "tooltip-trigger";
      })[0];
      expect(infoButton).toBe(undefined);
    });

    test("apply button should not be displayed when isNonDiscreteApplyButton is not set", async () => {
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton isNonDiscreteApplyButton={false} />
          )
      );
      const applyButton = screen.queryAllByDzUniqueId(
        "stories-1694414059759-button"
      );
      expect(applyButton[0]).toBeUndefined();
    });

    test("apply button should be enabled when filter value changes", async () => {
      await act(async () => await render(<NonDiscreteApplyButton />));

      const body = document.body;
      const filterButtons = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "filter-button";
      });
      await userEventPro.click(filterButtons[0]);
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
      const options = within(menu).getAllByRole("checkbox");
      await userEventPro.click(options[0]);
      await userEventPro.click(body);
      const applyButton = screen.queryAllByDzUniqueId(
        "stories-1694414059759-button"
      );
      expect(applyButton[0]).toBeInTheDocument();
      expect(applyButton[0]).toBeEnabled();
    });

    test("apply button should be disabled when list filter value doesn't change", async () => {
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              selectedItems={{
                1: {
                  chennai: true,
                  mumbai: true,
                },
              }}
            />
          )
      );

      const filterButtons = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "filter-button";
      });
      const body = document.body;
      await userEventPro.click(filterButtons[0]);
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
      const options = within(menu).getAllByRole("checkbox");
      await userEventPro.click(options[0]);
      await userEventPro.click(options[0]);
      await userEventPro.click(body);
      const applyButton = screen.queryAllByDzUniqueId(
        "stories-1694414059759-button"
      );
      expect(applyButton[0]).toBeInTheDocument();
      expect(applyButton[0]).toBeDisabled();
    });

    test("apply button should only enable when mandatory items are selected", async () => {
      await act(
        async () =>
          await render(<WithMandatoryItems {...WithMandatoryItems.args} />)
      );
      const body = document.body;
      const filterButtons = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "filter-button";
      });
      await userEventPro.click(filterButtons[0]);
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
      const options = within(menu).getAllByRole("checkbox");
      await userEventPro.click(options[2]);
      await userEventPro.click(body);
      const applyButton = screen.queryAllByDzUniqueId(
        "stories-1694414059759-button"
      );
      expect(applyButton[0]).toBeInTheDocument();
      expect(applyButton[0]).toBeDisabled();

      await userEventPro.click(filterButtons[1]);
      const rangeMenu = screen.getByRole("menu");
      expect(rangeMenu).toBeInTheDocument();

      const minTextBox = within(rangeMenu).getAllByRole("textbox")[0];
      const maxTextBox = within(rangeMenu).getAllByRole("textbox")[1];

      await userEventPro.type(minTextBox, "1");
      await userEventPro.type(maxTextBox, "13");

      await userEventPro.click(body);

      const applyButtonAfterMandatorySelection = screen.queryAllByDzUniqueId(
        "stories-1694414059759-button"
      );
      expect(applyButtonAfterMandatorySelection[0]).toBeInTheDocument();
      expect(applyButtonAfterMandatorySelection[0]).toBeEnabled();
    });

    test("apply button should be disabled when date range filter value doesn't change", async () => {
      const today = new Date();
      let tomorrow = new Date(new Date().setDate(today.getDate() + 1));
      today.setHours(0, 0, 0, 0);
      tomorrow = patchTimeToEndOfDay(tomorrow);

      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              {...DifferentTypeFilters.args}
              items={{
                ...DifferentTypeFilters.args.items,
                3: {
                  id: 3,
                  isPinned: true,
                  label: "Joining Date",
                  type: TableFilterTypes.DATE,
                },
              }}
              selectedItems={{
                3: [today, tomorrow],
              }}
            />
          )
      );

      const filterButtons = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "filter-button";
      });
      const body = document.body;
      await userEventPro.click(filterButtons[1]);
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      // TODO: Hardcoding dates every two months, find alternative
      const startDate = screen.getAllByText(today.getDate())[0];
      let endDates = screen.getAllByText(tomorrow.getDate());
      const endDate = endDates[0];

      await userEventPro.click(startDate);
      await userEventPro.click(endDate);

      await userEventPro.click(body);

      const applyButton = screen.queryAllByDzUniqueId(
        "stories-1694414059759-button"
      );
      expect(applyButton[0]).toBeInTheDocument();
      expect(applyButton[0]).toBeDisabled();
    });

    test("apply button should be disabled when range filter value doesn't change", async () => {
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              {...DifferentTypeFilters.args}
              items={{
                ...DifferentTypeFilters.args.items,
                4: {
                  id: 4,
                  isPinned: true,
                  label: "Salary",
                  type: TableFilterTypes.NUMBER,
                  min: 0,
                  max: 100000,
                },
              }}
              selectedItems={{
                4: [5000, 10000],
              }}
            />
          )
      );

      const filterButtons = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "filter-button";
      });
      const body = document.body;
      await userEventPro.click(filterButtons[2]);
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();

      const minTextBox = within(menu).getAllByRole("textbox")[0];
      const maxTextBox = within(menu).getAllByRole("textbox")[1];

      await userEventPro.type(minTextBox, "5000");
      await userEventPro.type(maxTextBox, "10000");

      await userEventPro.click(body);

      const applyButton = screen.queryAllByDzUniqueId(
        "stories-1694414059759-button"
      );
      expect(applyButton[0]).toBeInTheDocument();
      expect(applyButton[0]).toBeDisabled();
    });

    test("list filter should restrict from selecting when limit count is crossed and show a alert dialog", async () => {
      const limitCount = 1;
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              items={{
                ...Standard.args.items,
                2: {
                  id: 2,
                  label: "Department",
                  type: TableFilterTypes.LIST,
                  isPinned: true,
                  isMultiSelect: true,
                  options: [
                    {
                      label: "CSE",
                      value: "cse",
                    },
                  ],
                },
              }}
              selectedItems={{
                1: {
                  chennai: true,
                  mumbai: true,
                },
              }}
              limitCount={limitCount}
            />
          )
      );
      const filterButtons = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "filter-button";
      });
      await userEventPro.click(filterButtons[1]);
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
      const options = within(menu).getAllByRole("checkbox");
      await userEventPro.click(options[0]);
      expect(options[0]).not.toBeChecked();

      const alertDialog = await screen.findByRole("alertdialog");
      expect(alertDialog).toBeInTheDocument();

      expect(alertDialog).toHaveTextContent(
        `Please narrow down your search by selecting up to ${limitCount} filter`
      );
      expect(alertDialog).toHaveClass("active");
      await waitFor(() => expect(alertDialog).not.toHaveClass("active"), {
        timeout: FilterLocalizedBannerDuration.FILTER_LIMIT + 1,
      });
    });

    test("selecting date range filter shouldn't be allowed when limit count is crossed and show a alert dialog", async () => {
      const limitCount = 1;
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              items={{
                ...Standard.args.items,
                3: {
                  id: 3,
                  isPinned: true,
                  label: "Joining Date",
                  type: TableFilterTypes.DATE,
                  minDate: new Date("2023-12-01"),
                  maxDate: new Date("2024-08-30"),
                },
              }}
              selectedItems={{
                1: {
                  chennai: true,
                  mumbai: true,
                },
              }}
              limitCount={limitCount}
            />
          )
      );
      const filterButtons = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "filter-button";
      });
      await userEventPro.click(filterButtons[1]);
      const menu = await screen.findByRole("menu");
      expect(menu).toBeInTheDocument();

      const today = new Date();
      const tomorrow = new Date(new Date().setDate(today.getDate() + 1));

      const isDifferentMonth = today.getMonth() !== tomorrow.getMonth();

      const startDate = screen.getAllByText(today.getDate()).filter((date) => {
        return !date.className.includes("react-datepicker__day--outside-month"); // TODO: Find a better way to do this
      })[1];
      let endDates = screen.getAllByText(tomorrow.getDate()).filter((date) => {
        return !date.className.includes("react-datepicker__day--outside-month"); // TODO: Find a better way to do this
      });
      const endDate = isDifferentMonth ? endDates[1] : endDates[0];
      await userEventPro.click(startDate);
      await waitFor(() =>
        expect(startDate).not.toHaveClass("react-datepicker__day--range-start")
      );
      await userEventPro.click(endDate);
      await waitFor(() =>
        expect(endDate).not.toHaveClass("react-datepicker__day--range-start")
      );

      const alertDialog = await screen.findByRole("alertdialog");
      expect(alertDialog).toBeInTheDocument();

      await waitFor(() => expect(alertDialog).toHaveClass("active"));
      await waitFor(() => expect(alertDialog).not.toHaveClass("active"), {
        timeout: FilterLocalizedBannerDuration.FILTER_LIMIT + 1,
      });
    });

    test("typing range shouldn't be allowed when limit count is crossed and show a alert dialog", async () => {
      const limitCount = 1;
      await act(
        async () =>
          await render(
            <NonDiscreteApplyButton
              items={{
                ...Standard.args.items,
                4: {
                  id: 4,
                  isPinned: true,
                  label: "Salary",
                  type: TableFilterTypes.NUMBER,
                  min: 0,
                  max: 100000,
                },
              }}
              selectedItems={{
                1: {
                  chennai: true,
                  mumbai: true,
                },
              }}
              limitCount={limitCount}
            />
          )
      );
      const filterButtons = screen.getAllByRole("button").filter((button) => {
        return button.dataset.role === "filter-button";
      });
      await userEventPro.click(filterButtons[1]);
      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
      const minTextBox = within(menu).getAllByRole("textbox")[0];
      const maxTextBox = within(menu).getAllByRole("textbox")[1];
      await userEventPro.type(minTextBox, "10");
      expect(minTextBox).toHaveValue(null);
      await userEventPro.type(maxTextBox, "99", { delay: 100 });
      expect(minTextBox).toHaveValue(null);

      const alertDialog = await screen.findByRole("alertdialog");
      expect(alertDialog).toBeInTheDocument();

      expect(alertDialog).toHaveTextContent(
        `Please narrow down your search by selecting up to ${limitCount} filter`
      );
      expect(alertDialog).toHaveClass("active");
      await waitFor(() => expect(alertDialog).not.toHaveClass("active"), {
        timeout: FilterLocalizedBannerDuration.FILTER_LIMIT + 1,
      });
    });
  });
});
