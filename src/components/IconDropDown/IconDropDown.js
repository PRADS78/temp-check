import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Options } from "@disprz/icons";
import { Menu } from "../AppButton";
import styles from "./IconDropDown.module.scss";
import { SimpleMenuPositions } from "../../Enums";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

function IconDropDown({
  options,
  iconCls = "squared",
  position,
  canUsePortal,
  popperCtrCls,
}) {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const optionButtonRef = useRef(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  return (
    <>
      <Options
        className={`${styles.options} ${iconCls} `}
        onClick={(e) => {
          setIsOptionsVisible((prevState) => !prevState);
          e.stopPropagation();
        }}
        uniqueId={1667892227601}
        ref={optionButtonRef}
        title={`${t("common.more")} ${t("common.options")}`}
      />
      <Menu
        items={options}
        isVisible={isOptionsVisible}
        onChangeVisibility={setIsOptionsVisible}
        ctrCls={styles.selectActionOptions}
        onItemClick={(item) => {
          item.onClick(item);
        }}
        uniqueId={1667546024715}
        referenceRef={optionButtonRef.current}
        position={position}
        popperCtrCls={`${styles.menuPopper} ${popperCtrCls}`}
        canUsePortal={canUsePortal}
      />
    </>
  );
}

IconDropDown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onClick: PropTypes.func,
      icon: PropTypes.func,
    })
  ),
  iconCls: PropTypes.string,
  position: PropTypes.oneOf(Object.values(SimpleMenuPositions)),
  canUsePortal: PropTypes.bool,
  popperCtrCls: PropTypes.string,
};

IconDropDown.defaultProps = {
  options: [],
  iconCls: "squared",
  canUsePortal: false,
  popperCtrCls: "",
  position: SimpleMenuPositions.BOTTOM_END,
};

export default IconDropDown;
