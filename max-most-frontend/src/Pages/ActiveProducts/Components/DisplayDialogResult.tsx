import { PayloadResponse } from "@interfaces/productActiveLogType";
import React from "react";

// Define the props type for the component
export const DisplayData: React.FC<{ data: PayloadResponse | null }> = ({ data }) => {
  if (!data) return <div>No data available.</div>;

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2>Payload</h2>
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
const formatValue = (
  value:
    | string
    | number
    | boolean
    | null
    | undefined
    | Record<string, string | number | boolean | null | undefined>
    | Array<string | number | boolean | null | undefined>
): JSX.Element | string => {
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

  // Handle null and undefined
  if (value === null || value === undefined) {
    return <span>N/A</span>;
  }

  return value.toString();
};
