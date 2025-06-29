import { useState, useEffect, useRef, useMemo } from "react";
import { ReactComponent as SkillDropdown } from "../../stories/assets/SkillDropdown.svg";
import { ReactComponent as RateRemainingQuestions } from "../../stories/assets/RateRemainingQuestions.svg";
import { PrimaryButton } from "../AppButton";
import styles from "./CoachMark.module.scss";
import { CoachMark } from "./";

const storyConfig = {
  title: "Disprz/DisprzCoachMark",
  parameters: {
    docs: {
      source: {
        type: "code",
      },
    },
  },
};

export default storyConfig;

const Template = (args) => {
  const [ref1, setRef1] = useState(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const coachMarkRef = useRef();

  const coachList = useMemo(() => {
    return [
      {
        header: {
          imageComponent: SkillDropdown,
        },
        content: {
          title: "Recommendations",
          description:
            "Select skills from this dropdown list and start rating each learners on each skills.",
        },
        referenceRef: ref1,
      },
      {
        header: {
          imageComponent: RateRemainingQuestions,
        },
        content: {
          title: "Scroll to rate all question",
          description:
            "Scroll down to rate all question in this skill. You can move to next skill by clicking on “Next” once you rate all the questions.",
        },
        referenceRef: ref2.current,
      },
      {
        header: {
          imageComponent: RateRemainingQuestions,
        },
        content: {
          title: "To add comments",
          description:
            "Click on learners thumbnail to see a pop up to add your comments.",
        },
        referenceRef: ref3.current,
      },
    ];
  }, [ref1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      coachMarkRef.current.show();
      // coachMarkRef.current.show({ canOverRideCoachMarkShowAgain: true });
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const _onDismissClick =
    args.onDismiss ??
    function () {
      console.log("Dismiss clicked");
    };

  const _onDoneClick =
    args.onDone ??
    function () {
      console.log("Done clicked");
    };

  return (
    <div
      data-testid="coachmark-container"
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "400px",
      }}
    >
      <PrimaryButton
        ref={setRef1}
        label={"Sample1"}
        uniqueId={`${1675147275769}`}
        ctrCls={styles.btnCls}
      />
      <PrimaryButton
        ref={ref2}
        label={"Sample2"}
        uniqueId={`${1675147275759}`}
        ctrCls={styles.btnCls}
      />
      <PrimaryButton
        ref={ref3}
        label={"Sample3"}
        uniqueId={`${1675147275259}`}
        ctrCls={styles.btnCls}
      />
      <CoachMark
        {...args}
        data={coachList}
        onDismiss={_onDismissClick}
        onDone={_onDoneClick}
        name="storybook-coachmark"
        ref={coachMarkRef}
        uniqueId={"1675324521815"}
      />
    </div>
  );
};

export const Standard = Template.bind({});

Standard.args = {
  ctrCls: "",
  overlayCtrCls: "",
  referenceCtrCls: "",
};
