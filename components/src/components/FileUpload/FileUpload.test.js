import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./FileUpload.stories";

const { Standard } = composeStories(stories);

describe("FileUpload", () => {
  test("ctrCls must be applied", async () => {
    const ctrCls = "custom-container-class";
    render(<Standard ctrCls={ctrCls} />);
    const fileUploadContainer = await screen.findByRole("region");
    expect(fileUploadContainer).toHaveClass(ctrCls);
  });
  test("file input must render", async () => {
    render(<Standard />);
    const inputElement = await screen.findByRole("file");
    expect(inputElement).toHaveClass("input");
  });
  // test("file must selected", async () => {
  //   render(<Standard />);
  //   const str = JSON.stringify({
  //     id: 1673603393212,
  //     uploadProgress: 0,
  //     uniqueIdentifier: "398-info1png",
  //     name: "info.png",
  //     size: "398",
  //     type: "image/png",
  //   });
  //   const blob = new Blob([str]);
  //   const file = new File([blob], "info.png", {
  //     type: "image/png",
  //   });
  //   File.prototype.text = jest.fn().mockResolvedValueOnce(str);
  //   const input = screen.getByRole("file");
  //   userEvent.upload(input, file);
  //   await screen.findByTestId("progressContainer");
  // });
  // test("file size must be  verified", async () => {
  //   const { queryByTestId } = render(<MultipleFileUpload />);
  //   const str = JSON.stringify({
  //     id: 1673603393212,
  //     uploadProgress: 0,
  //     uniqueIdentifier: "398-info1png",
  //     name: "info.png",
  //     type: "image/png",
  //   });
  //   const blob = new Blob([str]);
  //   const file = new File([blob], "info.png", {
  //     type: "image/png",
  //   });
  //   const elementMock = { addEventListener: jest.fn() };
  //   jest.spyOn(window, "file").mockImplementation(() => elementMock);
  //   Object.defineProperty(file, "size", { value: 1024 * 1024 * 1024 + 1 });
  //   File.prototype.text = jest.fn().mockResolvedValueOnce(str);
  //   const input = screen.getByRole("file");
  //   userEvent.upload(input, file);
  //   await waitFor(() =>
  //     // eslint-disable-next-line testing-library/prefer-screen-queries
  //     expect(queryByTestId("progressContainer")).not.toBeInTheDocument()
  //   );
  // });
});
