import { useState } from "react";
import { validateForm } from "../../lib/form-schema";
import FieldRenderer from "./FieldRenderer";
import styles from "./FormRenderer.module.scss";

const FormRenderer = ({
  schema,
  mode = "render",
  onSubmit,
  initialData = {},
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (fieldId, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Clear field error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === "preview") {
      alert("This is a preview. Form submission is disabled.");
      return;
    }

    setIsSubmitting(true);

    // Validate form
    const validation = validateForm(schema, formData);

    if (!validation.isValid) {
      setErrors(validation.fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit?.(formData);
      setIsSubmitted(true);
      setErrors({});
    } catch (error) {
      console.error("Form submission error:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const groupFieldsBySections = () => {
    if (schema.sections.length === 0) {
      return [{ section: null, fields: schema.fields }];
    }

    const grouped = [];

    // Add fields without sections first
    const fieldsWithoutSection = schema.fields.filter(
      (field) => !field.sectionId,
    );
    if (fieldsWithoutSection.length > 0) {
      grouped.push({ section: null, fields: fieldsWithoutSection });
    }

    // Add sections with their fields
    schema.sections
      .sort((a, b) => a.order - b.order)
      .forEach((section) => {
        const sectionFields = schema.fields.filter(
          (field) => field.sectionId === section.id,
        );
        grouped.push({ section, fields: sectionFields });
      });

    return grouped;
  };

  if (isSubmitted) {
    return (
      <div className={styles.successMessage}>
        <div className={styles.successIcon}>✓</div>
        <h2>Thank you!</h2>
        <p>{schema.settings.successMessage}</p>
      </div>
    );
  }

  const groupedFields = groupFieldsBySections();

  return (
    <div
      className={`${styles.formRenderer} ${mode === "preview" ? styles.preview : ""}`}
    >
      {mode === "preview" && (
        <div className={styles.previewBanner}>
          <span>📋 Form Preview Mode</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Form Header */}
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>{schema.title}</h1>
          {schema.description && (
            <p className={styles.formDescription}>{schema.description}</p>
          )}
        </div>

        {/* Form Sections and Fields */}
        {groupedFields.map((group, groupIndex) => (
          <div key={groupIndex} className={styles.fieldGroup}>
            {group.section && (
              <div className={styles.sectionHeader}>
                <div className={styles.sectionBadge}>
                  Section {group.section.order + 1} of {schema.sections.length}
                </div>
                <h2 className={styles.sectionTitle}>{group.section.title}</h2>
                {group.section.description && (
                  <p className={styles.sectionDescription}>
                    {group.section.description}
                  </p>
                )}
              </div>
            )}

            <div className={styles.fieldsContainer}>
              {group.fields
                .sort((a, b) => a.order - b.order)
                .map((field) => (
                  <FieldRenderer
                    key={field.id}
                    field={field}
                    value={formData[field.id]}
                    onChange={(value) => handleFieldChange(field.id, value)}
                    error={errors[field.id]}
                    disabled={isSubmitting}
                  />
                ))}
            </div>
          </div>
        ))}

        {/* Submit Button */}
        <div className={styles.submitContainer}>
          <button
            type="submit"
            disabled={isSubmitting || schema.fields.length === 0}
            className={styles.submitButton}
          >
            {isSubmitting ? "Submitting..." : schema.settings.submitButtonText}
          </button>
        </div>

        {mode === "preview" && (
          <div className={styles.previewNote}>
            This is a preview of your form. Changes made in the form builder
            will be reflected here.
          </div>
        )}
      </form>
    </div>
  );
};

export default FormRenderer;
