import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./SearchBar.stories";

const { Standard } = composeStories(stories);

describe("SearchBar", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-search-bar-class";
    render(<Standard ctrCls={ctrCls} />);
    const rootElement = await screen.findByRole("region");
    expect(rootElement).toHaveClass(ctrCls);
  });

  test("value", async () => {
    const value = "searchbar-value";
    render(<Standard value={value} />);
    const input = await screen.findByRole("textbox");
    expect(input).toHaveValue(value);
  });

  test("name must be applied to the input element", async () => {
    const inputName = "search-bar-input-name";
    render(<Standard name={inputName} />);
    const inputElement = await screen.findByRole("textbox");
    expect(inputElement.name).toBe(inputName);
  });

  test("onChange must be invoked", async () => {
    const onChange = jest.fn();
    render(<Standard onChange={onChange} />);
    const inputElement = await screen.findByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "strawberry" } });
    expect(onChange).toHaveBeenCalled();
  });

  test("placeholder must be applied", async () => {
    const placeholder = "search-bar-placeholder";
    render(<Standard placeholder={placeholder} />);
    const inputElement = await screen.findByRole("textbox");
    expect(inputElement.placeholder).toBe(placeholder);
  });

  test("isDisabled must be applied", async () => {
    const isDisabled = true;
    render(<Standard isDisabled={isDisabled} />);
    const rootElement = await screen.findByRole("region");
    const inputElement = await screen.findByRole("textbox");
    expect(inputElement).toBeDisabled();
    expect(rootElement).toHaveClass("isDisabled");
  });

  test("onClear must be invoked", async () => {
    const onClear = jest.fn();
    render(<Standard value="strawberry" onClear={onClear} />);
    const clearButton = await screen.findAllByRole("button");
    fireEvent.click(clearButton[1]);
    expect(onClear).toHaveBeenCalled();
  });

  test("onSearch must be invoked", async () => {
    const onSearch = jest.fn();
    render(<Standard value="strawberry" onSearch={onSearch} />);
    const SearchButton = await screen.findAllByRole("button");
    fireEvent.click(SearchButton[0]);
    expect(onSearch).toHaveBeenCalled();
  });

  test("on enter Click onSearch must be invoked", async () => {
    const onSearch = jest.fn();
    render(<Standard onSearch={onSearch} />);
    const inputElement = await screen.findByRole("textbox");
    fireEvent.keyUp(inputElement, {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    expect(onSearch).toHaveBeenCalled();
  });

  test("onChangeDebounced must be invoked", async () => {
    const onChangeDebounced = jest.fn();
    const onChange = jest.fn();
    render(
      <Standard onChangeDebounced={onChangeDebounced} onChange={onChange} />
    );
    const inputElement = await screen.findByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "strawberry" } });
    await waitFor(() => expect(onChangeDebounced).toHaveBeenCalled(), {
      interval: 0,
    });
  });
});
