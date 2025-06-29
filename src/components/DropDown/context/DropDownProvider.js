import { createContext, useReducer, useRef } from "react";
import initialState from "../state/initialState";
import reducer from "../state/reducer";
import PropTypes from "prop-types";
import { invariant } from "../../../Utils";

const getInitialMultiSelectedItems = (defaultValue, menuItems) => {
  if (!Array.isArray(defaultValue)) {
    throw new Error(`Require value props '${defaultValue}' as Array`);
  }
  const withinMenuItems = defaultValue.every((valueItem) => {
    return menuItems.find((menuItem) => {
      return menuItem.value === valueItem;
    });
  });

  invariant(
    withinMenuItems,
    `Some of items on the value prop of the dropdown is not available on the items prop.\n Value: ${JSON.stringify(
      defaultValue
    )} \n Items: ${JSON.stringify(menuItems)} `
  );

  if (withinMenuItems) {
    const value = menuItems.filter((menuItem) => {
      return defaultValue.find((valueItem) => {
        return menuItem.value === valueItem;
      });
    });
    return value;
  }
};

const getInitialSingleSelectedItem = (defaultValue, menuItems) => {
  const initialValue = menuItems.find((item) => item.value === defaultValue);
  if (initialValue) {
    return initialValue;
  }
};

function DropDownProvider({ children, isMulti, defaultValue, menuItems }) {
  const [dropDownState, dropDownDispatch] = useReducer(
    reducer,
    initialState,
    (_initialState) => {
      if (!defaultValue) {
        return _initialState;
      }
      if (isMulti) {
        const checkedItems = getInitialMultiSelectedItems(
          defaultValue,
          menuItems
        );
        return {
          ..._initialState,
          checkedItems,
        };
      } else {
        const selectedItem = getInitialSingleSelectedItem(
          defaultValue,
          menuItems
        );
        return {
          ..._initialState,
          selectedItem,
        };
      }
    }
  );
  const containerRef = useRef();
  const listBoxRef = useRef();
  const comboBoxRef = useRef();

  return (
    <Context.Provider
      value={{
        dropDownState,
        dropDownDispatch,
        containerRef,
        listBoxRef,
        comboBoxRef,
      }}
    >
      {children}
    </Context.Provider>
  );
}

DropDownProvider.propTypes = {
  children: PropTypes.node,
  isMulti: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ]),
  menuItems: PropTypes.array,
};

export const Context = createContext();
export default DropDownProvider;
