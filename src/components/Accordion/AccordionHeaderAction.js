import PropTypes from "prop-types";
import { useMemo } from "react";
import { PlainButton, PrimaryButton } from "../AppButton";
import { IconDropDown } from "../IconDropDown";
import styles from "./Accordion.module.scss";

const AccordionHeaderActions = ({ actions, noOfActionsToRenderUpFront }) => {
  const _selectActions = useMemo(() => {
    return actions.slice(0, noOfActionsToRenderUpFront);
  }, [noOfActionsToRenderUpFront, actions]);

  const selectHiddenOptions = useMemo(() => {
    if (actions.length > noOfActionsToRenderUpFront) {
      return actions.slice(noOfActionsToRenderUpFront);
    }
    return [];
  }, [noOfActionsToRenderUpFront, actions]);

  const renderActionButtons = () => {
    return (
      <>
        {_selectActions.length > 0 ? (
          <div className={styles.buttonContainer}>
            {_selectActions.map((action, index) => {
              const ButtonComponent = index === 0 ? PrimaryButton : PlainButton;
              return (
                <ButtonComponent
                  label={action.label}
                  onClick={action.onClick}
                  ctrCls={index !== 0 ? styles.buttonCls : ""}
                  icon={action.icon}
                  uniqueId={`${1669378843958}-${action.value}`}
                  key={action.value}
                />
              );
            })}
          </div>
        ) : null}
        {selectHiddenOptions.length > 0 && (
          <IconDropDown options={selectHiddenOptions} iconCls="" canUsePortal />
        )}
      </>
    );
  };

  return <div className={styles.actionsContainer}>{renderActionButtons()}</div>;
};

AccordionHeaderActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      onClick: PropTypes.func,
      icon: PropTypes.string,
    })
  ),
  noOfActionsToRenderUpFront: PropTypes.number,
};

export default AccordionHeaderActions;
