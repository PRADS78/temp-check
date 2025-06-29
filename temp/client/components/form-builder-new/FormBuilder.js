import { useState } from "react";
import { createFormSchema } from "../../lib/form-schema";
import {
  PrimaryButton,
  OutlinedButton,
  DisprzTabs,
} from "../../../../src/remote";
import { ButtonTypes } from "../../../../src/Enums";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import FormRenderer from "../form-renderer/FormRenderer";
import styles from "./FormBuilder.module.scss";

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState("configuration");
  const [formSchema, setFormSchema] = useState(() => createFormSchema());
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  const handleUpdateSchema = (newSchema) => {
    setFormSchema(newSchema);
  };

  const handleSelectField = (fieldId) => {
    setSelectedFieldId(fieldId);
  };

  const handlePreviewForm = () => {
    // Save form schema (you can implement API call here)
    console.log("Form Schema:", formSchema);
  };

  return (
    <div className={styles.formBuilder}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === "configuration" ? styles.active : ""}`}
            onClick={() => setActiveTab("configuration")}
          >
            Form Configuration
          </button>
          <button
            className={`${styles.tab} ${activeTab === "layout" ? styles.active : ""}`}
            onClick={() => setActiveTab("layout")}
          >
            Form Layout
          </button>
        </div>

        <div className={styles.headerActions}>
          <button onClick={handlePreviewForm} className={styles.previewButton}>
            Preview Form
          </button>
          <button className={styles.saveButton}>Save Form</button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === "configuration" && (
          <div className={styles.configurationView}>
            <Sidebar />
            <Canvas
              formSchema={formSchema}
              onUpdateSchema={handleUpdateSchema}
              selectedFieldId={selectedFieldId}
              onSelectField={handleSelectField}
            />
          </div>
        )}

        {activeTab === "layout" && (
          <div className={styles.layoutView}>
            <FormRenderer
              schema={formSchema}
              mode="preview"
              onSubmit={(data) => console.log("Form submitted:", data)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
