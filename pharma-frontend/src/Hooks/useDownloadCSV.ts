import { useQuery, useMutation, UseQueryResult, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { queryStringify } from "Utils/queryString";
import { BulkShipment } from "Interfaces/Order";
import { API_URL, getAccessToken } from "./api";
import {
  orderBillingShippingParamKeys,
  orderCompanyParamKeys,
  orderParamsGeneralKeys
} from "Utils/queryParamKeys";
import { convertToFormattedFileName } from "Utils/datesFormat";

type WebSiteURLS = Array<string>;
interface IPrivatePrescription {
  websites: WebSiteURLS;
}
export const useDownloadCSV = () => {
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
