import React from "react";
import { PayloadResponse } from "@interfaces/productActiveLogType"; // Ensure PayloadResponse is typed properly

// Define the component
export const ResponseDataDisplay: React.FC<{ data: PayloadResponse | null }> = ({
  data
}) => {
  if (!data) return <div>No data available.</div>;

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2>Response</h2>
      <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
        {Object.entries(data).map(([key, value]) => (
          <li key={key} style={{ marginBottom: "10px" }}>
            <strong>{key}:</strong>{" "}
            <span style={{ wordWrap: "break-word" }}>{formatValue(value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Define a more specific type for the value parameter
type FormatValueType =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, string | number | boolean | null | undefined>
  | Array<string | number | boolean | null | undefined>;

// Helper function to format nested values and arrays
const formatValue = (value: FormatValueType): React.ReactNode => {
  if (Array.isArray(value)) {
    return (
      <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
        {value.map((item, index) => (
          <li key={index}>{formatValue(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object" && value !== null) {
    return (
      <ul style={{ listStyleType: "none", paddingLeft: "20px" }}>
        {Object.entries(value).map(([key, val]) => (
          <li key={key}>
            <strong>{key}:</strong> {formatValue(val)}
          </li>
        ))}
      </ul>
    );
  }

  return value !== undefined && value !== null ? value.toString() : "N/A";
};
