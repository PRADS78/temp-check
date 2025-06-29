const setInteractionType = function ({ state, action }) {
  return {
    ...state,
    interactionType: action.payload.interactionType,
  };
};

export default setInteractionType;
