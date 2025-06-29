import { act, render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./Chip.stories";
import { ChipSelectionType, Size } from "../../Enums";

const { Standard } = composeStories(stories);

describe("Chip", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-container-class";
    await act(async () => await render(<Standard ctrCls={ctrCls} />));
    const chipContainer = screen.getByRole("chip");
    expect(chipContainer).toHaveClass(ctrCls);
  });
  test("label must be rendered", async () => {
    const label = "Enabled";
    await act(async () => await render(<Standard label={label} />));
    const chipContainer = screen.getByRole("chip");
    expect(chipContainer).toBeInTheDocument(label);
  });
  test("size must be applied", async () => {
    const size = Size.LARGE;
    await act(async () => await render(<Standard size={size} />));
    const chipContainer = screen.getByRole("chip");
    expect(chipContainer).toHaveClass(size);
  });
  test("selected class must be applied", async () => {
    const isSelected = true;
    await act(async () => await render(<Standard isSelected={isSelected} />));
    const chipContainer = screen.getByRole("chip");
    expect(chipContainer).toHaveClass("selected");
  });
  test("disabled must be applied", async () => {
    const isDisabled = true;
    await act(async () => await render(<Standard isDisabled={isDisabled} />));
    const chipContainer = screen.getByRole("chip");
    expect(chipContainer).toHaveClass("disabled");
  });
  test("onClick must be invoked", async () => {
    const onClick = jest.fn();
    await act(
      async () => await render(<Standard onClick={onClick} id={101} />)
    );
    const chip = screen.getByRole("chip");
    fireEvent.click(chip);
    expect(onClick).toHaveBeenCalled();
  });
  test("onClose must be invoked", async () => {
    const onClose = jest.fn();
    await act(
      async () =>
        await render(
          <Standard onClose={onClose} canShowClose={true} id={102} />
        )
    );
    const closeIcon = screen
      .getAllByRole("button")
      .filter((button) => button.dataset.role === "close");
    fireEvent.click(closeIcon[0]);
    expect(onClose).toHaveBeenCalled();
  });
  test("isDisabled onClick must not be invoked", async () => {
    const onClick = jest.fn();
    await act(
      async () => await render(<Standard onClick={onClick} isDisabled={true} />)
    );
    const chip = screen.getByRole("chip");
    fireEvent.click(chip);
    expect(onClick).not.toBeCalled();
  });
  test("selectionType must be applied", async () => {
    await act(
      async () =>
        await render(<Standard selectionType={ChipSelectionType.SINGLE} />)
    );
    const chip = screen.getByRole("chip");
    expect(chip).toHaveClass("singleSelect");
  });
  test("Selected chip style must be applied", async () => {
    await act(
      async () =>
        await render(
          <Standard selectionType={ChipSelectionType.MULTI} isSelected={true} />
        )
    );
    const chip = screen.getByRole("chip");
    expect(chip).toHaveClass("selected");
  });
});
