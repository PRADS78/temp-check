import PropTypes from "prop-types";
import { TableFilterListSubTypes, TableFilterTypes } from "../../Enums";
import { FilterDateRange, FilterList, FilterRange } from "../Filter";
import { PaginatedList } from "./List";
import OnDemandList from "./List/OnDemandList";
import FullyCustomisableList from "./List/FullyCustomisableList";

function Menu({
  type,
  id,
  selectedItem,
  referenceElement,
  isOpen,
  onApply,
  onCancel,
  popperModifiers,
  min,
  max,
  options,
  isMultiSelect,
  isSearchable,
  subType,
  onOpen,
  onReachBottom,
  isNonDiscreteApplyButton,
  showErrorOnLimitReachedForAFilter,
  canRestrictItemChanges,
  onQuickActions,
  isMandatory,
  onExternalSearch,
}) {
  const commonProps = {
    referenceElement,
    isOpen,
    onApply,
    onCancel,
    popperModifiers,
    isNonDiscreteApplyButton,
    id,
    showErrorOnLimitReachedForAFilter,
    canRestrictItemChanges,
    min,
    max,
    isMandatory,
  };

  const renderListSubType = () => {
    switch (subType) {
      case TableFilterListSubTypes.ON_DEMAND:
        return (
          <OnDemandList
            key={`${type}-${id}`}
            options={options}
            selectedOptions={selectedItem}
            isSearchable={isSearchable}
            isMultiSelect={isMultiSelect}
            onOpen={onOpen}
            {...commonProps}
          />
        );
      case TableFilterListSubTypes.PAGINATED:
        return (
          <PaginatedList
            key={`${type}-${id}`}
            options={options}
            selectedOptions={selectedItem}
            isSearchable={isSearchable}
            isMultiSelect={isMultiSelect}
            onReachBottom={onReachBottom}
            {...commonProps}
          />
        );
      case TableFilterListSubTypes.FULLY_CUSTOMISABLE:
        return (
          <FullyCustomisableList
            key={`${type}-${id}`}
            options={options}
            selectedOptions={selectedItem}
            isSearchable={true}
            isMultiSelect={isMultiSelect}
            onOpen={onOpen}
            onReachBottom={onReachBottom}
            onExternalSearch={onExternalSearch}
            {...commonProps}
          />
        );
      default:
        return (
          <FilterList
            key={`${type}-${id}`}
            options={options}
            selectedOptions={selectedItem}
            isSearchable={isSearchable}
            isMultiSelect={isMultiSelect}
            {...commonProps}
          />
        );
    }
  };

  switch (type) {
    case TableFilterTypes.LIST:
      return renderListSubType();
    case TableFilterTypes.DATE:
      return (
        <FilterDateRange
          key={`${type}-${id}`}
          selectedRange={selectedItem}
          onQuickActions={onQuickActions}
          {...commonProps}
        />
      );
    case TableFilterTypes.NUMBER:
      return (
        <FilterRange
          key={`${type}-${id}`}
          selectedMin={selectedItem?.[0]}
          selectedMax={selectedItem?.[1]}
          {...commonProps}
        />
      );
    /* istanbul ignore next */
    default:
      return null;
  }
}

Menu.propTypes = {
  referenceElement: PropTypes.object,
  isOpen: PropTypes.bool,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  popperModifiers: PropTypes.array,
  type: PropTypes.oneOf(Object.values(TableFilterTypes)),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedItem: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.object,
  ]),
  options: PropTypes.array,
  isMultiSelect: PropTypes.bool,
  isSearchable: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
  onOpen: PropTypes.func,
  subType: PropTypes.oneOf([
    TableFilterListSubTypes.ON_DEMAND,
    TableFilterListSubTypes.PAGINATED,
    TableFilterListSubTypes.FULLY_CUSTOMISABLE,
  ]),
  onReachBottom: PropTypes.func,
  isNonDiscreteApplyButton: PropTypes.bool,
  showErrorOnLimitReachedForAFilter: PropTypes.func,
  canRestrictItemChanges: PropTypes.bool,
  onQuickActions: PropTypes.func,
  isMandatory: PropTypes.bool,
  onExternalSearch: PropTypes.func,
};

export default Menu;
