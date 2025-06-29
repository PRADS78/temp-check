import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./TextArea.stories";

const { Standard } = composeStories(stories);

describe("TextArea", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const textContent =
    "If I have seen further than others, it is by standing upon the shoulders of giants.";

  test("textarea must be rendered", async () => {
    render(<Standard />);
    const textArea = await screen.findByRole("textbox");
    expect(textArea).toBeInTheDocument();
  });

  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-class";
    render(<Standard ctrCls={ctrCls} />);
    const container = await screen.findAllByRole("region");
    expect(container[0]).toHaveClass(ctrCls);
  });

  test("initialValue must be rendered", async () => {
    render(<Standard initialValue={textContent} maxLength={100} />);
    const textArea = await screen.findByDisplayValue(textContent);
    expect(textArea).toHaveValue(textContent);
  });

  test("maxLength must be enforced", async () => {
    const maxLength = 10;
    render(<Standard initialValue={textContent} maxLength={maxLength} />);
    const textArea = await screen.findByDisplayValue(
      textContent.slice(0, maxLength - 1)
    );
    expect(textArea).toHaveValue(textContent.slice(0, maxLength));
  });

  test("name must be applied to textarea", async () => {
    const name = "custom-textarea-name";
    render(<Standard name={name} />);
    const textArea = await screen.findByRole("textbox");
    expect(textArea.name).toBe(name);
  });

  test("onChange must be invoked", async () => {
    const onChange = jest.fn();
    render(<Standard onChange={onChange} />);
    const textArea = await screen.findByRole("textbox");
    fireEvent.change(textArea, { target: { value: textContent } });
    expect(onChange).toHaveBeenCalled();
  });

  test("placeholder must be rendered", async () => {
    const placeholder = "Custom placeholder";
    render(<Standard placeholder={placeholder} />);
    const textArea = await screen.findByRole("textbox");
    expect(textArea.placeholder).toBe(placeholder);
  });

  test("title must be rendered", async () => {
    const title = "textarea title";
    render(<Standard title={title} />);
    const titleElement = await screen.findByText(title);
    expect(titleElement).toBeInTheDocument();
  });

  test("isDisabled must be applied", async () => {
    const isDisabled = true;
    render(<Standard isDisabled={isDisabled} />);
    const textArea = await screen.findByRole("textbox");
    expect(textArea).toHaveClass("isDisabled");
    expect(textArea).toBeDisabled();
  });

  test("min height must be applied", async () => {
    const minHeight = 200;
    render(<Standard minHeight={minHeight} />);
    const textArea = await screen.findByRole("textbox");
    expect(textArea).toHaveStyle({ minHeight: `${minHeight}px` });
  });

  test("focus must be invoked", async () => {
    await act(async () => await render(<Standard {...Standard.args} />));
    await waitFor(
      async () => expect(await screen.findByRole("textbox")).toHaveFocus(),
      {
        timeout: 3000,
      }
    );
  });

  test("errorMessage must be shown", async () => {
    const errorMessage = "Custom error message";
    render(<Standard errorMessage={errorMessage} />);
    const errorMessageElement = await screen.findByText(errorMessage);
    expect(errorMessageElement).toBeInTheDocument();
  });
});
