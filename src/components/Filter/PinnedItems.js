import Item from "./Item";
import { TableFilterTypes } from "../../Enums";

const PinnedItems = ({
  items,
  showErrorOnLimitReachedForAFilter,
  onApply,
  onCancel,
  boundaryRef,
  recentlyAddedItemsId,
  isNonDiscreteApplyButton,
  nonDiscreteSavedFilters,
  selectedItems,
  refreshKey,
  onRemove,
  isLimitReachedForAFilter,
}) => {
  return items.map((value) => {
    let selectedItem = isNonDiscreteApplyButton
      ? nonDiscreteSavedFilters[value.id]?.selectedItem
      : selectedItems[value.id];
    let min, max;
    switch (value.type) {
      case TableFilterTypes.NUMBER:
      case TableFilterTypes.LIST:
        min = value.min;
        max = value.max;
        selectedItem = selectedItem ?? [];
        break;
      case TableFilterTypes.DATE:
        min = value.minDate;
        max = value.maxDate;
        selectedItem = selectedItem ?? [];
        break;
    }
    const isPreSelectedFilter = nonDiscreteSavedFilters[value.id] !== undefined;

    return (
      <Item
        key={`${value.id}-${refreshKey}`}
        item={value}
        min={min}
        max={max}
        selectedItem={selectedItem ?? {}}
        boundaryRef={boundaryRef}
        onApply={onApply}
        onCancel={onCancel}
        isRemovable={
          value.isPinned
            ? false
            : typeof recentlyAddedItemsId[value.id] !== "undefined"
        }
        onRemove={onRemove}
        uniqueId={`${1677744069343}-${value.id}`}
        isNonDiscreteApplyButton={isNonDiscreteApplyButton}
        isMandatory={value.isMandatory}
        showErrorOnLimitReachedForAFilter={showErrorOnLimitReachedForAFilter}
        isLimitReachedForAFilter={isLimitReachedForAFilter}
        isPreSelectedFilter={isPreSelectedFilter}
      />
    );
  });
};

export default PinnedItems;
