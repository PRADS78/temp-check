import PropTypes from "prop-types";
import { useState, useMemo, useEffect } from "react";
import { TableFilterListSubTypes, TableFilterTypes } from "../../Enums";
import { useAutomationIdPrefix } from "../../AutomationIdPrefix";
import { invariantAutomationPrefixId, invariantUniqueId } from "../../Utils";
import FilterMenu from "./Menu";
import FilterButton from "./Button";

function Item({
  selectedItem,
  min,
  max,
  boundaryRef,
  onApply,
  onCancel,
  isRemovable,
  onRemove,
  uniqueId,
  isNonDiscreteApplyButton,
  showErrorOnLimitReachedForAFilter,
  isLimitReachedForAFilter,
  isPreSelectedFilter,
  item,
}) {
  const automationIdPrefix = useAutomationIdPrefix();

  useEffect(() => {
    invariantAutomationPrefixId(automationIdPrefix, "FilterItem");
    invariantUniqueId(uniqueId, "FilterItem");
  }, [automationIdPrefix, uniqueId]);

  const [referenceElement, setReferenceElement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const {
    label,
    type,
    options,
    isMultiSelect,
    isSearchable,
    id,
    onOpen,
    subType,
    onReachBottom,
    onQuickActions,
    isMandatory,
    onExternalSearch,
  } = item;

  const selectedItemsLength = useMemo(() => {
    switch (type) {
      case TableFilterTypes.DATE:
      case TableFilterTypes.NUMBER:
        return selectedItem.length > 0 ? 1 : 0;
      case TableFilterTypes.LIST:
        return Object.keys(selectedItem).length;
    }
  }, [selectedItem, type]);
  const popperModifiers = useMemo(() => {
    return [
      {
        name: "offset",
        options: {
          offset: [0, 6],
        },
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: ["bottom-start"],
          boundary: boundaryRef,
        },
      },
    ];
  }, [boundaryRef]);

  const _onApply = (_selectedItem) => {
    onApply({
      selectedItem: _selectedItem,
      id: id.toString(),
      type,
    });
    setIsOpen(false);
  };

  const _onCancel = () => {
    onCancel({ type, id });
    setIsOpen(false);
  };

  const canRestrictItemChanges =
    isNonDiscreteApplyButton &&
    !isPreSelectedFilter &&
    isLimitReachedForAFilter();

  return (
    <>
      <FilterButton
        isRemovable={isRemovable}
        isMandatory={isMandatory}
        onRemove={(e) => {
          e.stopPropagation();
          onRemove(type, id);
        }}
        label={label}
        automationIdPrefix={automationIdPrefix}
        uniqueId={uniqueId}
        selectedItemsLength={selectedItemsLength}
        onOpen={() => {
          if (!isOpen) {
            setIsOpen(true);
          }
        }}
        setReferenceElement={setReferenceElement}
      />
      {!!referenceElement && (
        <FilterMenu
          referenceElement={referenceElement}
          isOpen={isOpen}
          onApply={_onApply}
          onCancel={_onCancel}
          popperModifiers={popperModifiers}
          type={type}
          id={id}
          options={options}
          selectedItem={selectedItem}
          min={min}
          max={max}
          isMultiSelect={isMultiSelect}
          isSearchable={isSearchable}
          onOpen={onOpen}
          subType={subType}
          onReachBottom={onReachBottom}
          onExternalSearch={onExternalSearch}
          isNonDiscreteApplyButton={isNonDiscreteApplyButton}
          showErrorOnLimitReachedForAFilter={showErrorOnLimitReachedForAFilter}
          canRestrictItemChanges={canRestrictItemChanges}
          onQuickActions={onQuickActions}
          isMandatory={isMandatory}
        />
      )}
    </>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string,
    isMandatory: PropTypes.bool,
    isSearchable: PropTypes.bool,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
    type: PropTypes.oneOf([
      TableFilterTypes.LIST,
      TableFilterTypes.DATE,
      TableFilterTypes.NUMBER,
    ]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isMultiSelect: PropTypes.bool,
    onOpen: PropTypes.func,
    subType: PropTypes.oneOf([
      TableFilterListSubTypes.ON_DEMAND,
      TableFilterListSubTypes.PAGINATED,
      TableFilterListSubTypes.FULLY_CUSTOMISABLE,
    ]),
    onReachBottom: PropTypes.func,
    onQuickActions: PropTypes.func,
    onExternalSearch: PropTypes.func,
  }),
  selectedItem: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  boundaryRef: PropTypes.object,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  isRemovable: PropTypes.bool,
  onRemove: PropTypes.func,
  uniqueId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  isNonDiscreteApplyButton: PropTypes.bool,
  showErrorOnLimitReachedForAFilter: PropTypes.func,
  isLimitReachedForAFilter: PropTypes.func,
  isPreSelectedFilter: PropTypes.bool,
};

export default Item;
