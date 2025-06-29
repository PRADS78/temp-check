import { createRef, Component, createContext } from "react";
import AppButton from "../AppButton/AppButton";
import LocalizedOverlay from "../LocalizedOverlay/LocalizedOverlay";
import "./Helpers.scss";
import PropTypes from "prop-types";
import { HelperPositionTypes } from "../Enums";

/**
 * @deprecated
 */
class HelperProvider extends Component {
  constructor(props) {
    super(props);

    const currentHelperName = Object.keys(this.props.helpersList)[0];
    const helpers = JSON.parse(localStorage.getItem(currentHelperName));
    const currentHelperPosition =
      !helpers || helpers?.isHelperCompleted
        ? 0
        : helpers?.currentHelperPosition;

    this.state = {
      helperName: currentHelperName,
      helperList: this.getHelperList(currentHelperName),
      toShowHelpers: false,
      currentHelperPosition: currentHelperPosition,
    };

    this.onAction = this.onAction.bind(this);
    this.showHelper = this.showHelper.bind(this);
    this.onClose = this.onClose.bind(this);
    this.updateHelperPosition = this.updateHelperPosition.bind(this);
    this.helperRef = createRef();
  }

  getHelperList(helperName) {
    let currentHelperList = [];
    Object.keys(this.props.helpersList).forEach((key, index) => {
      if (key === helperName) {
        currentHelperList = Object.values(this.props.helpersList)[index];
      }
    });
    return currentHelperList;
  }

  onAction() {
    const helpers = JSON.parse(localStorage.getItem(this.state.helperName));
    if (
      !helpers ||
      helpers?.isHelperCompleted ||
      this.state.currentHelperPosition + 1 > this.state.helperList.length - 1
    ) {
      return;
    }

    this.setState({
      toShowHelpers: true,
      currentHelperPosition: this.state.currentHelperPosition + 1,
    });
  }

  showHelper(helperName, helperList, callback) {
    const helpers = JSON.parse(localStorage.getItem(helperName));
    const currentHelperPosition =
      !helpers || helpers?.isHelperCompleted
        ? 0
        : helpers?.currentHelperPosition;

    this.setState(
      {
        helperName: helperName,
        helperList: helperList || this.getHelperList(helperName),
        toShowHelpers: true,
        currentHelperPosition: currentHelperPosition,
      },
      () => {
        callback && callback(this.helperRef);
      }
    );
  }

  onClose() {
    this.setState({
      toShowHelpers: false,
    });
  }

  updateHelperPosition() {
    this.setState({
      currentHelperPosition: this.state.currentHelperPosition + 1,
    });
  }

  render() {
    return (
      <helperContext.Provider
        value={{
          onAction: this.onAction,
          showHelper: this.showHelper,
          onClose: this.onClose,
        }}
      >
        {this.props.children}
        {this.state.toShowHelpers && (
          <Helpers
            {...this.props}
            ref={this.helperRef}
            helperName={this.state.helperName}
            helpersList={this.state.helperList}
            onClose={this.onClose}
            currentHelperPosition={this.state.currentHelperPosition}
            updateHelperPosition={this.updateHelperPosition}
          />
        )}
      </helperContext.Provider>
    );
  }
}

class Helpers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      position: HelperPositionTypes.AUTO,
      positionStyle: {},
      arrowPositionStyle: {},
      animationEndClass: "animation",
    };

    this.gap = 10; //distance between helper and the element

    this.updateHelper = this.updateHelper.bind(this);
    this.removeAnimation = this.removeAnimation.bind(this); // for the animation to occur, removing the class before moving to next helper
    // so on componentDidUpdate animation class will be added
    this.checkIfHelperCenter = this.checkIfHelperCenter.bind(this);
  }

  componentDidMount() {
    if (this.props?.helpersList?.length === 0) {
      this.props.onClose();
      return;
    }

    if (this.props.helpersList[this.props.currentHelperPosition].element) {
      this.updateHelper();
    } else {
      this.checkIfHelperCenter();
      localStorage.setItem(
        this.props.helperName,
        JSON.stringify({
          currentHelperPosition: this.props.currentHelperPosition,
          isHelperCompleted: false,
        })
      );
    }
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentHelperPosition !== prevProps.currentHelperPosition) {
      const prevElementCls =
        this.props.helpersList[this.props.currentHelperPosition - 1].elementCls;
      const previousElement = document.querySelector(
        this.props.helpersList[this.props.currentHelperPosition - 1].element
      );
      if (previousElement) {
        prevElementCls && previousElement.classList.remove(`${prevElementCls}`);
      }

      if (this.props.helpersList[this.props.currentHelperPosition].element) {
        this.updateHelper();
      }
    }
  }

  componentWillUnmount() {
    if (this.props.helpersList[this.props.currentHelperPosition].element) {
      const element = document.querySelector(
        this.props.helpersList[this.props.currentHelperPosition]?.element
      );
      const elementCls =
        this.props.helpersList[this.props.currentHelperPosition]?.elementCls;
      elementCls && element?.classList.remove(elementCls);
    }
  }

  updateHelper() {
    const elementCls =
      this.props.helpersList[this.props.currentHelperPosition].elementCls;
    const currentElement = document.querySelector(
      this.props.helpersList[this.props.currentHelperPosition].element
    );

    if (!currentElement) {
      this.props.onClose();
      return;
    }
    elementCls && currentElement.classList.add(elementCls);

    const selectedPosition =
      this.props.helpersList[this.props.currentHelperPosition].position ||
      this.props.position ||
      "AUTO";
    let positionArray = [
      HelperPositionTypes.TOP,
      HelperPositionTypes.BOTTOM,
      HelperPositionTypes.LEFT,
      HelperPositionTypes.RIGHT,
    ];
    if (
      selectedPosition !== HelperPositionTypes.AUTO &&
      selectedPosition !== HelperPositionTypes.CENTER
    ) {
      const index = positionArray.findIndex(
        (position) => position === selectedPosition
      );
      positionArray.splice(index, 1);
      positionArray.unshift(selectedPosition);
    }

    let currPosition = "",
      inlineStyle = null;
    positionArray.every((position) => {
      inlineStyle = this.canPlaceHelper(position);
      if (inlineStyle) {
        currPosition = position;
        return false;
      }
      return true;
    });

    // if helper is not placeable in these positions , helper will be rendered in top left position.

    this.setState({
      position: currPosition,
      positionStyle: inlineStyle?.positionStyle,
      arrowPositionStyle: inlineStyle?.arrowPositionStyle,
      animationEndClass: "animation",
    });

    localStorage.setItem(
      this.props.helperName,
      JSON.stringify({
        currentHelperPosition: this.props.currentHelperPosition,
        isHelperCompleted: false,
      })
    );
  }

  removeAnimation() {
    this.setState({
      animationEndClass: "",
    });
  }

  getBoundingClientRectOfCurrentElement() {
    const element = document.querySelector(
      this.props.helpersList[this.props.currentHelperPosition].element
    );
    const elementRect = element.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    return {
      currentElementTop: elementRect.top,
      currentElementLeft: elementRect.left,
      currentElementBottom: bodyRect.bottom - elementRect.bottom,
      currentElementRight: bodyRect.right - elementRect.right,
      currElementWidth: elementRect.width,
      currElementHeight: elementRect.height,
    };
  }

  canPlaceHelper(position) {
    // Need to be Implemented
    // Need to include calculated scroll position of the element and place the helper functionality
    // if helper has no place and element is scrollable. helper component should try to scroll the element and place the helper
    const helpersRect = document
      .querySelector(`#${this.props.name}`)
      ?.getBoundingClientRect();
    const helpersWidth = helpersRect?.width,
      helpersHeight = helpersRect?.height;

    const currentElement = document.querySelector(
      this.props.helpersList[this.props.currentHelperPosition].element
    );
    if (position === "BOTTOM") {
      currentElement.scrollIntoViewIfNeeded(true);
    } else {
      currentElement.scrollIntoViewIfNeeded();
    }

    const bodyRect = document.body.getBoundingClientRect();

    let {
      currentElementTop,
      currentElementLeft,
      currentElementBottom,
      currentElementRight,
      currElementWidth,
      currElementHeight,
    } = this.getBoundingClientRectOfCurrentElement();

    let isSpaceAvailable = false,
      positionStyle = {},
      arrowPositionStyle = {};
    switch (position) {
      case HelperPositionTypes.TOP:
        if (currentElementTop > helpersHeight + 20) {
          //20 is to not make helper touch the screen
          isSpaceAvailable = true;
          positionStyle.top = `${currentElementTop - (helpersHeight + 20)}px`;

          if (
            currentElementRight + currElementWidth / 2 < helpersWidth / 2 ||
            currentElementLeft + currElementWidth / 2 < helpersWidth / 2
          ) {
            // do if helper cannot be placed at center of the element
            let leftPoint = 10,
              rightPoint =
                currentElementLeft + currElementWidth - helpersWidth < 10
                  ? bodyRect.width - helpersWidth
                  : currentElementLeft + currElementWidth - helpersWidth;
            if (currElementWidth + currentElementLeft > helpersWidth) {
              leftPoint = currElementWidth + currentElementLeft - helpersWidth;
            }
            if (currElementWidth + currentElementRight > helpersWidth) {
              rightPoint = currentElementLeft;
            }

            let randomValue =
              Math.random() * (Math.floor(rightPoint) - Math.ceil(leftPoint)) +
              Math.ceil(leftPoint);

            const arrowPosition =
              currentElementLeft +
              currElementWidth / 2 -
              randomValue -
              this.gap;

            positionStyle.left = `${randomValue - this.gap}px`;
            arrowPositionStyle.left = `${arrowPosition}px`;
          } else {
            positionStyle.left = `${
              currentElementLeft + currElementWidth / 2 - helpersWidth / 2
            }px`; //place helper at center
            arrowPositionStyle.left = `${helpersWidth / 2 - this.gap}px`;
          }

          let borderTopColor = "#ffffff";
          if (
            this.props.helpersList[this.props.currentHelperPosition]
              .isContentColumnar
          ) {
            const headerContainer =
              document?.querySelector(".header-container");
            if (
              headerContainer &&
              Number(arrowPositionStyle.left.replace(/px$/, "")) <
                headerContainer.getBoundingClientRect().width
            ) {
              borderTopColor = window
                ?.getComputedStyle(headerContainer)
                .getPropertyValue("background-color");
              arrowPositionStyle.borderTopColor = borderTopColor;
            } else if (
              Number(arrowPositionStyle.left.replace(/px$/, "")) <
              document?.querySelector(".bottom-section").getBoundingClientRect()
                .width
            ) {
              borderTopColor = window
                ?.getComputedStyle(document?.querySelector(".bottom-section"))
                .getPropertyValue("background-color");
              arrowPositionStyle.borderTopColor = borderTopColor;
            }
          } else {
            borderTopColor = window
              ?.getComputedStyle(document?.querySelector(".bottom-section"))
              .getPropertyValue("background-color");
          }
          arrowPositionStyle.borderTopColor = borderTopColor;
        }
        break;
      case HelperPositionTypes.BOTTOM:
        if (currentElementBottom > helpersHeight + 20) {
          isSpaceAvailable = true;
          positionStyle.top = `${currentElementTop + currElementHeight + 20}px`;

          if (
            currentElementRight + currElementWidth / 2 < helpersWidth / 2 ||
            currentElementLeft + currElementWidth / 2 < helpersWidth / 2
          ) {
            let leftPoint = 10,
              rightPoint =
                currentElementLeft + currElementWidth - helpersWidth < 10
                  ? bodyRect.width - helpersWidth
                  : currentElementLeft + currElementWidth - helpersWidth;
            if (currElementWidth + currentElementLeft > helpersWidth) {
              leftPoint = currElementWidth + currentElementLeft - helpersWidth;
            }
            if (currElementWidth + currentElementRight > helpersWidth) {
              rightPoint = currentElementLeft;
            }

            let randomValue =
              Math.random() * (Math.floor(rightPoint) - Math.ceil(leftPoint)) +
              Math.ceil(leftPoint);

            const arrowPosition =
              currentElementLeft +
              currElementWidth / 2 -
              randomValue -
              this.gap;

            positionStyle.left = `${randomValue - this.gap}px`;
            arrowPositionStyle.left = `${arrowPosition}px`;
          } else {
            positionStyle.left = `${
              currentElementLeft + currElementWidth / 2 - helpersWidth / 2
            }px`;
            arrowPositionStyle.left = `${helpersWidth / 2 - this.gap}px`;
          }

          const headerContainer = document?.querySelector(".header-container");
          const element = headerContainer
            ? ".header-container"
            : ".bottom-section";

          let borderBottomColor = "#ffffff";
          if (
            this.props.helpersList[this.props.currentHelperPosition]
              .isContentColumnar
          ) {
            const headerContainer =
              document?.querySelector(".header-container");
            if (
              headerContainer &&
              Number(arrowPositionStyle.left.replace(/px$/, "")) <
                headerContainer.getBoundingClientRect().width
            ) {
              borderBottomColor = window
                ?.getComputedStyle(headerContainer)
                .getPropertyValue("background-color");
              arrowPositionStyle.borderBottomColor = borderBottomColor;
            } else if (
              Number(arrowPositionStyle.left.replace(/px$/, "")) <
              document?.querySelector(".bottom-section").getBoundingClientRect()
                .width
            ) {
              borderBottomColor = window
                ?.getComputedStyle(document?.querySelector(".bottom-section"))
                .getPropertyValue("background-color");
              arrowPositionStyle.borderBottomColor = borderBottomColor;
            }
          } else {
            borderBottomColor = window
              ?.getComputedStyle(document?.querySelector(element))
              .getPropertyValue("background-color");
          }
          arrowPositionStyle.borderBottomColor = borderBottomColor;
        }
        break;
      case HelperPositionTypes.LEFT:
        if (currentElementLeft > helpersWidth + 20 + 60) {
          isSpaceAvailable = true;
          positionStyle.left = `${currentElementLeft - helpersWidth - 20}px`;

          if (
            currentElementTop + currElementHeight / 2 < helpersHeight / 2 ||
            currentElementBottom + currElementHeight / 2 < helpersHeight / 2
          ) {
            let topPoint = currentElementTop,
              bottomPoint = this.gap;
            if (currentElementTop + currElementHeight > helpersHeight) {
              topPoint = currElementWidth + currentElementLeft - helpersWidth;
            }
            if (currentElementBottom + currElementHeight > helpersHeight) {
              bottomPoint = currentElementTop;
            }

            let randomValue =
              Math.random() * (Math.floor(bottomPoint) - Math.ceil(topPoint)) +
              Math.ceil(topPoint);

            const arrowPosition =
              currentElementTop + currElementHeight / 2 - randomValue;

            positionStyle.top = `${randomValue - this.gap}px`;
            arrowPositionStyle.top = `${arrowPosition - this.gap}px`;
          } else {
            positionStyle.top = `${
              currentElementTop + currElementHeight / 2 - helpersHeight / 2
            }px`;
            arrowPositionStyle.top = `${helpersHeight / 2 - this.gap}px`;
          }

          if (
            this.props.helpersList[this.props.currentHelperPosition]
              .isContentColumnar
          ) {
            const headerContainer =
              document?.querySelector(".header-container");
            const element = headerContainer
              ? ".header-container"
              : ".bottom-section";
            const borderLeftColor = window
              ?.getComputedStyle(document?.querySelector(element))
              .getPropertyValue("background-color");
            arrowPositionStyle.borderLeftColor = borderLeftColor;
          } else {
            const headerContainer =
              document?.querySelector(".header-container");
            if (
              headerContainer &&
              Number(arrowPositionStyle.top.replace(/px$/, "")) <
                headerContainer.getBoundingClientRect().height
            ) {
              const borderLeftColor = window
                ?.getComputedStyle(headerContainer)
                .getPropertyValue("background-color");
              arrowPositionStyle.borderLeftColor = borderLeftColor;
            } else if (
              Number(arrowPositionStyle.top.replace(/px$/, "")) >
              headerContainer.getBoundingClientRect().height
            ) {
              const borderLeftColor = window
                ?.getComputedStyle(document?.querySelector(".bottom-section"))
                .getPropertyValue("background-color");
              arrowPositionStyle.borderLeftColor = borderLeftColor;
            }
          }
        }
        break;
      case HelperPositionTypes.RIGHT:
        if (currentElementRight > helpersWidth + 20 + 60) {
          //60 is for close icon distance handling
          isSpaceAvailable = true;
          positionStyle.left = `${
            currentElementLeft + currElementWidth + 20
          }px`;
          if (
            currentElementTop + currElementHeight / 2 < helpersHeight / 2 ||
            currentElementBottom + currElementHeight / 2 < helpersHeight / 2
          ) {
            let topPoint = currentElementTop,
              bottomPoint = 10;
            if (currentElementTop + currElementHeight > helpersHeight) {
              topPoint = currElementWidth + currentElementLeft - helpersWidth;
            }
            if (currentElementBottom + currElementHeight > helpersHeight) {
              bottomPoint = currentElementTop;
            }

            let randomValue =
              Math.random() * (Math.floor(bottomPoint) - Math.ceil(topPoint)) +
              Math.ceil(topPoint);

            const arrowPosition =
              currentElementTop + currElementHeight / 2 - randomValue;

            positionStyle.top = `${randomValue - this.gap}px`;
            arrowPositionStyle.top = `${arrowPosition - this.gap}px`;
          } else {
            positionStyle.top = `${
              currentElementTop + currElementHeight / 2 - helpersHeight / 2
            }px`;
            arrowPositionStyle.top = `${helpersHeight / 2 - this.gap}px`;
          }

          if (
            this.props.helpersList[this.props.currentHelperPosition]
              .isContentColumnar
          ) {
            const borderRightColor = window
              ?.getComputedStyle(document?.querySelector(".bottom-section"))
              .getPropertyValue("background-color");
            arrowPositionStyle.borderRightColor = borderRightColor;
          } else {
            const headerContainer =
              document?.querySelector(".header-container");
            if (
              headerContainer &&
              Number(arrowPositionStyle.top.replace(/px$/, "")) <
                headerContainer.getBoundingClientRect().height
            ) {
              const borderRightColor = window
                ?.getComputedStyle(headerContainer)
                .getPropertyValue("background-color");
              arrowPositionStyle.borderRightColor = borderRightColor;
            } else if (
              Number(arrowPositionStyle.top.replace(/px$/, "")) <
              document?.querySelector(".bottom-section").getBoundingClientRect()
                .height
            ) {
              const borderRightColor = window
                ?.getComputedStyle(document?.querySelector(".bottom-section"))
                .getPropertyValue("background-color");
              arrowPositionStyle.borderRightColor = borderRightColor;
            }
          }
        }
        break;
      default:
        isSpaceAvailable = false;
    }
    return isSpaceAvailable ? { positionStyle, arrowPositionStyle } : null;
  }

  checkIfHelperCenter() {
    this.setState({
      position: HelperPositionTypes.CENTER,
      positionStyle: null,
      arrowPositionStyle: null,
      animationEndClass: "animation",
    });
  }

  renderHeaderSection() {
    const ImageComponent =
        this.props.helpersList[this.props.currentHelperPosition]?.header
          ?.imageComponent,
      imageUrl =
        this.props.helpersList[this.props.currentHelperPosition]?.header?.url;

    const toRender = (
      <div className={`header-container`}>
        {ImageComponent ? (
          <ImageComponent />
        ) : imageUrl ? (
          <img src={imageUrl} alt="helper-image" />
        ) : null}
      </div>
    );

    return ImageComponent || imageUrl ? toRender : "";
  }

  renderBottomSection() {
    return (
      <div className="bottom-section">
        {this.renderContentSection()}
        {this.renderNavigationSection()}
      </div>
    );
  }

  renderContentSection() {
    const title =
        this.props.helpersList[this.props.currentHelperPosition].content.title,
      description =
        this.props.helpersList[this.props.currentHelperPosition].content
          .description;

    return (
      <div className={`content-container`}>
        <div className={`title`}>{title}</div>
        <div
          className={`description`}
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
      </div>
    );
  }

  renderHelperProgress() {
    // Could be Implemented
    // progress circles like instagram could be implemented
    return [...Array(this.props.helpersList.length)].map((item, index) => {
      return (
        <div
          key={index}
          className={`indicator
                        ${
                          index <= this.props.currentHelperPosition
                            ? "fill-indicator"
                            : ""
                        }`}
        />
      );
    });
  }

  renderNavigationSection() {
    const actionRequired =
        this.props.helpersList[this.props.currentHelperPosition].requireAction,
      nextElement =
        this.props.helpersList[this.props.currentHelperPosition + 1]?.element;
    const shouldNotClose =
      !actionRequired || (nextElement && document.querySelector(nextElement));

    return (
      <div className={`navigation-container`}>
        <div className={`progress-indicator`}>
          {this.renderHelperProgress()}
        </div>
        <div className="next-btn">
          <AppButton
            ctrCls={""}
            buttonLabel={
              this.props.currentHelperPosition !=
                this.props.helpersList.length - 1 && shouldNotClose
                ? `Next`
                : `Close`
            }
            clickHandler={
              this.props.currentHelperPosition !=
                this.props.helpersList.length - 1 && shouldNotClose
                ? () => {
                    this.props.updateHelperPosition();
                    this.removeAnimation();
                    if (
                      !this.props.helpersList[
                        this.props.currentHelperPosition + 1
                      ].element
                    ) {
                      this.checkIfHelperCenter();
                      localStorage.setItem(
                        this.props.helperName,
                        JSON.stringify({
                          currentHelperPosition:
                            this.props.currentHelperPosition + 1,
                          isHelperCompleted: false,
                        })
                      );
                    }
                  }
                : () => {
                    localStorage.setItem(
                      this.props.helperName,
                      JSON.stringify({
                        currentHelperPosition: this.props.currentHelperPosition,
                        isHelperCompleted:
                          this.props.currentHelperPosition ===
                          this.props.helpersList.length - 1,
                      })
                    );
                    this.props.onClose();
                  }
            }
          />
        </div>
      </div>
    );
  }

  renderCloseIcon() {
    const actionRequired =
        this.props.helpersList[this.props.currentHelperPosition].requireAction,
      nextElement =
        this.props.helpersList[this.props.currentHelperPosition + 1]?.element;
    const isRequiredActionDoneAndNotLastElement =
      !actionRequired || (nextElement && document.querySelector(nextElement));
    return (
      isRequiredActionDoneAndNotLastElement && (
        <AppButton
          ctrCls={`close close-btn ${
            this.state.position === "LEFT" ? "close-btn-left" : ""
          }`}
          clickHandler={() => {
            localStorage.setItem(
              this.props.helperName,
              JSON.stringify({
                currentHelperPosition: this.props.currentHelperPosition,
                isHelperCompleted: true,
              })
            );
            this.props.onClose();
          }}
          buttonIconCls={"icon-wrong"}
          type="plain"
        />
      )
    );
  }

  render() {
    return (
      <LocalizedOverlay
        ctrCls={`helpers overlay-color ${this.props.overlayCls}`}
      >
        <div
          id={`${this.props.name}`}
          className={`helper-container ${
            this.props.helpersList[this.props.currentHelperPosition]
              ?.isContentColumnar
              ? "columnar"
              : "stacked"
          } ${this.props.primaryCtrClass} ${
            this.props.helpersList[this.props.currentHelperPosition]
              ?.secondaryCtrCls
          } ${this.state.animationEndClass} ${
            this.state.position === "CENTER" ? "helper-center" : ""
          }`}
          style={
            this.state.position === HelperPositionTypes.CENTER
              ? {}
              : this.state.positionStyle
          }
        >
          <div
            className={`content-wrapper-container ${
              this.props.helpersList[this.props.currentHelperPosition]
                ?.isContentColumnar
                ? "columnar"
                : "stacked"
            }`}
          >
            {this.renderHeaderSection()}
            {this.renderBottomSection()}
          </div>
          {this.renderCloseIcon()}
          {this.state.position !== HelperPositionTypes.CENTER && (
            <div
              className={`arrow arrow-${this.state.position.toLowerCase()}`}
              style={this.state?.arrowPositionStyle}
            />
          )}
        </div>
      </LocalizedOverlay>
    );
  }
}

Helpers.propTypes = {
  helperName: PropTypes.string,
  helpersList: PropTypes.shape([
    {
      element: PropTypes.element,
      elementCls: PropTypes.string,
      header: {
        imageComponent: PropTypes.elementType,
        url: PropTypes.string,
      },
      content: {
        title: PropTypes.string,
        description: PropTypes.string,
      },
      secondaryCtrCls: PropTypes.string,
      position: PropTypes.oneOf([...Object.values(HelperPositionTypes)]),
      requireAction: PropTypes.bool,
      isContentColumnar: PropTypes.bool,
    },
  ]),
  currentHelperPosition: PropTypes.number,
  onClose: PropTypes.func,
  primaryCls: PropTypes.string,
  position: PropTypes.string,
  overlayCls: PropTypes.string,
  name: PropTypes.string,
  children: PropTypes.any,
  primaryCtrClass: PropTypes.string,
  updateHelperPosition: PropTypes.func,
};

Helpers.defaultProps = {};

HelperProvider.propTypes = {
  /**
   * Specify all helpers details needed for the helper in an object
   */

  /*
    Props that need to be passed inside helperList

    helperList = {
        "helperName" : [    // name the helperList that will be stored in localStorage for accessing the helperList
            // list the helpers needed to be shown
            {
                element:'',                     // id or class of the element to which helper needed to be shown. For center align not needed.
                elementCls: '',                 // if any css style should be applied on the element when helper shows
                header:
                {
                    imageComponent: ReactComponent // give image as component
                    url : ''                    // url of GIF
                },
                content:
                {
                    title: '',                  // title of the helper
                    description: '',            // description of the helper
                },
                secondaryCtrCls: '',            // css class  to override default styles of the helper
                position: '',                   // position of the helper
                requireAction: boolean,         //if after any action the next helper has to be shown
                isContentColumnar: boolean      //if image and text need to be shown as column
            }
        ]
    }

    */
  helpersList: PropTypes.shape({
    helperName: Helpers.propTypes.helpersList,
  }),
  /**
   * Specify custom class for the helper
   */
  primaryCls: PropTypes.string,
  /**
   *  position of the helper
   */
  position: PropTypes.string,
  /**
   *  custom overlay class for the helper
   */
  overlayCls: PropTypes.string,
  /**
   * custom id for the helper
   */
  name: PropTypes.string,
  children: PropTypes.any,
};

HelperProvider.defaultProps = {
  helpersList: {},
  primaryCls: "",
  position: HelperPositionTypes.AUTO,
  overlayCls: "",
  name: "helpers",
};

/**
 * @deprecated
 */
export const helperContext = createContext();

export default HelperProvider;
