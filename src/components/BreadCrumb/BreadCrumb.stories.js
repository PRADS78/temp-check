import { useState } from "react";
import PropTypes from "prop-types";
import { PrimaryButton } from "../AppButton";
import BreadCrumb from "./BreadCrumb.js";

const storyConfig = {
  title: "Disprz/DisprzBreadcrumb",
  component: BreadCrumb,
};

export default storyConfig;

const Template = ({ testData, onHomeClick }) => {
  var defaultData = [
    {
      id: "Screen1",
      label: "Screen 1",
      onClick: (label) => {
        handleLabelClick(label);
      },
    },
    {
      id: "Screen2",
      label: "Screen 2",
      onClick: (label) => {
        handleLabelClick(label);
      },
    },
    {
      id: "Screen2",
      label: "Screen 3",
      onClick: (label) => {
        handleLabelClick(label);
      },
    },
  ];
  var data = testData ?? defaultData;
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleButtonClick = () => {
    if (currentIndex < data.length)
      setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const handleLabelClick = (item) => {
    const clickedIndex = data.findIndex((el) => el.id === item.id);
    setCurrentIndex(clickedIndex >= 0 ? clickedIndex : -1);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <BreadCrumb
        data={data.slice(0, currentIndex + 1)}
        onHomeClick={onHomeClick ?? handleLabelClick}
        uniqueId={1705578493963}
      />
      <PrimaryButton
        uniqueId={1705578493963}
        onClick={handleButtonClick}
        label={
          currentIndex + 1 < data.length
            ? `Go to ${data[currentIndex + 1].label}`
            : `end`
        }
        isDisabled={currentIndex + 1 >= data.length}
      />
    </div>
  );
};
Template.propTypes = {
  testData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
    })
  ),
  onHomeClick: PropTypes.func,
};

export const Standard = Template.bind({});
