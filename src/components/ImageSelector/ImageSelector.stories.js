import { useState } from "react";
import { CropReturnType } from "../../Enums";
import ImageSelector from "./ImageSelector";
import { SearchBar } from "../SearchBar";

const storyConfig = {
  title: "Disprz/DisprzImageSelector",
  component: ImageSelector,
};

export default storyConfig;

const Template = (args) => {
  const _onCrop =
    args.onCrop ??
    function () {
      console.log("cropped");
    };

  const _onDelete =
    args.onDelete ??
    function () {
      console.log("deleted");
    };

  const _onError =
    args.onError ??
    function (error) {
      console.log("onError", error);
    };

  return (
    <div data-testid="imageSelector">
      <ImageSelector
        {...args}
        onCrop={_onCrop}
        onDelete={_onDelete}
        uniqueId={1679901614876}
        onError={_onError}
      />
    </div>
  );
};
export const Standard = Template.bind({});

Standard.args = {
  ctrCls: "",
  defaultSearchText: "happy",
  accessToken:
    "yRxeW0VB3uvyFTFq+eGoqXOsMS/Ng5hbfUkF5KJ5SlJtadSgyaLD1pjGwkmOxAR+qYh5/TJZdlVrYfE9XKXYUxz4HdYjosmGTQpxRkhjpCaQDMi2tdeZ1Djf8VmKizUmCwKJ2ZitPGQPssSm5VsdUDhJ5f4FtatbN5p6mGEac8wj8Nz9cl7qV8JxD2x04kJKqvh8XgA7vCYe9qy7qvnd2Fxwm5dTTcnlauCunDpLzD+u42jKRr6TYBNsLDDi17Z1c6cgjdiK5rEXrNTdd2iRcxwTzD+R84sygKyw/yGy55H2yknxz1ckg+IKru4qGA4EN9pbktOGPbqjdIfq2tJMJkKLUeLa1TiUL6q047DmIT5YSFEKtA2FZA1zHK7LrD5UZIZT6Nyhkig=",
  title: "Select Image",
  cropReturnType: CropReturnType.BLOB,
};
export const Base64 = Template.bind({});

Base64.args = {
  ...Standard.args,
  cropReturnType: CropReturnType.BASE64,
};

export const WithDefaultSource = Template.bind({});
WithDefaultSource.args = {
  ...Standard.args,
  defaultSource:
    "https://qastorage.disprz.com/skilltronassetspublic/SkillsPosters/d5ea6733-033e-4c05-b1c1-7556bb683bc7.jpg",
};

const CustomTemplate = (args) => {
  const [searchText, setSearchText] = useState(args.defaultSearchText);
  const [image, setImage] = useState(null);
  return (
    <>
      <div style={{ width: "200px", marginBottom: "20px" }} role="searchbar">
        <SearchBar
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          value={searchText}
          uniqueId={1679579401600}
          onClear={() => {
            setSearchText("");
          }}
        ></SearchBar>
      </div>

      <ImageSelector
        {...args}
        defaultSearchText={searchText}
        onCrop={(file) => {
          console.log("croppedImage", file);
          setImage(file);
        }}
        onDelete={() => {
          console.log("deleted");
          setImage(null);
        }}
        onError={(error) => {
          console.log("onError", error);
          setImage(null);
        }}
        uniqueId={1679901614876}
      />
      <img
        src={image}
        style={{ width: "200px", marginTop: "20px", borderRadius: "5px" }}
        role="preview-image"
      ></img>
    </>
  );
};

export const WithPreviewAndText = CustomTemplate.bind({});
WithPreviewAndText.args = {
  ...Base64.args,
};
