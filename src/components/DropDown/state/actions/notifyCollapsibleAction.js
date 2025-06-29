function notifyCollapsibleAction({ state }) {
  return {
    ...state,
    collapsibleNotification: Date.now(),
  };
}

export default notifyCollapsibleAction;
