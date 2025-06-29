// Helpers.stories.js
import { Component } from "react";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";
import Scrollbars from "react-custom-scrollbars/lib/Scrollbars";
import { HelperProvider, helperContext } from "../index";
import { HelperPositionTypes } from "../Enums";
import { ReactComponent as SkillDropdown } from "../stories/assets/SkillDropdown.svg";
import RatingUser from "../stories/assets/RatingUser.gif";
import AddComment from "../stories/assets/AddComment.gif";
import { ReactComponent as RateRemainingQuestions } from "../stories/assets/RateRemainingQuestions.svg";
import AppButton from "../AppButton/AppButton";

export default {
  title: "Deprecated/Helpers",
  component: HelperProvider,
  name: "Helpers",
  decorators: [
    (story) => (
      <div className="storybook-helpers">
        <AppIcon />
        {story()}
      </div>
    ),
  ],
};

const Template = (args) => (
  <HelperProvider {...args}>
    <StoryBookView />
  </HelperProvider>
);

class StorybookForHelpers extends Component {
  componentDidMount() {
    const { showHelper } = this.props.context;
    showHelper("storybook-helpers");
  }

  render() {
    const { onAction, showHelper } = this.props.context;
    return (
      <Scrollbars className="storybook-view">
        <div id="storybook-helper-1" className="line-1">
          {"Line 1"}
        </div>
        <div id="storybook-helper-2" className="line-2" onClick={onAction}>
          {"Line 2"}
        </div>
        <div id="storybook-helper-3" className="line-3">
          {"Line 3"}
        </div>
        <div id="storybook-helper-4" className="line-4">
          {"Line 4"}
        </div>
        <AppButton
          buttonLabel="Help"
          ctrCls="help-btn"
          buttonIconCls="icon-help"
          clickHandler={() => {
            localStorage.setItem(
              "storybook-helpers",
              JSON.stringify({
                currentHelperPosition: 0,
                isHelperCompleted: false,
              })
            );
            showHelper("storybook-helpers");
          }}
          type="primary"
        />
      </Scrollbars>
    );
  }
}

class StoryBookView extends Component {
  render() {
    return (
      <helperContext.Consumer>
        {(context) => <StorybookForHelpers context={context} />}
      </helperContext.Consumer>
    );
  }
}

const helpersList = {
  "storybook-helpers": [
    {
      element: "#storybook-helper-1",
      elementCls: "web-learner-element",
      header: {
        imageComponent: SkillDropdown,
      },
      content: {
        title: "Rate learners on all the listed skills",
        description:
          "Select skills from this dropdown list and start rating each learners on each skills.",
      },
      secondaryCtrCls: "",
      position: HelperPositionTypes.RIGHT,
      requireAction: false,
    },
    {
      element: "#storybook-helper-2",
      elementCls: "web-learner-element",
      header: {
        url: RatingUser,
      },
      content: {
        title: "To rate learners",
        description:
          "Start by dragging each learners thumbnail and drop them on the rating scale.",
      },
      secondaryCtrCls: "",
      position: HelperPositionTypes.LEFT,
      requireAction: true,
    },
    {
      element: "#storybook-helper-3",
      elementCls: "web-learner-element",
      header: {
        url: AddComment,
      },
      content: {
        title: "To add comments",
        description:
          "Click on learners thumbnail to see a pop up to add your comments.",
      },
      secondaryCtrCls: "",
      position: HelperPositionTypes.TOP,
      requireAction: false,
      isContentColumnar: true,
    },
    {
      element: "",
      header: {
        imageComponent: RateRemainingQuestions,
      },
      content: {
        title: "Scroll to rate all question",
        description:
          "Scroll down to rate all question in this skill. You can move to next skill by clicking on “Next” once you rate all the questions.",
      },
      secondaryCtrCls: "web-learner-feedback-view",
      position: HelperPositionTypes.CENTER,
      requireAction: true,
    },
  ],
};

export const Basic = Template.bind({});

Basic.args = {
  overlayCls: "helper-overlay-cls",
  primaryCtrClass: "web-learner-helper-bg",
  position: HelperPositionTypes.TOP,
  helpersList: helpersList,
};
