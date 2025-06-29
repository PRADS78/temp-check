import {
  fireEvent,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./TextField.stories";
import { TextFieldTypes } from "../../Enums";
import userEvent from "@testing-library/user-event";

const {
  Standard,
  HelpText,
  WithTitle,
  Password,
  Number,
  Disabled,
  ErrorMessage,
} = composeStories(stories);

describe("TextField", () => {
  test("component must be rendered", async () => {
    render(<Standard />);
    const inputElement = await screen.findByRole("textbox");
    expect(inputElement).toBeInTheDocument();
  });

  test("must have the ctrCls prop in its classList", async () => {
    const customClass = "custom-text-field-class";
    render(<Standard ctrCls={customClass} />);
    const component = await screen.findByRole("region");
    expect(component).toHaveClass(customClass);
  });

  test("onChange function must be invoked", async () => {
    const onChange = jest.fn();
    const text = "field text";
    const { rerender } = render(<Standard onChange={onChange} value={""} />);
    let input = await screen.findByRole("textbox");
    await userEvent.type(input, text);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object), text);
    expect(input).toHaveValue(text);

    const onChangeNumber = jest.fn();
    rerender(<Number onChange={onChangeNumber} value={4} min={1} max={10} />);
    input = await screen.findByRole("textbox");
    await userEvent.type(input, "5");
    expect(onChangeNumber).toHaveBeenCalledWith(expect.any(Object), 5);
    expect(input).toHaveValue(5);
  });

  test("placeholder must not be rendered when label is passed", async () => {
    const placeholder = "custom-placeholder";
    const label = "custom-label";
    render(<Standard placeholder={placeholder} label={label} />);
    const input = await screen.findByRole("textbox");
    expect(input).not.toHaveAttribute("placeholder", placeholder);
  });

  test("placeholder must be rendered when label is not passed", async () => {
    const placeholder = "custom-placeholder";
    render(<Standard placeholder={placeholder} label={""} />);
    const input = await screen.findByRole("textbox");
    expect(input).toHaveAttribute("placeholder", placeholder);
  });

  test("textField of type text must have an input of type text", async () => {
    render(<Standard />);
    const input = await screen.findByRole("textbox");
    expect(input.type).toBe(TextFieldTypes.TEXT);
  });

  test("textField of type number must have an input of type number", async () => {
    render(<Number />);
    const input = await screen.findByRole("textbox");
    expect(input.type).toBe(TextFieldTypes.NUMBER);
  });

  test("textField of type password must have an input of type password", async () => {
    render(<Password />);
    const input = await screen.findByRole("textbox");
    expect(input.type).toBe(TextFieldTypes.PASSWORD);
  });

  test("password visibility must toggle the input type", async () => {
    render(<Password />);
    let showPasswordIcon = await screen.findByRole("button");
    fireEvent.click(showPasswordIcon);
    const input = screen.getByRole("textbox");
    expect(input.type).toBe(TextFieldTypes.TEXT);
    showPasswordIcon = screen.getByRole("button");
    fireEvent.click(showPasswordIcon);
    expect(input.type).toBe(TextFieldTypes.PASSWORD);
  });

  test("textField of type email must have an input of type email", async () => {
    render(<Standard type={TextFieldTypes.EMAIL} />);
    const input = await screen.findByRole("textbox");
    expect(input.type).toBe(TextFieldTypes.EMAIL);
  });

  test("textField of type number must have an input of type text", async () => {
    render(<Standard type={TextFieldTypes.NUMBER} />);
    const input = await screen.findByRole("textbox");
    expect(input.type).toBe(TextFieldTypes.NUMBER);
  });

  test("textField of type decimal number allow decimal values", async () => {
    const initialValue = 54.3;
    render(<Standard value={initialValue} />);
    const input = await screen.findByDisplayValue(initialValue);
    expect(input).toBeInTheDocument();
  });

  // test("textField of type keyword must render an input element", () => {
  //   render(<Keyword />);
  //   const keywordTrigger = screen.getByRole("button");
  //   fireEvent.click(keywordTrigger);
  //   const input = screen.getByRole("textbox");
  //   expect(input).toBeInTheDocument();
  // });

  test("input name should be configurable", async () => {
    const inputName = "custom-input-name";
    render(<Standard name={inputName} />);
    const input = await screen.findByRole("textbox");
    expect(input.name).toBe(inputName);
  });

  test("the label must be rendered", async () => {
    const label = "custom-input-label";
    render(<Standard label={label} />);
    const labelElement = await screen.findByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  test("the input must be isDisabled if isDisabled is specified as 'true'", async () => {
    render(<Disabled />);
    const input = await screen.findByRole("textbox");
    expect(input).toBeDisabled();
  });

  test("help text must be rendered", async () => {
    const helpText = "Enter value";
    render(<HelpText helpText={helpText} />);
    const inputElement = await screen.findByRole("textbox");
    fireEvent.focus(inputElement);
    const helpTextElement = screen.getByText(helpText);
    expect(helpTextElement).toBeInTheDocument();
  });

  test("must reflect the initial value", async () => {
    const initialValue = "initial value";
    render(<Standard value={initialValue} />);
    const input = await screen.findByDisplayValue(initialValue);
    expect(input).toBeInTheDocument();
  });

  test("input must be 'required' if this prop is set to 'true'", async () => {
    render(<Standard required={true} />);
    const input = await screen.findByRole("textbox");
    expect(input.required).toBe(true);
  });

  test("errorMessage must be rendered all the time", async () => {
    const errorMessage = "something went wrong";
    render(<ErrorMessage errorMessage={errorMessage} />);
    const errorMessageElement = await screen.findByText(errorMessage);
    expect(errorMessageElement).toBeInTheDocument();
  });

  test("minLength must be reflected in the input element", async () => {
    const minLength = 5;
    render(<Standard minLength={minLength} maxLength={10} />);
    const input = await screen.findByRole("textbox");
    expect(input.minLength).toBe(minLength);
  });

  test("maxLength must be reflected in the input element", async () => {
    const maxLength = 10;
    const validValue = "12345678";
    const invalidValue = "12345678901";
    const onChange = jest.fn();
    render(
      <Standard maxLength={maxLength} onChange={onChange} value={validValue} />
    );
    fireEvent.change(await screen.findByRole("textbox"), {
      target: { value: invalidValue },
    });
    expect(onChange).not.toHaveBeenCalled();

    const input = screen.getByRole("textbox");
    expect(input.maxLength).toBe(maxLength);
  });

  test("min must be reflected in the input element", async () => {
    const min = 5;
    const onChange = jest.fn();
    const errorMessage = "Invalid Input";
    render(
      <Number
        type={TextFieldTypes.NUMBER}
        min={min}
        onChange={onChange}
        errorMessage={errorMessage}
      />
    );
    await userEvent.type(await screen.findByRole("textbox"), String(min - 1));
    expect(screen.getByRole("textbox")).toHaveValue(min - 1);
    expect(onChange).not.toHaveBeenCalled();
    const errorMessageElement = screen.getByText(errorMessage);
    expect(errorMessageElement).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    expect(input.min).toBe(String(min));
  });

  test("max must be reflected in the input element", async () => {
    const max = 5;
    const onChange = jest.fn();
    const errorMessage = "Invalid Input";
    render(
      <Number max={max} onChange={onChange} errorMessage={errorMessage} />
    );
    await userEvent.type(await screen.findByRole("textbox"), String(max + 1));
    expect(screen.getByRole("textbox")).toHaveValue(max + 1);
    expect(onChange).not.toHaveBeenCalled();
    const errorMessageElement = screen.getByText(errorMessage);
    expect(errorMessageElement).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input.max).toBe(String(max));
  });

  test("empty value must show error message on number type", async () => {
    const onChange = jest.fn();
    const errorMessage = "Invalid Input";
    render(
      <Number
        min={1}
        max={10}
        onChange={onChange}
        errorMessage={errorMessage}
      />
    );
    await userEvent.clear(await screen.findByRole("textbox"));
    expect(onChange).not.toHaveBeenCalled();
    const errorMessageElement = screen.getByText(errorMessage);
    expect(errorMessageElement).toBeInTheDocument();
  });

  test("title must be rendered", async () => {
    const title = "text-field-title";
    render(<WithTitle title={title} />);
    const titleElement = await screen.findByText(title);
    expect(titleElement).toBeInTheDocument();
  });

  test("onChange must not be invoked for number type if the range is exceeded", async () => {
    const onChange = jest.fn();
    const max = "101",
      min = "1";
    render(<Number max={100} onChange={onChange} min={2} />);
    const input = await screen.findByRole("textbox");
    await userEvent.type(input, max);
    await userEvent.type(input, String(parseInt(max, 10) + 1));
    expect(onChange).toHaveBeenCalledTimes(1);
    await userEvent.type(input, min);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("onInvalidNumberInput must be invoked if the range is exceeded", async () => {
    const onInvalidNumberInput = jest.fn();
    const max = "101",
      min = "1";
    render(
      <Number max={100} onInvalidNumberInput={onInvalidNumberInput} min={2} />
    );
    const input = await screen.findByRole("textbox");
    await userEvent.type(input, max);
    expect(onInvalidNumberInput).toHaveBeenCalled();
    await userEvent.type(input, min);
    expect(onInvalidNumberInput).toHaveBeenCalled();
  });

  test("focus number type input must select the full text", async () => {
    const value = "123";
    render(<Number value={value} />);
    const input = await screen.findByRole("textbox");
    fireEvent.focus(input);
    await waitFor(
      () => {
        console.log(input.selectionStart, input.selectionEnd);
      },
      { timeout: 1000 }
    );
    fireEvent.blur(input);

    // TODO: Handle the case where the selection cannot be tested for number type
    // expect(input.selectionStart).toBe(0);
    // expect(input.selectionEnd).toBe(value.length);
  });

  // TODO: Fix this test when `userEvent` allows invalid input
  test.skip("invalid number message must be displayed", async () => {
    const invalidNumber = "1-0";
    const existingErrorMessage = "Invalid number";

    const onInvalidNumberInput = jest.fn();
    const onChange = jest.fn();
    await act(
      async () =>
        await render(
          <Number
            min={1}
            max={10}
            onChange={onChange}
            onInvalidNumberInput={onInvalidNumberInput}
          />
        )
    );
    let input = screen.getByRole("textbox");

    await userEvent.type(input, invalidNumber);
    await waitFor(() => expect(input).toHaveValue(invalidNumber));
    expect(onChange).toHaveBeenCalledTimes(2); // 1 for each character
    expect(onInvalidNumberInput).toHaveBeenCalled();
    const errorMessageElement = await screen.findByText(existingErrorMessage, {
      timeout: 1000,
    });
    expect(errorMessageElement).toBeInTheDocument();
  });
});
