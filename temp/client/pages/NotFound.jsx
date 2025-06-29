import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "400px",
        }}
      >
        <div
          style={{
            fontSize: "120px",
            fontWeight: "800",
            color: "#e5e7eb",
            lineHeight: "1",
            marginBottom: "16px",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "8px",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "32px",
            lineHeight: "1.6",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          style={{
            background: "#6366f1",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "16px",
            display: "inline-block",
            transition: "background 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#5046e5";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#6366f1";
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
