import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecommendedImagesView from "./RecommendedImagesView";
import { getSourceUrl } from "../../../../__mocks__/imageSelector.js";

describe("RecommendedImagesView ", () => {
  test("RecommendedImagesView should be rendered without errors", () => {
    render(<RecommendedImagesView />);
    expect(screen.getByRole("region")).toBeInTheDocument();
  });

  test("should the onLoad function be called when RecommendedImagesView is rendered", async () => {
    const onLoadMock = jest.fn();
    await act(async () => {
      return await render(<RecommendedImagesView onLoad={onLoadMock} />);
    });
    expect(onLoadMock).toHaveBeenCalled();
  });

  test("should renders the correct number of recommended images.", async () => {
    await act(async () => {
      return await render(<RecommendedImagesView />);
    });
    const imageElements = screen.getAllByRole("img");
    expect(imageElements).toHaveLength(6);
  });

  test("should call onImageSelect with correct image when an image is clicked", async () => {
    const onImageSelect = jest.fn();
    await act(async () => {
      return await render(
        <RecommendedImagesView onImageSelect={onImageSelect} />
      );
    });
    const imageElements = screen.getAllByRole("img");
    fireEvent.click(imageElements[1]);
    expect(onImageSelect).toHaveBeenCalled();
  });

  test("first recommended image should display the correct source and author name ", async () => {
    const sourceUrl = getSourceUrl();
    await act(async () => {
      return await render(<RecommendedImagesView />);
    });
    const imageElements = screen.getAllByRole("img");
    expect(imageElements[0]).toHaveAttribute("src", sourceUrl);
    expect(screen.getByText("Tim Mossholder")).toBeInTheDocument();
  });

  test("previous button should be disabled when the current page is the first page", async () => {
    await act(async () => {
      return await render(<RecommendedImagesView />);
    });
    const buttons = screen.getAllByRole("button");
    const previousButton = buttons.find(
      (button) => button.dataset.role === "previous-button"
    );
    expect(previousButton).toBeDisabled();
  });

  test("next button should be disabled when the current page is the last page", async () => {
    await act(async () => {
      return await render(<RecommendedImagesView />);
    });
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons.find(
      (button) => button.dataset.role === "next-button"
    );
    expect(nextButton).toBeEnabled();
  });

  test("RecommendedImagesView should enable next and previous page navigation based on clicks, with disabled state changing accordingly, and activate/deactivate the navigation buttons correctly", async () => {
    await act(async () => {
      return await render(<RecommendedImagesView />);
    });
    const buttons = screen.getAllByRole("button");
    const navigationButtons = buttons.filter(
      (button) => button.getAttribute("data-role") === "navigation-button"
    );
    const previousButton = buttons.find(
      (button) => button.dataset.role === "previous-button"
    );
    const nextButton = buttons.find(
      (button) => button.dataset.role === "next-button"
    );

    // initial state
    expect(navigationButtons[0]).toHaveClass("active");
    expect(navigationButtons[1]).not.toHaveClass("active");

    // click next button
    await userEvent.click(nextButton);
    expect(navigationButtons[0]).not.toHaveClass("active");
    expect(navigationButtons[1]).toHaveClass("active");
    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeEnabled();

    // double click next button
    await userEvent.dblClick(nextButton);
    expect(navigationButtons[0]).not.toHaveClass("active");
    expect(navigationButtons[1]).not.toHaveClass("active");
    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeDisabled();

    // click previous button
    await userEvent.click(previousButton);
    expect(navigationButtons[2]).toHaveClass("active");
    expect(previousButton).toBeEnabled();
    expect(nextButton).toBeEnabled();
  });

  test("should render the correct number of pagination buttons and activate/deactivate the navigation buttons correctly", async () => {
    await act(async () => {
      return await render(<RecommendedImagesView />);
    });
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(6);
    const navigationButtons = buttons.filter(
      (button) => button.getAttribute("data-role") === "navigation-button"
    );
    expect(navigationButtons[0]).toHaveClass("active");
    expect(navigationButtons).toHaveLength(4);
    await userEvent.click(navigationButtons[1]);
    expect(navigationButtons[1]).toHaveClass("active");
  });
});
