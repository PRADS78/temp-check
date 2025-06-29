function setOptionGroupExpanded({ state, action }) {
  return {
    ...state,
    optionGroupExpanded: action.payload.optionGroupExpanded,
  };
}

export default setOptionGroupExpanded;
