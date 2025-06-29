import { FileFormats } from "../../Enums";
import FileUpload from "./FileUpload";

const storyConfig = {
  title: "Disprz/DisprzFileUpload",
  component: FileUpload,
};

export default storyConfig;

const Template = (args) => {
  return (
    <div data-testid="fileUpload">
      <FileUpload
        {...args}
        onProgress={(file) => console.log("onProgress", file)}
        onCompleted={(file) => console.log("onCompleted", file)}
        onDelete={(file) => console.log("onDelete", file)}
        onCancel={(file) => console.log("onCancel", file)}
        onError={(file, error) => console.log("onError", file, error)}
      />
    </div>
  );
};

export const Standard = Template.bind({});

Standard.args = {
  ctrCls: "",
  supportedFormats: [FileFormats.PNG, FileFormats.MP4],
  Urls: {
    baseUrl: "https://disprzdpindia.disprz.com/DisprzFileUploadServicestaging/",
    endPoint: "api/fileupload/Upload",
    completionEndPoint: "api/fileupload/completeUpload",
  },
  accessToken:
    "yRxeW0VB3uvyFTFq+eGoqTDiM9hqJ9rRshz+mH8pwz/Xh8n4Odd8lqo9ehIwJX24hHQLFxXVrL6LVRXd/XaBSMivzZbxYDU8wVJhHa8vpXZc6wktKiCk5MP6Lxw+whcimqM9WK84V7Ze75w6crecRjkk1ABpRZlvx/yPJbxdUHMc3Zc0e/Wzvx72rLuq+d3Y46iHRqzAuIdrUFmbs0A0SxhOuWiedilV2AjuOQaAZoMuRTXtizfjvs21i1WuV/i0U2A8i4gt5+alGiPnRjjt3jQSDbfTQ+GWm1xLNkZjhwmjdIfq2tJMJryHW3w/6dRZjqV3lgBZzRcavPrOpW9/l9mnjQCbvxSOWlTiGaJ4A9U=",
  fileContextType: 14,
  attachmentId: 0,
  isInteractive: false,
  maxFileSize: 30,
  isMultiple: false,
};

export const MultipleFileUpload = Template.bind({});

MultipleFileUpload.args = {
  ...Standard.args,
  isMultiple: true,
  maxNoOfFiles: 3,
};
