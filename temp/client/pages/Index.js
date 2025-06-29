import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "48px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
          }}
        >
          Form Builder
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#6b7280",
            marginBottom: "32px",
            lineHeight: "1.6",
          }}
        >
          Create powerful, dynamic forms with drag-and-drop functionality. Build
          professional forms with sections, validations, and custom fields.
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/form-builder"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              padding: "12px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              display: "inline-block",
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow =
                "0 10px 25px -5px rgba(102, 126, 234, 0.4)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            🚀 Start Building Forms
          </Link>

          <Link
            to="/form-preview/demo"
            style={{
              background: "white",
              color: "#374151",
              border: "2px solid #e5e7eb",
              padding: "12px 32px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "16px",
              transition: "all 0.2s ease",
              display: "inline-block",
            }}
            onMouseOver={(e) => {
              e.target.style.borderColor = "#6366f1";
              e.target.style.color = "#6366f1";
            }}
            onMouseOut={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.color = "#374151";
            }}
          >
            👀 Preview Demo Form
          </Link>
        </div>

        <div
          style={{
            marginTop: "48px",
            padding: "24px",
            background: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "#1f2937",
              marginBottom: "12px",
            }}
          >
            ✨ Features
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              textAlign: "left",
            }}
          >
            <div>
              <strong style={{ color: "#374151" }}>🎯 Drag & Drop</strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Intuitive drag and drop interface
              </p>
            </div>
            <div>
              <strong style={{ color: "#374151" }}>
                📝 Multiple Field Types
              </strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Text, Date, Dropdown, File Upload & more
              </p>
            </div>
            <div>
              <strong style={{ color: "#374151" }}>🔧 UDF Support</strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                User Defined Fields integration
              </p>
            </div>
            <div>
              <strong style={{ color: "#374151" }}>📊 Form Sections</strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Organize forms with sections
              </p>
            </div>
            <div>
              <strong style={{ color: "#374151" }}>✅ Validation</strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Built-in form validation
              </p>
            </div>
            <div>
              <strong style={{ color: "#374151" }}>🎨 Live Preview</strong>
              <p
                style={{
                  margin: "4px 0 0 0",
                  color: "#6b7280",
                  fontSize: "14px",
                }}
              >
                Real-time form preview
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
