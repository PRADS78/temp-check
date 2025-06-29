import { act, render, within, screen } from "test-utils";
import Range from "./Range";
import userEvent from "@testing-library/user-event";

describe("Filter Range", () => {
  test("must render Range", async () => {
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("dialog");
    const menu = screen.getByRole("menu");
    expect(container).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
  });

  test("onApply must be invoked", async () => {
    const onApply = jest.fn();
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={onApply}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("menu");
    const minTextBox = within(container).getAllByRole("textbox")[0];
    const maxTextBox = within(container).getAllByRole("textbox")[1];
    await userEvent.type(minTextBox, "10");
    await userEvent.type(maxTextBox, "99", { delay: 100 });
    expect(minTextBox).toHaveValue(10);
    expect(maxTextBox).toHaveValue(99);

    const footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const applyButton = within(footer[0]).getAllByRole("button")[1];
    await userEvent.click(applyButton);
    expect(applyButton).toBeEnabled();
    expect(onApply).toHaveBeenCalled();
  });

  test("onCancel must be invoked", async () => {
    const onCancel = jest.fn();
    await act(
      async () =>
        await render(
          <Range isOpen={true} onCancel={onCancel} min={0} max={100} />
        )
    );
    const footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const cancelButton = within(footer[0]).getAllByRole("button")[0];
    await userEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalled();
  });

  test("onCancel must be retain the previous selected values", async () => {
    const onCancel = jest.fn();
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={onCancel}
            onApply={() => {}}
            min={0}
            max={100}
            selectedMin={10}
            selectedMax={99}
          />
        )
    );
    const container = screen.getByRole("menu");
    const minTextBox = within(container).getAllByRole("textbox")[0];
    const maxTextBox = within(container).getAllByRole("textbox")[1];
    expect(minTextBox).toHaveValue(10);
    expect(maxTextBox).toHaveValue(99);
    await userEvent.type(minTextBox, "10");
    await userEvent.type(maxTextBox, "50", { delay: 100 });
    await userEvent.click(document.body);
    expect(onCancel).toHaveBeenCalled();
    expect(minTextBox).toHaveValue(10);
    expect(maxTextBox).toHaveValue(99);
  });

  test("clearAll should clear all values", async () => {
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("menu");
    let minTextBox = within(container).getAllByRole("textbox")[0];
    let maxTextBox = within(container).getAllByRole("textbox")[1];
    await userEvent.type(minTextBox, "10");
    await userEvent.type(maxTextBox, "99", { delay: 100 });

    const footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const clearAllButton = within(footer[0]).getAllByRole("button")[0];

    await userEvent.click(clearAllButton);
    minTextBox = within(container).getAllByRole("textbox")[0];
    maxTextBox = within(container).getAllByRole("textbox")[1];

    expect(minTextBox).toHaveValue(null);
    expect(maxTextBox).toHaveValue(null);
  });

  test("preSelected range must be selected", async () => {
    const preSelectedRange = [10, 20];
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            selectedMin={preSelectedRange[0]}
            selectedMax={preSelectedRange[1]}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("menu");
    const minTextBox = within(container).getAllByRole("textbox")[0];
    const maxTextBox = within(container).getAllByRole("textbox")[1];
    expect(minTextBox).toHaveValue(10);
    expect(maxTextBox).toHaveValue(20);
  });

  test("apply button should be disabled unless selection is made for mandatory range", async () => {
    const preSelectedRange = [10, 20];
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            selectedMin={preSelectedRange[0]}
            selectedMax={preSelectedRange[1]}
            min={0}
            max={100}
            isMandatory={true}
          />
        )
    );
    const footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const clearAllButton = within(footer[0]).getAllByRole("button")[0];
    await userEvent.click(clearAllButton);
    const applyButton = within(footer[0]).getAllByRole("button")[1];
    expect(applyButton).toBeDisabled();
  });

  test("apply must be disabled when the values are same with the previous values", async () => {
    const preSelectedRange = [10, 20];
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            selectedMin={preSelectedRange[0]}
            selectedMax={preSelectedRange[1]}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("menu");
    const minTextBox = within(container).getAllByRole("textbox")[0];
    await userEvent.type(minTextBox, "11");
    expect(minTextBox).toHaveValue(11);
    const footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const applyButton = within(footer[0]).getAllByRole("button")[1];
    expect(applyButton).toBeEnabled();
    await userEvent.type(minTextBox, "10");
    expect(applyButton).toBeDisabled();
  });

  test("apply must be disabled when max is less than min", async () => {
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("menu");
    const minTextBox = within(container).getAllByRole("textbox")[0];
    const maxTextBox = within(container).getAllByRole("textbox")[1];
    const footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    const applyButton = within(footer[0]).getAllByRole("button")[1];
    expect(applyButton).toBeDisabled();
    await userEvent.type(minTextBox, "50");
    await userEvent.type(maxTextBox, "40");
    expect(applyButton).toBeDisabled();
  });

  test("when min/max is greater than defined max, error message must be displayed", async () => {
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("menu");
    const minTextBox = within(container).getAllByRole("textbox")[0];
    const maxTextBox = within(container).getAllByRole("textbox")[1];

    await userEvent.type(maxTextBox, "110");
    let errorElement = screen.getByText("Max is 100");
    expect(errorElement).toBeInTheDocument();
    let footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    let applyButton = within(footer[0]).getAllByRole("button")[1];
    expect(applyButton).toBeDisabled();

    await userEvent.clear(maxTextBox);
    await userEvent.type(maxTextBox, "10");
    await userEvent.type(minTextBox, "0");
    errorElement = screen.queryByText("Max is 100");
    expect(errorElement).not.toBeInTheDocument();
    expect(applyButton).toBeEnabled();

    await userEvent.type(maxTextBox, "110");
    errorElement = screen.getByText("Max is 100");
    expect(errorElement).toBeInTheDocument();
    expect(applyButton).toBeDisabled();
  });

  test("when min/max is less than defined min, error message must be displayed", async () => {
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("menu");
    const minTextBox = within(container).getAllByRole("textbox")[0];
    const maxTextBox = within(container).getAllByRole("textbox")[1];
    await userEvent.type(minTextBox, "-10");
    let errorElement = screen.getByText("Min is 0");
    expect(errorElement).toBeInTheDocument();
    let footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    let applyButton = within(footer[0]).getAllByRole("button")[1];
    expect(applyButton).toBeDisabled();

    await userEvent.clear(minTextBox);
    await userEvent.type(maxTextBox, "-20");
    errorElement = screen.getByText("Min is 0");
    expect(errorElement).toBeInTheDocument();

    footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    applyButton = within(footer[0]).getAllByRole("button")[1];
    expect(applyButton).toBeDisabled();
  });

  test("when min is greater than max, apply button must be disabled", async () => {
    await act(
      async () =>
        await render(
          <Range
            isOpen={true}
            onCancel={() => {}}
            onApply={() => {}}
            min={0}
            max={100}
          />
        )
    );
    const container = screen.getByRole("menu");
    const minTextBox = within(container).getAllByRole("textbox")[0];
    const maxTextBox = within(container).getAllByRole("textbox")[1];
    await userEvent.type(minTextBox, "20");
    await userEvent.type(maxTextBox, "10");
    // TODO: This message is not displayed due how TextField handles state
    // let errorElement = screen.getByText("Current max is 10");
    // expect(errorElement).toBeInTheDocument();
    let footer = screen.getAllByRole("region").filter((item) => {
      return item.dataset.role === "filter-footer";
    });
    let applyButton = within(footer[0]).getAllByRole("button")[1];
    expect(applyButton).toBeDisabled();
  });
});
