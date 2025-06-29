import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./ImageSelector.stories";
import user from "@testing-library/user-event";
import {
  getSourceUrl,
  getSourceUrlInCropper,
} from "../../../__mocks__/imageSelector";

const { Standard, WithDefaultSource } = composeStories(stories);

describe("ImageSelector Standard", () => {
  const onDelete = jest.fn();
  const onCrop = jest.fn();
  const onError = jest.fn();

  beforeEach(() => {
    onDelete.mockClear();
    onCrop.mockClear();
    onError.mockClear();
  });

  test("should render the Standard component with a custom container class", async () => {
    const ctrCls = "custom-container-class";
    render(<Standard ctrCls={ctrCls} />);
    const region = await screen.findAllByRole("region");
    const mainEl = region[0];
    expect(mainEl).toHaveClass(ctrCls);
  });

  test("title element should be in the document and should have the expected text", async () => {
    const title = "testTitle";
    render(<Standard title={title} />);
    const titleEl = await screen.findByText("testTitle");
    expect(titleEl).toBeInTheDocument();
  });

  test("should be able to drop the image into the designated drop zone and should select from recommended image.", async () => {
    render(<Standard />);
    const dropZoneEl = await screen.findByRole("file");
    expect(dropZoneEl).toBeInTheDocument();
    const recommendedImageEl = screen.getAllByRole("region")[1];
    expect(recommendedImageEl).toBeInTheDocument();
  });

  test("selected file should be in input files and onErrorMock should not be called", async () => {
    const onErrorMock = jest.fn();
    const sourceUrl = getSourceUrl();
    global.URL.createObjectURL = jest.fn(() => {
      return sourceUrl;
    });
    render(<Standard onError={onErrorMock} />);
    const blob = new Blob(["str"], { type: "image/png" });
    blob.name = "Test.jpg";
    const inputEl = await screen.findByRole("file");
    fireEvent.change(inputEl, {
      target: { files: [blob] },
    });
    expect(inputEl.files[0].name).toBe("Test.jpg");
    const cropperZoneEl = screen.getAllByRole("img");
    expect(cropperZoneEl[1]).toHaveAttribute("src", sourceUrl);
    expect(onErrorMock).toBeCalledTimes(0);
  });

  test("should throws an error and shows 'Invalid Format' message when uploading an unsupported video format", async () => {
    const onErrorMock = jest.fn();
    render(<Standard onError={onErrorMock} />);
    const blob = new Blob(["str"], { type: "video/mp4" });
    blob.name = "Test.mp4";
    const inputEl = await screen.findByRole("file");
    fireEvent.change(inputEl, {
      target: { files: [blob] },
    });
    const invalidTextEl = screen.getByText("Invalid Format");
    expect(invalidTextEl).toBeInTheDocument();
    expect(onErrorMock).toHaveBeenCalled();
  });

  test("should throws an error and shows 'File size Exceed' message when uploading an file which exceeds 5MB", async () => {
    const onErrorMock = jest.fn();
    render(<Standard onError={onErrorMock} />);
    const content = new Array(6 * 1024 * 1024).fill("a").join(""); // creates a string of 6MB length filled with "a"
    const blob = new Blob([content], { type: "image/png" });
    blob.name = "Test.jpg";
    const inputEl = await screen.findByRole("file");
    fireEvent.change(inputEl, {
      target: { files: [blob] },
    });
    const invalidTextEl = screen.getByText("File size Exceed");
    expect(invalidTextEl).toBeInTheDocument();
    expect(onErrorMock).toHaveBeenCalled();
  });

  test("render should crop zone properly", async () => {
    const defaultSource = getSourceUrl();
    render(<WithDefaultSource defaultSource={defaultSource} />);
    const cropperZoneRegion = await screen.findAllByRole("region");
    const cropperZoneEl = cropperZoneRegion[1];
    expect(cropperZoneEl).toBeInTheDocument();
  });

  test("should render the loading animation when the image is not loaded.", async () => {
    const defaultSource = getSourceUrl();
    await act(async () => {
      return await render(<WithDefaultSource defaultSource={defaultSource} />);
    });
    const loadingAnimation = screen.getByAltText("Loading animation");
    expect(loadingAnimation).toBeInTheDocument();
    const imageElements = screen.getAllByRole("img");
    expect(imageElements).toHaveLength(9);
    expect(imageElements[1]).toHaveAttribute("src", defaultSource);
  });

  test("recommended images should be clickable so that they can be reflected in the cropper accordingly.", async () => {
    const sourceUrl = getSourceUrl();
    const sourceUrlInCropper = getSourceUrlInCropper();
    await act(async () => {
      return await render(<Standard />);
    });
    const imageElements = screen.getAllByRole("img");
    const filteredImage = imageElements.find(
      (img) => img.getAttribute("src") == sourceUrl
    );
    user.click(filteredImage);
    const imageElementAll = screen.getAllByRole("img");
    const cropperElement = imageElementAll.find(
      (img) => img.getAttribute("src") == sourceUrlInCropper
    );
    expect(cropperElement).toBeInTheDocument;
  });

  //   test("should call onDelete callback when delete button is clicked in component", async () => {
  //     const onDeleteMock = jest.fn();
  //     const onCropMock = jest.fn();
  //     const defaultSource =
  //       "https://images.unsplash.com/photo-1511297968426-a869b61af3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTUwODV8MHwxfHNlYXJjaHwxfHxzYWR8ZW58MHwwfHx8MTY3OTgxNjc2NA&ixlib=rb-4.0.3&q=80&w=1080";
  //     render(
  //       <WithDefaultSource
  //         defaultSource={defaultSource}
  //         onDelete={onDeleteMock}
  //         onCrop={onCropMock}
  //         cropReturnType={"base64"}
  //       />
  //     );
  //     await waitFor(() => {
  //       const buttons = screen.getAllByRole("button");
  //       const deleteButton = buttons.find(
  //         (button) => button.dataset.role === "delete-button"
  //       );
  //       expect(deleteButton).toBeInTheDocument();
  //       fireEvent.click(deleteButton);
  //     });
  //     expect(onDeleteMock).toBeCalled();
  //   });

  //   test("should call onCropMock callback when reset button is clicked in component", async () => {
  //     const onDeleteMock = jest.fn();
  //     const onCropMock = jest.fn();
  //     const defaultSource =
  //       "https://images.unsplash.com/photo-1511297968426-a869b61af3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTUwODV8MHwxfHNlYXJjaHwxfHxzYWR8ZW58MHwwfHx8MTY3OTgxNjc2NA&ixlib=rb-4.0.3&q=80&w=1080";
  //     render(
  //       <WithDefaultSource
  //         defaultSource={defaultSource}
  //         cropReturnType={"base64"}
  //         onDelete={onDelete}
  //         onCrop={onCrop}
  //       />
  //     );
  //     const buttons = screen.getAllByRole("button");
  //     const resetButton = buttons.find(
  //       (button) => button.dataset.role === "reset-button"
  //     );
  //     expect(resetButton).toBeInTheDocument();
  //     user.click(resetButton);
  //     expect(onCrop).toBeCalled();
  //   });

  //   test("should call onCropMock callback when plus button is clicked in component", async () => {
  //     const onDeleteMock = jest.fn();
  //     const onCropMock = jest.fn();
  //     const defaultSource =
  //       "https://images.unsplash.com/photo-1511297968426-a869b61af3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTUwODV8MHwxfHNlYXJjaHwxfHxzYWR8ZW58MHwwfHx8MTY3OTgxNjc2NA&ixlib=rb-4.0.3&q=80&w=1080";
  //     const onDeleteMock = jest.fn();
  //     const onCropMock = jest.fn();
  //     render(
  //       <WithDefaultSource
  //         defaultSource={defaultSource}
  //         onDelete={onDeleteMock}
  //         onCrop={onCropMock}
  //         cropReturnType={"base64"}
  //       />
  //     );
  //     const buttons = screen.getAllByRole("button");
  //     const plusButton = buttons.find(
  //       (button) => button.dataset.role === "plus-button"
  //     );
  //     expect(plusButton).toBeInTheDocument();
  //     user.click(plusButton);
  //     expect(onCrop).toBeCalled();
  //   });

  //   test("should call onCropMock callback when minus button is clicked in component", () => {
  //     const onDeleteMock = jest.fn();
  //     const onCropMock = jest.fn();
  //     const defaultSource =
  //       "https://images.unsplash.com/photo-1511297968426-a869b61af3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyOTUwODV8MHwxfHNlYXJjaHwxfHxzYWR8ZW58MHwwfHx8MTY3OTgxNjc2NA&ixlib=rb-4.0.3&q=80&w=1080";
  //     render(
  //       <WithDefaultSource
  //         defaultSource={defaultSource}
  //         onDelete={onDeleteMock}
  //         onCrop={onCropMock}
  //         cropReturnType={"base64"}
  //       />
  //     );
  //     const buttons = screen.getAllByRole("button");
  //     const minusButton = buttons.find(
  //       (button) => button.dataset.role === "minus-button"
  //     );
  //     expect(minusButton).toBeInTheDocument();
  //     user.click(minusButton);
  //     expect(onCrop).toBeCalled();
  //   });
});
