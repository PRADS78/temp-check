import { forwardRef } from "react";
import styles from "./Slider.module.scss";
import PropTypes from "prop-types";
import "./slick.scss";
import "./slick-theme.scss";
import SlickSlider from "react-slick";
const Slider = forwardRef(function (props, ref) {
  const settings = {
    arrows: false,
    centerPadding: props.centerPadding,
    centerMode: props.centerMode,
    vertical: true,
    infinite: true,
    slidesToShow: props.slidesToShow,
    slidesToScroll: 1,
    speed: 200,
  };

  const onWheel = (event) => {
    if (event.deltaY > 0) {
      ref.current.slickNext();
    } else {
      ref.current.slickPrev();
    }
  };

  return (
    <div className={`${styles.slider} ${props.customClass}`} onWheel={onWheel}>
      <SlickSlider
        afterChange={props.onChange}
        initialSlide={props.initialSlide}
        ref={ref}
        {...settings}
      >
        {props.slides}
      </SlickSlider>
    </div>
  );
});

Slider.displayName = "Slider";

Slider.propTypes = {
  centerMode: PropTypes.bool,
  centerPadding: PropTypes.string,
  customClass: PropTypes.string,
  initialSlide: PropTypes.number,
  onChange: PropTypes.func,
  slides: PropTypes.arrayOf(PropTypes.any),
  slidesToShow: PropTypes.number,
};

Slider.defaultProps = {
  centerMode: false,
  centerPadding: "40px",
  customClass: "",
  initialSlide: 0,
  onChange: () => undefined,
  slidesToShow: 1,
};

export default Slider;
