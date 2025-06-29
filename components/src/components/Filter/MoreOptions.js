import { Plus } from "../../Icons";
import { PlainButton } from "../AppButton";
import { List } from "./List";
import { FilterListSelectionType } from "../../Enums";
import { useState } from "react";
import PropTypes from "prop-types";
import { useLocalizerWithNameSpace } from "../../DisprzLocalizer";

const MoreOptions = ({ items, boundaryRef, onAdd }) => {
  const { getLanguageText: t } = useLocalizerWithNameSpace();
  const [referenceElement, setReferenceElement] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const popperModifiers = [
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

  const onAddFilter = (_selectedItems) => {
    if (Object.keys(_selectedItems).length > 0) {
      onAdd(_selectedItems);
    }
    setIsOpen(false);
  };

  const onCancelFilter = () => {
    setIsOpen(false);
  };

  return (
    <>
      <PlainButton
        label={t("common.more")}
        uniqueId={1671275604473}
        icon={() => {
          return <Plus className="fill" canRenderOnlyIcon />;
        }}
        onClick={() => {
          setIsOpen(true);
        }}
        ref={setReferenceElement}
      />
      <List
        key={"table-global-filter"}
        options={items}
        selectedOptions={{}}
        isSearchable={true}
        isMultiSelect={true}
        referenceElement={referenceElement}
        isOpen={isOpen}
        onApply={onAddFilter}
        onCancel={onCancelFilter}
        popperModifiers={popperModifiers}
        selectionType={FilterListSelectionType.FILTERING}
        canLimitSelection={false}
        isNonDiscreteApplyButton={false}
        isLimitReachedForAFilter={() => false}
        isPreSelectedFilter={() => false}
      />
    </>
  );
};

MoreOptions.propTypes = {
  items: PropTypes.array.isRequired,
  boundaryRef: PropTypes.object.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default MoreOptions;
