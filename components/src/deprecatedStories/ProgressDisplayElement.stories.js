// ProgressDisplayElement.stories.js
import { useState } from "react";
import ProgressDisplayElement from "../ProgressDisplayElement/ProgressDisplayElement";
import { ReactComponent as AppIcon } from "../stories/assets/AppIcons.svg";


export default {
    title: "Deprecated/ProgressDisplayElement",
    component: ProgressDisplayElement,
    name: "ProgressDisplayElement",
    decorators: [
        (story) => story()
    ],
    argTypes: {
     
    },
};
const Template = (args) => {
     
    return (
        <>
            <ProgressDisplayElement {...args} />
        </>
    );
};
export const Basic = Template.bind({});
export const Line = Template.bind({});
export const SemiCircle = Template.bind({});

Basic.args = {
    strokeWidth: 10,
    height: 100,
    width: 100,
    progressElementType: "Circle",
    animationDuration: 1500,
    setCompletionAccents: !true,
    elementCls: "ctl_class",
    trailColor: "#eee",
    ctrCls: "",
    setPercentageValue: true,
    textValue: "test",
    value:25
}

Line.args = {
    ...Basic.args,
    strokeWidth: 5,
    progressElementType: "Line",

}

SemiCircle.args = {
    ...Basic.args,
    strokeWidth: 4,
    progressElementType: "SemiCircle",

}