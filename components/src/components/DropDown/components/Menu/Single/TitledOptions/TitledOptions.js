import { useEffect, useMemo } from "react";
import styles from "./TitledOptions.module.scss";
import { Collapsible } from "../Collapsible";
import { useDropDownContext } from "../../../../hooks";
import actionTypes from "../../../../state/actionTypes";
import PropTypes from "prop-types";

function TitledOptions({
  customOptionRenderer,
  menuItems,
  onChange,
  canShowTickIcon,
  automationIdPrefix,
}) {
  const context = useDropDownContext();
  const { dropDownDispatch } = context;

  const options = useMemo(() => {
    const titles = menuItems
      .reduce((acc, curr) => {
        if (!acc.includes(curr.groupTitle)) {
          return [...acc, curr.groupTitle];
        } else {
          return acc;
        }
      }, [])
      .sort();

    const titledOptions = titles.map((groupTitle) => {
      return {
        groupTitle,
        options: menuItems.filter((item) => item.groupTitle === groupTitle),
      };
    });

    return titledOptions;
  }, [menuItems]);

  useEffect(
    function updateMenuHeightFromCollapsibleExpandedState() {
      // this notifies the menu intersection observer to evaluate the menu's
      // height while accounting for the expanded state every Collpasible component
      // forgoing this will yield an inaccurate menu height resulting in unnecessary
      // blank space
      dropDownDispatch({ type: actionTypes.NOTIFY_COLLAPSIBLE_ACTION });
    },
    [dropDownDispatch]
  );

  return (
    <ul
      className={styles.titledOptions}
      onClick={(event) => event.stopPropagation()}
    >
      {options.map((item, optionGroupIndex) => {
        return (
          <li
            key={optionGroupIndex}
            className={styles.titledOptionItem}
            role="region"
            data-dz-unique-id={`${automationIdPrefix}-${1667223542715}-${item.groupTitle?.toLowerCase()}-dropdown`}
          >
            <Collapsible
              customOptionRenderer={customOptionRenderer}
              key={optionGroupIndex}
              item={item}
              menuItems={menuItems}
              onChange={onChange}
              canShowTickIcon={canShowTickIcon}
              automationIdPrefix={automationIdPrefix}
            />
          </li>
        );
      })}
    </ul>
  );
}

TitledOptions.propTypes = {
  customOptionRenderer: PropTypes.func,
  menuItems: PropTypes.array,
  onChange: PropTypes.func,
  canShowTickIcon: PropTypes.bool,
  automationIdPrefix: PropTypes.string,
};

export default TitledOptions;
