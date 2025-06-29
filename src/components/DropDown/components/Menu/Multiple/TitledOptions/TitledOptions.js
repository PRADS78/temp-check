import { useEffect, useMemo } from "react";
import styles from "./TitledOptions.module.scss";
import { Collapsible } from "../Collapsible";
import { useDropDownContext } from "../../../../hooks";
import PropTypes from "prop-types";
import actionTypes from "../../../../state/actionTypes";
function TitledOptions({ menuItems, automationIdPrefix }) {
  const context = useDropDownContext();
  const { dropDownDispatch, dropDownState } = context;
  const { filteredItems } = dropDownState;

  const options = useMemo(() => {
    const titles = filteredItems
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
        options: filteredItems.filter((item) => item.groupTitle === groupTitle),
      };
    });

    return titledOptions;
  }, [filteredItems]);

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
      {options.map((item, optionGroupIndex) => (
        <li
          key={optionGroupIndex}
          className={styles.titledOptionItem}
          data-dz-unique-id={`${automationIdPrefix}-${1667224292385}-${item.groupTitle?.toLowerCase()}-dropdown`}
        >
          <Collapsible
            item={item}
            menuItems={menuItems}
            automationIdPrefix={automationIdPrefix}
          />
        </li>
      ))}
    </ul>
  );
}

TitledOptions.propTypes = {
  menuItems: PropTypes.array,
  automationIdPrefix: PropTypes.string,
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default TitledOptions;
