import { BannerEndToEndTypes, BannerTypes } from "../../Enums";
import Banner from "./Banner";

const storyConfig = {
  title: "Disprz/DisprzBanner",
  component: Banner,
};

export default storyConfig;

const Template = (args) => {
  return (
    <div data-testid="banner" style={{ width: "750px", margin: "20px" }}>
      <Banner {...args} uniqueId={1672725513078} />
    </div>
  );
};

export const Standard = Template.bind({});

Standard.args = {
  ctrCls: "",
  content:
    "If at any point you get stuck, have questions or need assistance please don’t hesitate to reach out in the #polaris Slack channel.",
  type: BannerTypes.INFO,
};

export const WithClose = Template.bind({});

WithClose.args = {
  ...Standard.args,
  canShowClose: true,
  onClose: () => {},
};

export const WithTitle = Template.bind({});

WithTitle.args = {
  ...Standard.args,
  canShowClose: true,
  title: "Title",
};

export const EndToEndDefault = Template.bind({});

EndToEndDefault.args = {
  type: BannerTypes.END_TO_END,
  canShowClose: true,
  content: "Alert Banner Message",
  EndToEndType: BannerEndToEndTypes.DEFAULT,
  onClose: () => {},
};

export const EndToEndAlert = Template.bind({});

EndToEndAlert.args = {
  type: BannerTypes.END_TO_END,
  canShowClose: true,
  content: "Alert Banner Message",
  EndToEndType: BannerEndToEndTypes.ALERT,
  onClose: () => {},
};
