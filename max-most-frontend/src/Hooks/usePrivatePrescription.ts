import { useMutation } from "react-query";
import { toast } from "react-toastify";

import { API_URL, getAccessToken } from "./api";
import { convertToFormattedFileName } from "../Utils/datesFormat";

/**
 * Type definition for an array of website URLs.
 * @typedef {Array<string>} WebSiteURLS
 *
 * Interface for private prescription data.
 * @interface IPrivatePrescription
 * @property {WebSiteURLS} websites - An array of website URLs.
 */

/**
 * Custom hook to handle the download of private prescription CSV.
 *
 * This hook uses react-query's useMutation to handle the download of a private prescription CSV file.
 * It sends a POST request to the API with the provided variables, checks the response content type,
 * and if it's a CSV file, it downloads the file. If the content type is not CSV, it throws an error.
 *
 * @returns {useMutation} A react-query mutation hook for downloading private prescription CSV.
 */
type WebSiteURLS = Array<string>;
interface IPrivatePrescription {
  websites: WebSiteURLS;
}
export const usePrivatePrescription = () => {
  return useMutation<void, Error, IPrivatePrescription>(
    "private-prescription",
    async variables => {
      const response = await fetch(`${API_URL}/Ppr_margedCsv/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("text/csv")) {
        try {
          const file = await response.blob();
          const url = URL.createObjectURL(file);
          const link = document.createElement("a");
          link.href = url;
          const originalFileName = "Private-Prescription-Register.csv";
          const convertedFileName = convertToFormattedFileName(originalFileName);

          link.download = convertedFileName;
          link.click();
          link.remove();
        } catch (error) {
          console.error("Error handling file download:", error);
          throw new Error("Unable to handle the file download.");
        }
      } else {
        console.error("Invalid content type received:", contentType);
        throw new Error(
          "Unable to download Private Prescription CSV: Invalid content type."
        );
      }

      if (!response.ok) {
        throw new Error("An error occured while Downloading Private Prescription CSV.");
      }
    },
    {
      onError: error => {
        toast.error(error.message);
      },
      onSuccess: () => {
        toast.success("Private Prescription CSV Downloaded");
      }
    }
  );
};
