import { useCallback } from "react";
import PropTypes from "prop-types";
import styles from "./UdfSelector.module.scss";
import DropDown from "../DropDown/DropDown";
import { Minus } from "@disprz/icons";

const UdfItem = ({
  ctrCls,
  currentUdf,
  index,
  leftItems,
  leftDropDownCustomization,
  onChangeLeftDropdownItems,
  rightItems,
  rightDropDownCustomization,
  onChangeRightDropdownItems,
  onRemove,
}) => {
  const rightValues = currentUdf.udfFieldValues.map((udfValues) => {
    return udfValues.value;
  });

  const renderRemoveButtons = () => {
    const isDisabled = !(currentUdf.udfFieldId !== -1);
    return (
      <Minus
        className={`squared ${styles.minus} ${
          isDisabled ? styles.removeIconHidden : styles.removeIcon
        }`}
        onClick={() => onRemove(index)}
        data-role="remove"
        isDisabled={isDisabled}
        uniqueId={1667217402495}
      />
    );
  };

  const _onChangeRightDropDown = useCallback(
    (values) => {
      onChangeRightDropdownItems(values, index);
    },
    [index, onChangeRightDropdownItems]
  );

  return (
    <div className={`${styles.udfSelectorRow} ${ctrCls}`}>
      <DropDown
        ctrCls={`${styles.udfSelectorSingleDropdown} ${leftDropDownCustomization?.ctrCls}`}
        placeholder={`${leftDropDownCustomization?.placeholder}`}
        items={leftItems}
        value={currentUdf.udfFieldId}
        onChange={(values) => onChangeLeftDropdownItems(values, index)}
        isSearchable={true}
        intersectionRef={leftDropDownCustomization?.intersectionRef}
        menuPlacement={leftDropDownCustomization?.position}
        canUsePortal={leftDropDownCustomization?.canUsePortal}
        maxHeight={leftDropDownCustomization?.maxHeight}
        uniqueId={1667217362029}
      />
      <DropDown
        ctrCls={`${styles.udfSelectorMultiDropdown} ${rightDropDownCustomization?.ctrCls} `}
        placeholder={`${rightDropDownCustomization?.placeholder}`}
        items={rightItems?.items === undefined ? [] : rightItems.items}
        value={rightValues}
        onChange={_onChangeRightDropDown}
        isMulti={true}
        isDisabled={currentUdf.udfFieldId === -1}
        isSearchable={true}
        intersectionRef={rightDropDownCustomization?.intersectionRef}
        menuPlacement={rightDropDownCustomization?.position}
        canUsePortal={rightDropDownCustomization?.canUsePortal}
        maxHeight={rightDropDownCustomization?.maxHeight}
        uniqueId={1667217376031}
      />
      {renderRemoveButtons(index)}
    </div>
  );
};

UdfItem.propTypes = {
  ctrCls: PropTypes.string,
  currentUdf: PropTypes.object,
  index: PropTypes.number,
  leftItems: PropTypes.array,
  leftDropDownCustomization: PropTypes.object,
  onChangeLeftDropdownItems: PropTypes.func,
  rightItems: PropTypes.object,
  rightDropDownCustomization: PropTypes.object,
  onChangeRightDropdownItems: PropTypes.func,
  onRemove: PropTypes.func,
};

export default UdfItem;
