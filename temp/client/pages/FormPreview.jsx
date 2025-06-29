import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FormRenderer from "../components/form-renderer/FormRenderer";
import { createFormSchema } from "../lib/form-schema";

const FormPreviewPage = () => {
  const { formId } = useParams();
  const [formSchema, setFormSchema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch the form schema by ID
    // For now, we'll use a mock schema
    const mockSchema = createFormSchema({
      title: "Course Feedback Form",
      description:
        "Help us improve! Share your feedback on your learning experience.",
    });

    setFormSchema(mockSchema);
    setLoading(false);
  }, [formId]);

  const handleFormSubmit = async (formData) => {
    // Handle form submission
    console.log("Form submitted:", formData);
    // In a real app, you would send this to your API
    alert("Form submitted successfully!");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#6b7280",
        }}
      >
        Loading form...
      </div>
    );
  }

  if (!formSchema) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#ef4444",
        }}
      >
        Form not found
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "20px 0",
      }}
    >
      <FormRenderer
        schema={formSchema}
        mode="render"
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};

export default FormPreviewPage;
