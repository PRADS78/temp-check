import { useState } from "react";
import {
  DisprzTextField,
  DisprzTextArea,
  PlainButton,
} from "../../../../src/remote";
import { TextFieldTypes } from "../../../../src/Enums";
import styles from "./SectionEditor.module.scss";

const SectionEditor = ({ section, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localSection, setLocalSection] = useState(section);

  const handleSave = () => {
    setIsEditing(false);
    if (JSON.stringify(localSection) !== JSON.stringify(section)) {
      onUpdate(section.id, localSection);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalSection(section);
  };

  const handleFieldChange = (key, value) => {
    setLocalSection((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.sectionEditor}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>
          Section {section.order + 1} of X
        </div>
        <div className={styles.sectionActions}>
          {isEditing ? (
            <>
              <PlainButton
                text="✓"
                onClick={handleSave}
                uniqueId={`save_section_${section.id}`}
                ctrCls={styles.saveButton}
              />
              <PlainButton
                text="✕"
                onClick={handleCancel}
                uniqueId={`cancel_section_${section.id}`}
                ctrCls={styles.cancelButton}
              />
            </>
          ) : (
            <>
              <PlainButton
                text="✏️"
                onClick={() => setIsEditing(true)}
                uniqueId={`edit_section_${section.id}`}
                ctrCls={styles.editButton}
              />
              <PlainButton
                text="🗑️"
                onClick={() => onDelete(section.id)}
                uniqueId={`delete_section_${section.id}`}
                ctrCls={styles.deleteButton}
              />
            </>
          )}
        </div>
      </div>

      <div className={styles.sectionContent}>
        {isEditing ? (
          <>
            <DisprzTextField
              uniqueId={`section_title_${section.id}_${Date.now()}`}
              type={TextFieldTypes.TEXT}
              value={localSection.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Section Title"
              borderGapColor="transparent"
              ctrCls={styles.titleInput}
            />
            <DisprzTextArea
              uniqueId={`section_desc_${section.id}_${Date.now()}`}
              value={localSection.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Section Description (optional)"
              rows={2}
              ctrCls={styles.descriptionInput}
            />
          </>
        ) : (
          <>
            <h4 className={styles.titleDisplay}>{section.title}</h4>
            {section.description && (
              <p className={styles.descriptionDisplay}>{section.description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SectionEditor;
