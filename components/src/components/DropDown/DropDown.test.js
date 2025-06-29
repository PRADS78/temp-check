import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./DropDown.stories";
import PropTypes from "prop-types";
import userEvent from "@testing-library/user-event";
import { KeyCode } from "../../Enums";

const {
  Standard,
  MultipleWithSearch,
  Grouped,
  WithLabel,
  GroupedMultiSelection,
  CustomizedSelectedLabel,
  DisabledSingleSelection,
  DisabledGroupedMultiSelection,
} = composeStories(stories);

describe("DropDown", () => {
  const oldScrollIntoView = Element.prototype.scrollIntoView;

  beforeAll(() => {
    Element.prototype.scrollIntoView = jest.fn();
  });

  afterAll(() => {
    Element.prototype.scrollIntoView = oldScrollIntoView;
  });

  describe("Single", () => {
    test("component must be rendered", async () => {
      render(<Standard />);
      const menu = await screen.findByRole("menu");
      expect(menu).toBeInTheDocument();
    });

    test("items for selection for the standard variant must be rendered", async () => {
      render(<Standard />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const items = screen.getAllByRole("option");
      expect(items.length).toBe(Standard.args.items.length);
    });

    test("label for the specified value prop must be rendered", async () => {
      const selectedItem = Standard.args.items[1];
      render(<Standard value={selectedItem.value} />);
      const placeholderElement = await screen.findByText(selectedItem.label);
      expect(placeholderElement).toBeInTheDocument();
    });

    test("must have the ctrCls prop in its classList", async () => {
      const customClass = "custom-drop-down-class";
      render(<Standard ctrCls={customClass} />);
      const component = await screen.findByRole("menu");
      expect(component).toHaveClass(customClass);
    });

    test("custom option template must be rendererd for the single select variant", async () => {
      const customOptionClass = "customOption";
      function CustomOption(props) {
        const { data } = props;
        const { label } = data;
        return (
          <div className={customOptionClass} role="listitem">
            <div>{label}</div>
          </div>
        );
      }
      CustomOption.propTypes = {
        data: PropTypes.any,
      };
      render(<Standard customOptionRenderer={CustomOption} />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const customOptionTemplate = screen.getAllByRole("listitem");
      expect(customOptionTemplate.length).toBe(Standard.args.items.length);
    });

    test("onChange function must be invoked when an option is clicked; the label must be updated", async () => {
      const selectedItemIndex = 0;
      const items = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
      ];
      const onChange = jest.fn();
      await render(<Standard onChange={onChange} items={items} />);
      const menu = screen.getByRole("menu");
      await userEvent.click(menu);

      const targetOption = screen.getAllByRole("option")[selectedItemIndex];
      await userEvent.click(targetOption);
      expect(onChange).toHaveBeenCalled();
    });

    test("placeholder text must be rendered; it must be replaced by selected option's label", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
      ];
      render(<Standard items={items} value={undefined} />);
      const placeholder = Standard.args.placeholder;
      const placeholderElement = await screen.findByText(placeholder);
      expect(placeholderElement).toBeInTheDocument();
      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);
      const targetOption = screen.getAllByRole("option")[2];
      await userEvent.click(targetOption);
      const elementsWithTargetOpLabel = screen.getAllByText(items[2].label);
      expect(elementsWithTargetOpLabel.length).toBe(1);
    });

    test("must not be clickable if disabled", async () => {
      const onChange = jest.fn();
      render(<Standard isDisabled={true} onChange={onChange} />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      expect(onChange).not.toHaveBeenCalled();
    });

    test("label must be rendered", async () => {
      const label = "Custom Label";
      render(<WithLabel label={label} />);
      const labelElement = await screen.findByText(label);
      expect(labelElement).toBeInTheDocument();
    });

    test("labelCtrCls must be applied", async () => {
      const labelCtrCls = "label-ctr-cls";
      const labelText = "label-text";
      render(<Standard label={labelText} labelCtrCls={labelCtrCls} />);
      const labelElement = await screen.findByRole("region");
      expect(labelElement).toHaveClass(labelCtrCls);
    });

    test("Selected label should be rendered for Single Selection", async () => {
      render(<CustomizedSelectedLabel />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const options = screen.getAllByRole("option");
      fireEvent.click(options[0]);
      screen.getByText("Choco");
    });

    test("Selected label should be rendered for Multiple Selection", async () => {
      render(<CustomizedSelectedLabel isMulti={true} isSearchable={false} />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const options = screen.getAllByRole("checkbox");
      fireEvent.click(options[0]);
      fireEvent.click(menu);
      const selectedChips = screen.getAllByRole("chip");
      expect(selectedChips[0]).toHaveTextContent("Choco");
    });

    test("items must be disabled for the single-select variant", async () => {
      const disabledItemIndex = 0;
      const onChange = jest.fn();
      render(<DisabledSingleSelection onChange={onChange} />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const disabledItem = screen.getAllByRole("option")[disabledItemIndex];
      fireEvent.click(disabledItem);
      expect(disabledItem).toHaveClass("disabled");
      expect(disabledItem).not.toHaveClass("selected");
      expect(onChange).not.toBeCalled();
    });

    test("after closing standard dropdown, filtered items and search text should be reset", async () => {
      const body = document.body;
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<Standard items={items} />);
      const arrowIcon = await screen.findByRole("button");
      await userEvent.click(arrowIcon);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Choco");
      expect(input).toHaveValue("Choco");
      const options = screen.getAllByRole("option");
      expect(options.length).toBe(1);
      await userEvent.click(body);

      await userEvent.click(arrowIcon);
      const revisitedInput = screen.getByRole("textbox");
      expect(revisitedInput).toHaveValue("");
      const revisitedOptions = screen.getAllByRole("option");
      expect(revisitedOptions.length).toBe(items.length);
    });

    test("dropdown combo box should be focused on tab key", async () => {
      render(<Standard />);
      await userEvent.keyboard("[Tab]");
      const inputPlaceholder = screen.getByRole("combobox");
      expect(inputPlaceholder).toHaveFocus();
    });

    test("dropdown should be opened during tab -> * key combo", async () => {
      const body = document.body;

      const resetFocus = async () => {
        await userEvent.click(body);
      };

      render(<Standard />);
      const menu = await screen.findByRole("menu");
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.SPACE}]`);
      expect(menu).toHaveClass("active");

      await resetFocus();

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(menu).toHaveClass("active");

      await resetFocus();

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(menu).toHaveClass("active");
    });

    test("dropdown should stay closed during tab -> * others key combo", async () => {
      const body = document.body;

      const resetFocus = async () => {
        await userEvent.click(body);
      };

      render(<Standard />);
      const menu = await screen.findByRole("menu");
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ENTER}]`);
      expect(menu).not.toHaveClass("active");

      await resetFocus();

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.END}]`);
      expect(menu).not.toHaveClass("active");
    });

    test("pressing ArrowDown should highlight the first option when no options are selected", async () => {
      render(<Standard />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowDown should highlight the next item when an item is already highlighted", async () => {
      render(<Standard />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowDown should highlight the next item when an item is selected by default", async () => {
      // Info: Currently when a item is selected by default, we still need to press ArrowDown for the first time
      // to move the interaction to the dropdown list. It should actually start from the selected item.

      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<Standard value="vanilla" items={items} />);

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[2]).toHaveClass("selected");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowUp should highlight the last option when no options are selected", async () => {
      render(<Standard />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[options.length - 1]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowUp should highlight the previous item when an item is already highlighted", async () => {
      render(<Standard />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowUp should highlight the previous item when an item is selected by default", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<Standard value="vanilla" items={items} />);

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[2]).toHaveClass("selected");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[1]).toHaveClass("highlightedItem");
    });

    test("pressing Enter should select the highlighted item", async () => {
      const onChange = jest.fn();
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<Standard onChange={onChange} items={items} />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ENTER}]`);

      expect(onChange).toHaveBeenCalledWith(items[0]);

      const inputPlaceholder = screen.getByRole("combobox");
      expect(inputPlaceholder).toHaveFocus();
    });

    test("pressing Tab should select and close the dropdown", async () => {
      const onChange = jest.fn();
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<Standard onChange={onChange} items={items} />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);

      expect(onChange).toHaveBeenCalledWith(items[0]);
      const inputPlaceholder = screen.getByRole("combobox");
      expect(inputPlaceholder).not.toHaveFocus();
    });

    test("pressing escape should close the dropdown", async () => {
      const onChange = jest.fn();
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<Standard onChange={onChange} items={items} />);
      const menu = await screen.findByRole("menu");
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ESCAPE}]`);

      expect(menu).not.toHaveClass("active");
    });

    test("pressing ArrowDown should not highlight beyond the last item", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<Standard items={items} />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[2]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[2]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowUp should not highlight beyond the first item", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<Standard items={items} />);

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("disabled item shouldn't be highlighted during keyboard navigation", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: true },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: true },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
          isDisabled: false,
        },
        {
          value: "chicken-fries",
          label: "Chicken Fries",
          isDisabled: true,
        },
      ];
      render(<Standard items={items} />);

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      // Validating the use case for first disabled item
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      // Validating the use case for disabled in-between
      expect(options[3]).toHaveClass("highlightedItem");

      // Validating the use case for last disabled item
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[3]).toHaveClass("highlightedItem");
    });

    test("first item should be highlighted during search and when no item is highlighted/selected", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
        },
        {
          value: "cookies",
          label: "Cookies",
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
        },
      ];
      render(<Standard items={items} />);
      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Chocolate");

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("highlight item shouldn't be changed after search when the item is highlighted/selected", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
        },
        {
          value: "cookies",
          label: "Cookies",
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
        },
      ];
      render(<Standard items={items} />);
      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.click(options[1]);

      expect(menu).not.toHaveClass("active");

      await userEvent.click(menu);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Chocolate");

      expect(options[1]).toHaveClass("highlightedItem");
    });

    test("keyboard navigation should be within the filtered items when filtered", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
        },
        {
          value: "cookies",
          label: "Cookies",
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
        },
      ];
      render(<Standard items={items} />);

      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Chocolate");

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      expect(options.length).toBe(2);

      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("keyboard navigation should not select anything when there are no items on the list", async () => {
      render(<Standard items={[]} />);

      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Chocolate");

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      expect(options.length).toBe(1);

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options.length).toBe(1);

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options.length).toBe(1);
    });

    test("keyboard navigation should not affect anything when all are disabled items", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
          isDisabled: true,
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
          isDisabled: true,
        },
        {
          value: "cookies",
          label: "Cookies",
          isDisabled: true,
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
          isDisabled: true,
        },
      ];
      render(<Standard items={items} />);

      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);

      options.forEach((option) => {
        expect(option).not.toHaveClass("highlightedItem");
      });
    });

    test("onMouseEnter and onMouseLeave should set the highlighted item accordingly", async () => {
      render(<Standard />);
      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.hover(options[0]);
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.hover(options[1]);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.hover(options[2]);
      expect(options[2]).toHaveClass("highlightedItem");

      await userEvent.unhover(options[2]);
      expect(options[2]).not.toHaveClass("highlightedItem");
    });
  });

  describe("Single and grouped", () => {
    test("items for selection for the multi-title variant must be rendered", async () => {
      render(<Grouped />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const items = screen.getAllByRole("menuitem");
      expect(items.length).toBe(Grouped.args.items.length);
    });

    test("option titles must be rendered if itemsTypeprop is multi-title", async () => {
      render(<Grouped />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const titles = Grouped.args.items
        .reduce((acc, curr) => {
          if (!acc.includes(curr.groupTitle)) {
            return [...acc, curr.groupTitle];
          } else {
            return acc;
          }
        }, [])
        .sort();
      const optionGroups = screen.getAllByRole("region");
      expect(optionGroups.length).toBe(titles.length);
    });
  });

  describe("Multiple", () => {
    test("items for selection for the multi-select variant must be rendered", async () => {
      render(<MultipleWithSearch />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const items = screen.getAllByRole("option");
      expect(items.length).toBe(MultipleWithSearch.args.items.length);
    });

    test("must have checkboxes for multi-select variant", async () => {
      render(<MultipleWithSearch />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes.length).toBe(MultipleWithSearch.args.items.length);
    });

    test("chip must be rendered for every selected item for the multi-select variant", async () => {
      const selectedIndices = [0, 1, 2];
      render(<MultipleWithSearch />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const options = screen.getAllByRole("checkbox");
      selectedIndices.forEach((index) => fireEvent.click(options[index]));
      const chips = screen.getAllByRole("chip");
      const filteredChips = chips.filter(
        (chip) => !chip.className.includes("app-icon-ctr")
      );
      expect(filteredChips.length).toBe(selectedIndices.length);
    });

    test("chip must be removed when remove is clicked", async () => {
      const selectedIndices = [0, 1, 2];
      render(<MultipleWithSearch />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const options = screen.getAllByRole("checkbox");
      selectedIndices.forEach((index) => fireEvent.click(options[index]));
      const chips = screen.getAllByRole("chip");
      fireEvent.click(chips[0]);
      const remainChips = screen.getAllByRole("chip");
      const filteredChips = remainChips.filter(
        (chip) => !chip.className.includes("app-icon-ctr")
      );
      expect(filteredChips.length).not.toBe(selectedIndices.length);
    });

    test("multiple options may be checked or selected for the multi-select variant", async () => {
      const selectedIndices = [1, 2];
      render(<MultipleWithSearch />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const options = screen.getAllByRole("checkbox");
      selectedIndices.forEach((index) => fireEvent.click(options[index]));
      const checked = options.filter((op) => op.checked);
      expect(selectedIndices.length).toBe(checked.length);
    });

    test("search item text field must only be rendered if it's expanded and isSearchable is `true`", () => {
      render(<MultipleWithSearch isSearchable={false} />);
      const searchField = screen.queryByRole("textbox");
      expect(searchField).not.toBeInTheDocument();
    });

    test("after closing multiple dropdown, filtered items and search text should be reset", async () => {
      const body = document.body;
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<MultipleWithSearch items={items} />);
      const arrowIcon = await screen.findByRole("button");
      await userEvent.click(arrowIcon);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Choco");
      expect(input).toHaveValue("Choco");
      const menuItems = screen.getAllByRole("option");
      expect(menuItems.length).toBe(1);
      await userEvent.click(body);

      await userEvent.click(arrowIcon);
      const revisitedInput = screen.getByRole("textbox");
      expect(revisitedInput).toHaveValue("");
      const revisitedMenuItems = screen.getAllByRole("option");
      expect(revisitedMenuItems.length).toBe(items.length);
    });

    test("dropdown combo box should be focused on tab key", async () => {
      render(<MultipleWithSearch />);
      await userEvent.keyboard("[Tab]");
      const inputPlaceholder = screen.getByRole("combobox");
      expect(inputPlaceholder).toHaveFocus();
    });

    test("dropdown should be opened during tab -> * key combo", async () => {
      const body = document.body;

      const resetFocus = async () => {
        await userEvent.click(body);
      };

      render(<MultipleWithSearch />);
      const menu = await screen.findByRole("menu");
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.SPACE}]`);
      expect(menu).toHaveClass("active");

      await resetFocus();

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(menu).toHaveClass("active");

      await resetFocus();

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(menu).toHaveClass("active");
    });

    test("dropdown should stay closed during tab -> * others key combo", async () => {
      const body = document.body;

      const resetFocus = async () => {
        await userEvent.click(body);
      };

      render(<MultipleWithSearch />);
      const menu = await screen.findByRole("menu");
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ENTER}]`);
      expect(menu).not.toHaveClass("active");

      await resetFocus();

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.END}]`);
      expect(menu).not.toHaveClass("active");
    });

    test("pressing ArrowDown should highlight the first option when no options are selected", async () => {
      render(<MultipleWithSearch />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowDown should highlight the next item when an item is already highlighted", async () => {
      render(<MultipleWithSearch />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowDown should highlight the next item when an item is selected by default", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<MultipleWithSearch value={["vanilla"]} items={items} />);

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[2]).toHaveClass("selected");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowUp should highlight the last option when no options are selected", async () => {
      render(<MultipleWithSearch />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[options.length - 1]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowUp should highlight the previous item when an item is already highlighted", async () => {
      render(<MultipleWithSearch />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowUp should highlight the previous item when an item is selected by default", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<MultipleWithSearch value={["vanilla"]} items={items} />);

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[2]).toHaveClass("selected");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[1]).toHaveClass("highlightedItem");
    });

    test("pressing Enter should toggle the highlighted item", async () => {
      const onChange = jest.fn();
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<MultipleWithSearch onChange={onChange} items={items} />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ENTER}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");
      expect(options[0]).toHaveClass("selected");

      expect(onChange).toHaveBeenCalled();

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ENTER}]`);
      expect(options[1]).toHaveClass("selected");

      expect(onChange).toHaveBeenCalled();
    });

    test.skip("pressing Tab should select and close the dropdown", async () => {
      const onChange = jest.fn();
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];

      render(<MultipleWithSearch onChange={onChange} items={items} />);
      const menu = screen.getByRole("menu");
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);

      // TODO: Check with another person, Dropdown is getting closed before the onChange is called
      expect(onChange).toHaveBeenCalled();

      expect(menu).not.toHaveClass("active");
    });

    test("pressing escape should close the dropdown", async () => {
      const onChange = jest.fn();
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<MultipleWithSearch onChange={onChange} items={items} />);
      const menu = await screen.findByRole("menu");
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ESCAPE}]`);

      expect(menu).not.toHaveClass("active");
    });

    test("pressing ArrowDown should not highlight beyond the last item", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<MultipleWithSearch items={items} />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[2]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[2]).toHaveClass("highlightedItem");
    });

    test("pressing ArrowUp should not highlight beyond the first item", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: false },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: false },
      ];
      render(<MultipleWithSearch items={items} />);

      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("disabled item shouldn't be highlighted during keyboard navigation", async () => {
      const items = [
        { value: "chocolate", label: "Chocolate", isDisabled: true },
        { value: "strawberry", label: "Strawberry", isDisabled: false },
        { value: "vanilla", label: "Vanilla", isDisabled: true },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
          isDisabled: false,
        },
        {
          value: "chicken-fries",
          label: "Chicken Fries",
          isDisabled: true,
        },
      ];
      render(<MultipleWithSearch items={items} />);
      await userEvent.keyboard(`[${KeyCode.TAB}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      // Validating the use case for first disabled item
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      // Validating the use case for disabled in-between
      expect(options[3]).toHaveClass("highlightedItem");

      // Validating the use case for last disabled item
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[3]).toHaveClass("highlightedItem");
    });

    test("first item should be highlighted during search and when no item is highlighted/selected", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
        },
        {
          value: "cookies",
          label: "Cookies",
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
        },
      ];
      render(<MultipleWithSearch items={items} />);
      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Chocolate");

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("highlight item shouldn't be changed after search when the item is highlighted/selected", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
        },
        {
          value: "cookies",
          label: "Cookies",
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
        },
      ];
      render(<MultipleWithSearch items={items} />);
      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.click(options[1]);

      // Closing the menu
      await userEvent.click(menu);

      // Opening the menu
      await userEvent.click(menu);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Chocolate");

      expect(options[1]).toHaveClass("highlightedItem");
    });

    test("keyboard navigation should be within the filtered items when filtered", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
        },
        {
          value: "cookies",
          label: "Cookies",
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
        },
      ];
      render(<MultipleWithSearch items={items} />);

      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Chocolate");

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      expect(options.length).toBe(2);

      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(options[0]).toHaveClass("highlightedItem");
    });

    test("keyboard navigation should not select anything when there are no items on the list", async () => {
      render(<MultipleWithSearch items={[]} />);

      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Chocolate");

      const listBox = screen.queryByRole("listbox");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);
      expect(listBox).not.toBeInTheDocument();

      const emptyText = screen.getByText("No items found");
      expect(emptyText).toBeInTheDocument();
    });

    test("keyboard navigation should not affect anything when all are disabled items", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
          isDisabled: true,
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
          isDisabled: true,
        },
        {
          value: "cookies",
          label: "Cookies",
          isDisabled: true,
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
          isDisabled: true,
        },
      ];
      render(<MultipleWithSearch items={items} />);

      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);
      await userEvent.keyboard(`[${KeyCode.ARROW_DOWN}]`);

      await userEvent.keyboard(`[${KeyCode.ARROW_UP}]`);

      options.forEach((option) => {
        expect(option).not.toHaveClass("highlightedItem");
      });
    });

    test("onMouseEnter and onMouseLeave should set the highlighted item accordingly", async () => {
      render(<MultipleWithSearch />);
      const menu = await screen.findByRole("menu");
      await userEvent.click(menu);

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.hover(options[0]);
      expect(options[0]).toHaveClass("highlightedItem");

      await userEvent.hover(options[1]);
      expect(options[1]).toHaveClass("highlightedItem");

      await userEvent.hover(options[2]);
      expect(options[2]).toHaveClass("highlightedItem");

      await userEvent.unhover(options[2]);
      expect(options[2]).not.toHaveClass("highlightedItem");
    });

    test("backspace should remove existing selected items when there is no text in the search field", async () => {
      const items = [
        {
          value: "chocolate",
          label: "Chocolate",
        },
        {
          value: "chocolate-ice-cream",
          label: "Chocolate Ice Cream",
        },
        {
          value: "cookies",
          label: "Cookies",
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
        },
      ];
      render(<MultipleWithSearch items={items} />);

      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);

      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Cookies");

      const listBox = screen.getByRole("listbox");
      const options = within(listBox).getAllByRole("option");

      await userEvent.click(within(options[0]).getByRole("checkbox"));
      await waitFor(() => expect(options[0]).toHaveClass("selected"), {
        timeout: 1000,
      });

      const chips = screen.getAllByRole("chip");
      expect(chips.length).toBe(1);

      await userEvent.keyboard(`[${KeyCode.BACKSPACE}]`);
      expect(chips.length).toBe(1);

      await userEvent.clear(input);

      await userEvent.keyboard(`[${KeyCode.BACKSPACE}]`);
      const requeriedChips = screen.queryAllByRole("chip");
      expect(requeriedChips.length).toBe(0);
    });
  });

  describe("Multiple and grouped", () => {
    test("Select All after filter should select all filtered options with existing selected options", async () => {
      const onChange = jest.fn();
      const items = [
        {
          value: "big-fish",
          label: "Big fish",
          groupTitle: "chicken",
        },
        {
          value: "coke",
          label: "Coke",
          groupTitle: "drinks",
        },
        {
          value: "ch'king",
          label: "Ch'King Sandwich",
          groupTitle: "chicken",
        },
        {
          value: "chicken-fries",
          label: "Chicken fries",
          groupTitle: "chicken",
        },
      ];
      render(<GroupedMultiSelection onChange={onChange} items={items} />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const options = screen.getAllByRole("checkbox");
      fireEvent.click(options[3]);
      fireEvent.click(menu);

      fireEvent.click(menu);
      const searchField = screen.getByRole("textbox");
      fireEvent.change(searchField, { target: { value: "c" } });
      const selectAll = screen.getByText("Select All");
      fireEvent.click(selectAll);
      const selectedChipsSecond = screen.getAllByRole("chip");
      console.log(selectedChipsSecond);
      expect(selectedChipsSecond.length).toBe(3);

      expect(onChange).toHaveBeenCalled();
    });

    test("items must be disabled for the group-multi-select variant", async () => {
      const disabledItemIndex = 1;
      const onChange = jest.fn();
      render(<DisabledGroupedMultiSelection onChange={onChange} />);
      const menu = await screen.findByRole("menu");
      fireEvent.click(menu);
      const disabledItem = screen.getAllByRole("region")[disabledItemIndex];
      const disabledItemCheckbox =
        screen.getAllByRole("checkbox")[disabledItemIndex];
      await userEvent.click(disabledItemCheckbox);
      expect(disabledItem).toHaveClass("disabled");
      expect(disabledItem).not.toHaveClass("selected");
      expect(onChange).not.toBeCalled();
    });

    test("after closing grouped multiple dropdown, filtered items and search text should be reset", async () => {
      const body = document.body;
      const items = [
        { value: "sundae-pie", label: "Sundae pie", groupTitle: "sweets" },
        { value: "oreo-shake", label: "Oreo shake", groupTitle: "sweets" },
        { value: "soft-serve", label: "Soft serve", groupTitle: "sweets" },

        { value: "sprite", label: "Sprite", groupTitle: "drinks" },
        { value: "coke", label: "Coke", groupTitle: "drinks" },
        { value: "barq's", label: "Barq's", groupTitle: "drinks" },

        { value: "ch'king", label: "Ch'King Sandwich", groupTitle: "chicken" },
        {
          value: "chicken-fries",
          label: "Chicken fries",
          groupTitle: "chicken",
        },
        { value: "big-fish", label: "Big fish", groupTitle: "chicken" },
      ];
      render(<GroupedMultiSelection items={items} />);
      const arrowIcon = await screen.findByRole("button");
      await userEvent.click(arrowIcon);
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "Sundae pie");
      expect(input).toHaveValue("Sundae pie");
      const menuItems = screen.getAllByRole("menuitem");
      expect(menuItems.length).toBe(1);
      await userEvent.click(body);

      await userEvent.click(arrowIcon);
      const revisitedInput = screen.getByRole("textbox");
      expect(revisitedInput).toHaveValue("");
      const revisitedMenuItems = screen.getAllByRole("menuitem");
      expect(revisitedMenuItems.length).toBe(items.length);
    });
  });
});
