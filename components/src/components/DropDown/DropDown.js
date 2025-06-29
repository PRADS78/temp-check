import styles from "./DropDown.module.scss";
import PropTypes from "prop-types";
import { DropDownMenuPlacement, DropDownOptionTypes } from "../../Enums";
import { Container } from "./components/Container";
import { Menu } from "./components/Menu";
import { Selection } from "./components/Selection";
import { ArrowIcon } from "./components/ArrowIcon";
import { ClearButton } from "./components/ClearButton";
import DropDownProvider from "./context/DropDownProvider";
import { Label } from "../Label";
import { useEffect } from "react";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import { DropDownPosition, PopperReferenceStrategies } from "../../Enums/index";

function DropDown(props) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "DropDown");
    invariantUniqueId(props.uniqueId, "DropDown");
  }, [automationIdPrefix, props.uniqueId]);

  return (
    <DropDownProvider
      isMulti={props.isMulti}
      defaultValue={props.value}
      menuItems={props.items}
    >
      {props.label ? (
        <Label
          ctrCls={props.labelCtrCls}
          text={props.label}
          uniqueId={1667226292581}
        />
      ) : null}
      <Container
        dropDownClass={`${styles.dropDown}`}
        ctrCls={props.ctrCls}
        isDisabled={props.isDisabled}
        isSearchable={props.isSearchable}
        name={props.name}
        automationIdPrefix={automationIdPrefix}
        uniqueId={props.uniqueId}
        items={props.items}
      >
        <Selection
          isClearable={props.isClearable}
          isDisabled={props.isDisabled}
          isMulti={props.isMulti}
          isSearchable={props.isSearchable}
          menuItems={props.items}
          onChange={props.onChange}
          placeholder={props.placeholder}
          itemsType={props.itemsType}
          isSearchDisabledTemporarily={
            props.itemsType === DropDownOptionTypes.GROUPED
          } // Temporarily disabling it, as search is not implemented for Grouped Single selection
        />
        <ClearButton
          isClearable={props.isClearable}
          isMulti={props.isMulti}
          menuItems={props.items}
          onChange={props.onChange}
          isDisabled={props.isDisabled}
        />
        <ArrowIcon
          isClearable={props.isClearable}
          isDisabled={props.isDisabled}
          isMulti={props.isMulti}
          menuItems={props.items}
        />
        <Menu
          customOptionRenderer={props.customOptionRenderer}
          dropDownClass={styles.dropDown}
          intersectionRef={props.intersectionRef}
          isMulti={props.isMulti}
          menuItems={props.items}
          onChange={props.onChange}
          itemsType={props.itemsType}
          position={props.position}
          isSearchable={props.isSearchable}
          value={props.value}
          canShowTickIcon={props.canShowTickIcon}
          canShowScrollBar={props.canShowScrollBar}
          automationIdPrefix={automationIdPrefix}
          canUsePortal={props.canUsePortal}
          maxHeight={props.maxHeight}
          isMenuWidthSameAsReference={props.isMenuWidthSameAsReference}
          menuCtrCls={props.menuCtrCls}
          popperReferenceStrategy={props.popperReferenceStrategy}
        />
      </Container>
    </DropDownProvider>
  );
}

DropDown.propTypes = {
  /**
   * Specify the list of dropdown items to make the dropdown values
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.number,
        PropTypes.array,
        PropTypes.object,
      ]),
      selectedLabel: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.number,
        PropTypes.array,
        PropTypes.object,
      ]),
      isDisabled: PropTypes.bool,
    })
  ).isRequired,
  /**
   * Define name for the input identity
   */
  name: PropTypes.string,
  /**
   * Specify the value prop for the dropdown
   */
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ]),
  /**
   * Container class for the DropDown
   */
  ctrCls: PropTypes.string,
  /**
   * Boolean to specify if the dropdown is multi-selectable
   */
  isMulti: PropTypes.bool,
  /**
   * Custom template for rendering DropDown option
   *
   * ```js
   * function CustomOption(props) {
   *     const {data} = props;
   *     const {label, selected} = data;
   *     return (
   *         <div className={styles.customOption}>
   *             <div>{label}</div>
   *             {selected ? <CheckIcon /> : null}
   *         </div>
   *     )
   * }
   *
   * function App() {
   *    return <DropDown customOptionRenderer={CustomOption} options={options} />;
   * }
   * ```
   *
   */
  customOptionRenderer: PropTypes.func,
  label: PropTypes.string,
  /**
   * Items Menu Placement for the DropDown **(deprecated)**
   */
  menuPlacement: PropTypes.oneOf([
    DropDownMenuPlacement.AUTO,
    DropDownMenuPlacement.BOTTOM,
    DropDownMenuPlacement.TOP,
  ]),
  /**
   * Items Menu Position for the DropDown
   */
  position: PropTypes.oneOf([DropDownPosition.BOTTOM, DropDownPosition.TOP]),
  /**
   * Callback function when the dropdown value changes
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Specify the placeholder text for the dropdown
   */
  placeholder: PropTypes.string,
  /**
   * Boolean to determine if the DropDown can be cleared
   */
  isClearable: PropTypes.bool,
  /**
   * Boolean to determine if the DropDown is disabled
   */
  isDisabled: PropTypes.bool,
  /**
   * Boolean to determine if the DropDown is searchable
   */
  isSearchable: PropTypes.bool,
  /**
   * Specify the type of the items in the dropdown
   */
  itemsType: PropTypes.oneOf([
    DropDownOptionTypes.STANDARD,
    DropDownOptionTypes.GROUPED,
  ]),
  /**
   * The value must be from a ref created by the useRef hook;
   * Intersection calculation will use the window's innerHeight if this prop is not given a value;
   * This is to prevent the menu from overflowing the containing element
   *
   * ```js
   * const boundingRef = useRef();
   * <div ref={boundingRef}>
   *  <DropDown intersectionRef={boundingRef} />
   * </div>
   * ```
   *
   */
  intersectionRef: PropTypes.any,
  /**
   * Specify the class name for the label container
   */
  labelCtrCls: PropTypes.string,
  /**
   * Boolean to determine if the tick icon is shown for a selected item
   */
  canShowTickIcon: PropTypes.bool,
  /**
   * Determines whether to show scroll bar for the dropdown menu
   */
  canShowScrollBar: PropTypes.bool,
  /**
   * This is required for QA automation testing, should be hardcoded output of Date.now()
   */
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  /**
   * Boolean to determine if the dropdown menu can be rendered in a portal to resolve z-index issues
   */
  canUsePortal: PropTypes.bool,
  /**
   * Specify the max height for the dropdown menu
   */
  maxHeight: PropTypes.number,
  /**
   * Boolean to determine if the dropdown menu width samewidth as reference width
   */
  isMenuWidthSameAsReference: PropTypes.bool,
  /**
   * Specify the class name for the menu
   */
  menuCtrCls: PropTypes.string,
  /**
   * Reference strategy for popper component, you can use enum `PopperReferenceStrategies`
   */
  popperReferenceStrategy: PropTypes.oneOf(
    Object.values(PopperReferenceStrategies)
  ),
};

DropDown.defaultProps = {
  isSearchable: false,
  onChange: () => undefined,
  itemsType: DropDownOptionTypes.STANDARD,
  value: null,
  intersectionRef: undefined,
  labelCtrCls: "",
  menuPlacement: DropDownMenuPlacement.BOTTOM,
  position: DropDownPosition.BOTTOM,
  canShowTickIcon: true,
  canShowScrollBar: true,
  canUsePortal: false,
  maxHeight: undefined,
  isMenuWidthSameAsReference: true,
  menuCtrCls: "",
};

export default DropDown;
