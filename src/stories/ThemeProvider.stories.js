// ThemeProvider.stories.js
import { Component } from "react";
import { ThemeProvider, themeContext } from "../index";
import AppButton from "../AppButton/AppButton";

export default {
    title: "Disprz/ThemeProvider",
    component: ThemeProvider,
    name: "ThemeProvider",
    decorators: [
        (story) => (
            <div className="storybook-theme">
                {story()}
            </div>
        )
    ]
};

const Template = (args) => (
    <ThemeProvider {...args}>
        <themeContext.Consumer>
            {(context) => <StorybookToApplyTheme context={context} />}
        </themeContext.Consumer>
    </ThemeProvider>
);

class StorybookToApplyTheme extends Component {
    render() {
        return (
            <AppButton
                buttonLabel="Theme"
                ctrCls="theme-btn"
                type="primary"
            />
        );
    }
}

export const Basic = Template.bind({});

Basic.args = {
    themeColor: "#6A1CA6"
};
