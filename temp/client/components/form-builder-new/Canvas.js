import { useState } from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { createField, createSection } from "../../lib/form-schema";
import { PlainButton } from "../../../../src/remote";
import FieldEditor from "./FieldEditor";
import SectionEditor from "./SectionEditor";
import styles from "./Canvas.module.scss";

const Canvas = ({
  formSchema,
  onUpdateSchema,
  selectedFieldId,
  onSelectField,
}) => {
  const [showSectionTooltip, setShowSectionTooltip] = useState(false);

  const { onDragOver, onDrop, onDragEnter, onDragLeave, dropTarget } =
    useDragAndDrop({
      onDrop: (item, result) => {
        if (item.type === "field") {
          handleFieldDrop(item.data, result.position);
        }
      },
      acceptTypes: ["field"],
      autoScroll: true,
      scrollContainer: () => document.querySelector(".canvas-container"),
    });

  const handleFieldDrop = (fieldConfig, position) => {
    const newField = createField(fieldConfig.type, {
      udfType: fieldConfig.udfType,
    });

    const newFields = [...formSchema.fields];
    if (position !== undefined && position >= 0) {
      newFields.splice(position, 0, newField);
    } else {
      newFields.push(newField);
    }

    // Update field orders
    newFields.forEach((field, index) => {
      field.order = index;
    });

    onUpdateSchema({
      ...formSchema,
      fields: newFields,
      updatedAt: new Date().toISOString(),
    });

    // Auto-select the new field
    onSelectField(newField.id);
  };

  const handleFieldUpdate = (fieldId, updates) => {
    const updatedFields = formSchema.fields.map((field) =>
      field.id === fieldId ? { ...field, ...updates } : field,
    );

    onUpdateSchema({
      ...formSchema,
      fields: updatedFields,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleFieldDelete = (fieldId) => {
    const updatedFields = formSchema.fields.filter(
      (field) => field.id !== fieldId,
    );

    // Update field orders
    updatedFields.forEach((field, index) => {
      field.order = index;
    });

    onUpdateSchema({
      ...formSchema,
      fields: updatedFields,
      updatedAt: new Date().toISOString(),
    });

    if (selectedFieldId === fieldId) {
      onSelectField(null);
    }
  };

  const handleFieldClone = (fieldId) => {
    const fieldToClone = formSchema.fields.find(
      (field) => field.id === fieldId,
    );
    if (!fieldToClone) return;

    const clonedField = {
      ...fieldToClone,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      label: `${fieldToClone.label} (Copy)`,
    };

    const fieldIndex = formSchema.fields.findIndex(
      (field) => field.id === fieldId,
    );
    const newFields = [...formSchema.fields];
    newFields.splice(fieldIndex + 1, 0, clonedField);

    // Update field orders
    newFields.forEach((field, index) => {
      field.order = index;
    });

    onUpdateSchema({
      ...formSchema,
      fields: newFields,
      updatedAt: new Date().toISOString(),
    });

    onSelectField(clonedField.id);
  };

  const handleReorderOptions = (fieldId, fromIndex, toIndex) => {
    const field = formSchema.fields.find((f) => f.id === fieldId);
    if (!field || !field.options) return;

    const newOptions = [...field.options];
    const [movedOption] = newOptions.splice(fromIndex, 1);
    newOptions.splice(toIndex, 0, movedOption);

    // Update option orders
    newOptions.forEach((option, index) => {
      option.order = index;
    });

    handleFieldUpdate(fieldId, { options: newOptions });
  };

  const handleHeaderUpdate = (field, value) => {
    onUpdateSchema({
      ...formSchema,
      [field]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddSection = () => {
    const newSection = createSection({
      title: `Section ${formSchema.sections.length + 1} of ${formSchema.sections.length + 1}`,
      order: formSchema.sections.length,
    });

    onUpdateSchema({
      ...formSchema,
      sections: [...formSchema.sections, newSection],
      updatedAt: new Date().toISOString(),
    });
  };

  const renderDropZone = (position) => (
    <div
      className={`${styles.dropZone} ${dropTarget ? styles.active : ""}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, "canvas", position)}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      data-drop-target="canvas"
    >
      <div className={styles.dropZoneContent}>
        <div className={styles.dropIcon}>+</div>
        <span>Drag fields from the left panel</span>
      </div>
    </div>
  );

  return (
    <div className={`${styles.canvas} canvas-container`}>
      {/* Form Header */}
      <div className={styles.formHeader}>
        <div className={styles.headerBadge}>Form Header</div>
        <div className={styles.headerContent}>
          <input
            type="text"
            value={formSchema.title}
            onChange={(e) => handleHeaderUpdate("title", e.target.value)}
            className={styles.titleInput}
            placeholder="Form Title"
          />
          <input
            type="text"
            value={formSchema.description}
            onChange={(e) => handleHeaderUpdate("description", e.target.value)}
            className={styles.descriptionInput}
            placeholder="Form Description"
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className={styles.fieldsContainer}>
        {formSchema.fields.length === 0 ? (
          renderDropZone(0)
        ) : (
          <>
            {renderDropZone(0)}
            {formSchema.fields.map((field, index) => (
              <div key={field.id}>
                <FieldEditor
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onSelect={onSelectField}
                  onUpdate={handleFieldUpdate}
                  onDelete={handleFieldDelete}
                  onClone={handleFieldClone}
                  onReorderOptions={handleReorderOptions}
                />
                {renderDropZone(index + 1)}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add Section Button */}
      <div className={styles.addSectionContainer}>
        <PlainButton
          text="📋 Add Section"
          onClick={handleAddSection}
          uniqueId={`add_section_${Date.now()}`}
          ctrCls={styles.addSectionButton}
          onMouseEnter={() => setShowSectionTooltip(true)}
          onMouseLeave={() => setShowSectionTooltip(false)}
        />

        {showSectionTooltip && (
          <div className={styles.tooltip}>
            Sections help structure the form visually. Section Names will be
            separated to the question in the reports.
          </div>
        )}
      </div>

      {/* Sections List */}
      {formSchema.sections.length > 0 && (
        <div className={styles.sectionsContainer}>
          <h3 className={styles.sectionsTitle}>Form Sections</h3>
          {formSchema.sections.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              onUpdate={(sectionId, updates) => {
                const updatedSections = formSchema.sections.map((s) =>
                  s.id === sectionId ? { ...s, ...updates } : s,
                );
                onUpdateSchema({
                  ...formSchema,
                  sections: updatedSections,
                  updatedAt: new Date().toISOString(),
                });
              }}
              onDelete={(sectionId) => {
                const updatedSections = formSchema.sections.filter(
                  (s) => s.id !== sectionId,
                );
                onUpdateSchema({
                  ...formSchema,
                  sections: updatedSections,
                  updatedAt: new Date().toISOString(),
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Canvas;
