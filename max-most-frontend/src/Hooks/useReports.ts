import { useMutation, useQuery } from "react-query";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { toast } from "react-toastify";
import { CustomerReport } from "../Interfaces/reportsTypes";

/**
 * @interface ICustomRange
 * @property {string} startDate - The start date of the custom range.
 * @property {string} endDate - The end date of the custom range.
 */

/**
 * @typedef {ICustomRange | string} TDateRange
 * Represents a date range, which can be a custom range or a single date as a string.
 */

/**
 * @interface CustomerReport
 * @property {string} staticPath - The static path for the customer report.
 * @property {string} brand_id - The ID of the brand.
 * @property {string} [product_id] - Optional ID of a single product.
 * @property {string[]} [product_ids] - Optional array of product IDs.
 * @property {string[]} [website_ids] - Optional array of website IDs.
 * @property {string[] | string} [payment_method] - Optional payment method(s), can be an array or a single value.
 * @property {TDateRange | null} [date_range] - Optional date range for the report, can be a custom range or a single date.
 * @property {string} [at_date] - Optional specific date for the report.
 * @property {string} [batch_number] - Optional batch number for the report.
 */

/**
 * Custom hook to create a customer report.
 * Report are generated in CSV file user can simply download the CSV file and analysis it.
 * @returns {UseMutationResult<string, Error, Partial<CustomerReport>>} - The mutation result for creating a customer report.
 */
export const useCreateCustomerReport = () => {
  return useMutation<string, Error, Partial<CustomerReport>>(
    "customer-report-purchase",
    async (variables: Partial<CustomerReport>) => {
      const { staticPath } = variables;
      const saveStaticPath = staticPath;
      delete variables["staticPath"];

      const response = await fetch(`${API_URL}${saveStaticPath}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId() })
      });
      //eslint-disable-next-line
      const fileName = saveStaticPath?.match(/\/([^\/]+)\/$/)?.[1] || "default";
      if (response.ok) {
        const csv = await response.blob();
        const timestamp = new Date().toISOString();
        const filename = `${fileName}_${timestamp}.csv`;
        const url = URL.createObjectURL(csv);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        link.remove();
      } else {
        throw new Error(`Error in creating ${fileName} Report!`);
      }

      return fileName;
    },
    {
      onSuccess: () => {},
      onError: err => {
        toast.error(err.message);
      }
    }
  );
};

export const useBatches = () => {
  return useQuery<string[], Error>(["batches"], async () => {
    /**
     * Custom hook to fetch batches based on the brand ID.
     * @returns {UseQueryResult<string[], Error>} - The query result for fetching batches.
     */
    const brandId = getBrandId()?.brand_id;
    if (!brandId) {
      return {
        isLoading: false,
        data: []
      };
    }
    const response = await fetch(
      `${API_URL}/received-product-list/?brand_id=${brandId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      }
    );
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  });
};
