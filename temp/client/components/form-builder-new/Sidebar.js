import { useState } from "react";
import { useDragAndDrop, createDragItem } from "../../hooks/useDragAndDrop";
import { INPUT_FIELDS, UDF_FIELDS } from "../../lib/field-registry";
import { FIELD_TYPES } from "../../lib/form-schema";
import styles from "./Sidebar.module.scss";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("input");

  const { onDragStart, onDragEnd } = useDragAndDrop();

  const handleFieldDragStart = (e, field) => {
    const dragItem = createDragItem(field.id, "field", field);
    onDragStart(e, dragItem);
  };

  const renderFieldItem = (field) => (
    <div
      key={field.id}
      className={styles.fieldItem}
      draggable
      onDragStart={(e) => handleFieldDragStart(e, field)}
      onDragEnd={onDragEnd}
    >
      <div className={styles.fieldIcon}>{field.icon}</div>
      <span className={styles.fieldLabel}>{field.label}</span>
    </div>
  );

  return (
    <div className={styles.sidebar}>
      <div className={styles.tabContainer}>
        <button
          className={`${styles.tab} ${activeTab === "input" ? styles.active : ""}`}
          onClick={() => setActiveTab("input")}
        >
          Input Fields
        </button>
        <button
          className={`${styles.tab} ${activeTab === "udf" ? styles.active : ""}`}
          onClick={() => setActiveTab("udf")}
        >
          UDF Fields
        </button>
      </div>

      <div className={styles.fieldsContainer}>
        {activeTab === "input" && (
          <div className={styles.fieldsList}>
            {INPUT_FIELDS.map(renderFieldItem)}
          </div>
        )}

        {activeTab === "udf" && (
          <>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search UDF"
                className={styles.searchInput}
              />
            </div>
            <div className={styles.fieldsList}>
              {UDF_FIELDS.map(renderFieldItem)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
