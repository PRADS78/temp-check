import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./AppButton.stories";
import { ButtonSize, Size } from "../../Enums";

const { PrimaryButton, DropdownButton } = composeStories(stories);
describe("AppButton", () => {
  test("Component must be rendered", async () => {
    await render(<PrimaryButton />);
    expect(await screen.findByRole("button")).toBeInTheDocument();
  });

  test("Must have the specified button label", async () => {
    const label = "Prim";
    await render(<PrimaryButton label={label} />);
    expect(await screen.findByText(label)).toBeInTheDocument();
  });

  test("Must have the ctrCls prop in its classList", async () => {
    const customClass = "custom-class";
    await render(<PrimaryButton ctrCls={customClass} />);
    expect(await screen.findByRole("button")).toHaveClass(customClass);
  });

  test("Component must be disabled if disabled prop is set to true", async () => {
    const onClick = jest.fn();
    await render(<PrimaryButton onClick={onClick} isDisabled />);
    const disabledButton = await screen.findByRole("button");
    expect(disabledButton).toBeDisabled();
    fireEvent.click(disabledButton);
    expect(onClick).not.toHaveBeenCalled();
  });

  test("onClick must be invoked on button click", async () => {
    const onClick = jest.fn();
    await render(<PrimaryButton onClick={onClick} />);
    fireEvent.click(await screen.findByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("Menu child component must be shown; menuItems must be rendered", async () => {
    const onClick = jest.fn();
    await render(<DropdownButton onClick={onClick} />);
    const allButtons = await screen.findAllByRole("button");
    const button = allButtons[1];
    fireEvent.click(button);
    const menuComponent = screen.getAllByRole("listitem");
    expect(menuComponent.length).toBe(DropdownButton.args.menuItems.length);
  });

  test("Drop down button Menu item click event handler must be invoked", async () => {
    const onClick = jest.fn();
    const onMenuItemClick = jest.fn();
    const menuItems = [
      { label: "First" },
      { label: "Second" },
      { label: "Third with overflowing text" },
    ];
    await render(
      <DropdownButton
        menuItems={menuItems}
        onClick={onClick}
        onMenuItemClick={onMenuItemClick}
      />
    );
    const allButtons = await screen.findAllByRole("button");
    const button = allButtons[1];
    fireEvent.click(button);
    const menuComponent = screen.getAllByRole("listitem");
    fireEvent.click(menuComponent[0]);
    expect(onMenuItemClick).toHaveBeenCalledTimes(1);
  });

  test("Component must reflect the specified size", async () => {
    await render(<PrimaryButton size={ButtonSize.SMALL} />);
    const button = await screen.findByRole("button");
    expect(button).toHaveClass(Size.SMALL);
  });

  test("latest icon function must be called", async () => {
    const icon = jest.fn();
    await render(<PrimaryButton icon={icon} />);
    await waitFor(() => {
      expect(icon).toBeCalled();
    });
  });
});
