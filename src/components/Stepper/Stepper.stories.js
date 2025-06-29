import { Stepper } from ".";
import PropTypes from "prop-types";
import { TextField } from "../TextField";
import { PlainButton, PrimaryButton } from "../AppButton";
import { StepperStepType, TextFieldTypes } from "../../Enums";

const storyConfig = {
  title: "Disprz/DisprzStepper",
  component: Stepper,
};

export default storyConfig;

function FirstTemplate(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <section style={{ padding: "15px 0" }}>
        <div>
          <TextField
            borderGapColor="#fff"
            label="First Name"
            uniqueId={1669207228718}
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <TextField
            borderGapColor="#fff"
            label="Last Name"
            uniqueId={1669207240142}
          />
        </div>
      </section>
      <section style={{ textAlign: "right" }}>
        <PrimaryButton
          label="Next"
          ctrCls="first-next"
          onClick={() => props.onNext()}
          uniqueId={1666954073003}
        />
      </section>
    </div>
  );
}

FirstTemplate.propTypes = {
  onNext: PropTypes.func,
  index: PropTypes.number,
};

function SecondTemplate(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <section style={{ padding: "15px 0" }}>
        <div>
          <TextField
            borderGapColor="#fff"
            label="Username"
            uniqueId={1669207255430}
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <TextField
            borderGapColor="#fff"
            label="Password"
            type={TextFieldTypes.PASSWORD}
            uniqueId={1669207268986}
          />
        </div>
      </section>
      <section style={{ display: "flex", justifyContent: "space-between" }}>
        <PlainButton
          label="Previous"
          onClick={() => props.onPrev()}
          uniqueId={1666954150026}
        />

        <PrimaryButton
          label="Next"
          onClick={() => props.onNext()}
          uniqueId={1666954127956}
        />
      </section>
    </div>
  );
}

SecondTemplate.propTypes = {
  onNext: PropTypes.func,
  index: PropTypes.number,
  onPrev: PropTypes.func,
};

function ThirdTemplate(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <section style={{ padding: "15px 0" }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
          }}
        >
          <div>
            <TextField
              borderGapColor="#fff"
              label="Address Line 1"
              uniqueId={1669207280597}
            />
          </div>
          <div>
            <TextField
              borderGapColor="#fff"
              label="Address Line 2"
              uniqueId={1669207291544}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <div>
            <TextField
              borderGapColor="#fff"
              label="State"
              uniqueId={1669207303532}
            />
          </div>
          <div>
            <TextField
              borderGapColor="#fff"
              label="Country"
              uniqueId={1669207313283}
            />
          </div>
        </div>
      </section>
      <section style={{ display: "flex", justifyContent: "space-between" }}>
        <PlainButton
          label="Previous"
          onClick={() => props.onPrev()}
          uniqueId={1666954168561}
        />

        <PrimaryButton
          label="Submit"
          onClick={() => props.onNext()}
          uniqueId={1666954179653}
        />
      </section>
    </div>
  );
}

ThirdTemplate.propTypes = {
  onNext: PropTypes.func,
  index: PropTypes.number,
  onPrev: PropTypes.func,
};

function DoneTemplate() {
  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        height: "100%",
        justifyContent: "center",
      }}
    >
      Finished!
    </div>
  );
}

const data = [
  {
    label: "First",
    content: ({ onNext }) => <FirstTemplate onNext={onNext} />,
    id: "first-template",
    ctrCls: "first-template",
  },
  {
    label: "Second",
    content: ({ onNext, onPrev }) => (
      <SecondTemplate onNext={onNext} onPrev={onPrev} />
    ),
    id: "second-template",
  },
  {
    label: "Third",
    content: ({ onNext, onPrev }) => (
      <ThirdTemplate onNext={onNext} onPrev={onPrev} />
    ),
    id: "third-template",
  },
];

function Template(args) {
  const containerStyle = {
    padding: "10px",
    width: "600px",
    height: "25px",
  };

  return (
    <div style={containerStyle} data-testid="stepper-container">
      <Stepper {...args} uniqueId={1666953520726} />
      <div id="cursor-trap" style={{ height: "1px" }}></div>
    </div>
  );
}

export const Standard = Template.bind({});

export const Linear = Template.bind({});

export const NonLinear = Template.bind({});

Standard.args = {
  data: data,
  type: StepperStepType.PARTIAL_LINEAR,
  doneTemplate: () => <DoneTemplate key="done" />,
};

Linear.args = {
  ...Standard.args,
  type: StepperStepType.LINEAR,
};

NonLinear.args = {
  ...Standard.args,
  type: StepperStepType.NON_LINEAR,
};

const parameters = {
  jest: ["Stepper.test.js"],
};

Standard.parameters = Linear.parameters = NonLinear.parameters = parameters;
