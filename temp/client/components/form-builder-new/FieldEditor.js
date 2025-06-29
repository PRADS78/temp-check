import { useState, useRef, useEffect } from "react";
import { useDragAndDrop, createDragItem } from "../../hooks/useDragAndDrop";
import { FIELD_TYPES, DATE_FORMATS } from "../../lib/form-schema";
import {
  DisprzTextField,
  DisprzTextArea,
  DisprzRadioButton,
  DisprzCheckbox,
  DisprzToggleSwitch,
  PlainButton,
} from "../../../../src/remote";
import { TextFieldTypes, ToggleSwitchSize } from "../../../../src/Enums";
import styles from "./FieldEditor.module.scss";

const FieldEditor = ({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onClone,
  onReorderOptions,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localField, setLocalField] = useState(field);
  const fieldRef = useRef(null);

  const { onDragStart, onDragEnd, onDragOver, onDrop } = useDragAndDrop({
    onDrop: (item, result) => {
      if (item.type === "option" && result.position !== undefined) {
        onReorderOptions(field.id, item.data.index, result.position);
      }
    },
    acceptTypes: ["option"],
  });

  useEffect(() => {
    setLocalField(field);
  }, [field]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fieldRef.current && !fieldRef.current.contains(event.target)) {
        handleSave();
      }
    };

    if (isSelected) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSelected, localField]);

  const handleClick = () => {
    onSelect(field.id);
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (JSON.stringify(localField) !== JSON.stringify(field)) {
      onUpdate(field.id, localField);
    }
  };

  const handleFieldChange = (key, value) => {
    setLocalField((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddOption = () => {
    const newOption = {
      id: `option_${Date.now()}`,
      label: `Option ${localField.options.length + 1}`,
      order: localField.options.length,
    };
    setLocalField((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const handleRemoveOption = (optionId) => {
    setLocalField((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== optionId),
    }));
  };

  const handleOptionChange = (optionId, newLabel) => {
    setLocalField((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, label: newLabel } : opt,
      ),
    }));
  };

  const handleOptionDragStart = (e, option, index) => {
    const dragItem = createDragItem(option.id, "option", { ...option, index });
    onDragStart(e, dragItem);
  };

  const renderFieldSpecificEditor = () => {
    switch (localField.type) {
      case FIELD_TYPES.SHORT_TEXT:
        return (
          <div className={styles.fieldContent}>
            <DisprzTextField
              uniqueId={`placeholder_${field.id}_${Date.now()}`}
              type={TextFieldTypes.TEXT}
              value={localField.placeholder || ""}
              onChange={(e) => handleFieldChange("placeholder", e.target.value)}
              placeholder="Placeholder text"
              borderGapColor="transparent"
            />
            <div className={styles.characterLimit}>
              {localField.maxLength || 100} Character Limit
            </div>
          </div>
        );

      case FIELD_TYPES.LONG_TEXT:
        return (
          <div className={styles.fieldContent}>
            <DisprzTextArea
              uniqueId={`placeholder_${field.id}_${Date.now()}`}
              value={localField.placeholder || ""}
              onChange={(e) => handleFieldChange("placeholder", e.target.value)}
              placeholder="Placeholder text"
              rows={3}
            />
          </div>
        );

      case FIELD_TYPES.DATE_PICKER:
        return (
          <div className={styles.fieldContent}>
            <div className={styles.dateFormatSelector}>
              <div className={styles.sectionLabel}>Date Format</div>
              <div className={styles.radioGroup}>
                {Object.entries(DATE_FORMATS).map(([key, format]) => (
                  <label key={key} className={styles.radioOption}>
                    <input
                      type="radio"
                      name={`dateFormat_${field.id}`}
                      value={format}
                      checked={localField.dateFormat === format}
                      onChange={(e) =>
                        handleFieldChange("dateFormat", e.target.value)
                      }
                    />
                    <span>{format}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case FIELD_TYPES.DROPDOWN:
        return (
          <div className={styles.fieldContent}>
            <div className={styles.optionsList}>
              {localField.options.map((option, index) => (
                <div
                  key={option.id}
                  className={styles.optionItem}
                  draggable
                  onDragStart={(e) => handleOptionDragStart(e, option, index)}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, field.id, index)}
                >
                  <span className={styles.optionNumber}>{index + 1}.</span>
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(option.id, e.target.value)
                    }
                    className={styles.optionInput}
                  />
                  {localField.options.length > 1 && (
                    <button
                      onClick={() => handleRemoveOption(option.id)}
                      className={styles.removeOption}
                    >
                      ×
                    </button>
                  )}
                  <div className={styles.dragHandle}>⋮⋮</div>
                </div>
              ))}
            </div>
            <button onClick={handleAddOption} className={styles.addOption}>
              + Add Option
            </button>
            <div className={styles.selectionType}>
              <label className={styles.checkboxOption}>
                <input
                  type="checkbox"
                  checked={localField.allowMultiple || false}
                  onChange={(e) =>
                    handleFieldChange("allowMultiple", e.target.checked)
                  }
                />
                <span>Multi Select</span>
              </label>
            </div>
          </div>
        );

      case FIELD_TYPES.NUMBER:
        return (
          <div className={styles.fieldContent}>
            <div className={styles.numberSettings}>
              <div className={styles.inputGroup}>
                <label>Min Value</label>
                <input
                  type="number"
                  value={localField.min || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "min",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className={styles.numberInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Max Value</label>
                <input
                  type="number"
                  value={localField.max || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      "max",
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className={styles.numberInput}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getFieldDisplayContent = () => {
    switch (localField.type) {
      case FIELD_TYPES.SHORT_TEXT:
        return localField.placeholder || "Short Text (Up to 100 Characters)";
      case FIELD_TYPES.LONG_TEXT:
        return localField.placeholder || "Long Text";
      case FIELD_TYPES.DATE_PICKER:
        return `Date (${localField.dateFormat || DATE_FORMATS.MM_DD_YYYY})`;
      case FIELD_TYPES.DROPDOWN:
        return (
          localField.options.map((opt) => opt.label).join(", ") ||
          "Dropdown options"
        );
      case FIELD_TYPES.NUMBER:
        return "Number input";
      case FIELD_TYPES.FILE_UPLOAD:
        return "File upload";
      default:
        return "Field content";
    }
  };

  return (
    <div
      ref={fieldRef}
      className={`${styles.fieldEditor} ${isSelected ? styles.selected : styles.unselected}`}
      onClick={handleClick}
    >
      <div className={styles.fieldHeader}>
        <div className={styles.dragHandle}>⋮⋮</div>
      </div>

      <div className={styles.fieldBody}>
        <div className={styles.labelSection}>
          {isSelected ? (
            <input
              type="text"
              value={localField.label}
              onChange={(e) => handleFieldChange("label", e.target.value)}
              className={styles.labelInput}
              placeholder="Question label"
            />
          ) : (
            <div className={styles.labelDisplay}>{localField.label}</div>
          )}
        </div>

        {localField.showDescription && (
          <div className={styles.descriptionSection}>
            {isSelected ? (
              <input
                type="text"
                value={localField.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
                className={styles.descriptionInput}
                placeholder="Description"
              />
            ) : (
              <div className={styles.descriptionDisplay}>
                {localField.description}
              </div>
            )}
          </div>
        )}

        {isSelected ? (
          renderFieldSpecificEditor()
        ) : (
          <div className={styles.fieldPreview}>{getFieldDisplayContent()}</div>
        )}
      </div>

      {isSelected && (
        <div className={styles.fieldControls}>
          <div className={styles.leftControls}>
            <button
              onClick={() => onClone(field.id)}
              className={styles.controlButton}
            >
              📋
            </button>
            <button
              onClick={() => onDelete(field.id)}
              className={styles.controlButton}
            >
              🗑️
            </button>
          </div>
          <div className={styles.rightControls}>
            <label className={styles.toggle}>
              <span>Description</span>
              <input
                type="checkbox"
                checked={localField.showDescription}
                onChange={(e) =>
                  handleFieldChange("showDescription", e.target.checked)
                }
              />
              <span className={styles.toggleSlider}></span>
            </label>
            <label className={styles.toggle}>
              <span>Required</span>
              <input
                type="checkbox"
                checked={localField.required}
                onChange={(e) =>
                  handleFieldChange("required", e.target.checked)
                }
              />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldEditor;
