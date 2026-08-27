import { UseMutationResult, useMutation, useQuery, useQueryClient } from "react-query";
import { QueryPagination } from "../Interfaces/global";
import { quotesParamsGeneralKeys } from "../Utils/queryParamKeys";
import { API_URL, getAccessToken, getBrandDetails, getBrandId, getUserId } from "./api";
import {
  EditQuoteResponse,
  QuoteForm,
  QuoteFormProduct,
  QuoteToPurchaseOrder,
  QuotesResponse
} from "../Interfaces/quotatonsTypes";
import { queryStringify } from "../Utils/queryString";
import { toast } from "react-toastify";

/**
 * @interface QuoteData
 * @property {string} id - The ID of the quote.
 * @property {string} created - The creation date of the quote.
 * @property {string} updated - The last updated date of the quote.
 * @property {string} user_id - The ID of the user associated with the quote.
 * @property {string} created_by_id - The ID of the user who created the quote.
 * @property {string} trashed_by_id - The ID of the user who trashed the quote.
 * @property {string} quotation_date - The date when the quote was issued.
 * @property {string} vendor_id - The ID of the vendor associated with the quote.
 * @property {string} vendor_name - The name of the vendor.
 * @property {string} is_trash - Indicates if the quote is marked as trash.
 * @property {string} status - The status of the quote.
 * @property {string} brand_id - The ID of the brand.
 * @property {number} quotation_id - The ID of the quotation.
 * @property {string} product_name - The name of the product.
 * @property {string} purchase_order_id - The ID of the associated purchase order.
 */

/**
 * @interface QuoteFormProduct
 * @property {number | null} quantity - The quantity of the product.
 * @property {number | null} price - The price of the product.
 * @property {number | null} tax - The tax amount for the product.
 * @property {number | null} [unit_price] - The unit price of the product (optional).
 * @property {Object} product - The product details.
 * @property {string | null} product.value - The value of the product.
 * @property {number | null} product.cost_price - The cost price of the product.
 * @property {string} product.label - The label of the product.
 * @property {string | null} total - The total amount for the product.
 * @property {string | null} product_id - The ID of the product.
 * @property {string} [id] - Optional ID for the product.
 */

/**
 * @interface QuoteForm
 * @property {string} [id] - Optional ID for the quote form.
 * @property {string} [status] - Optional status of the quote.
 * @property {QuoteFormProduct[]} products - The list of products in the quote.
 * @property {string} vendor_id - The ID of the vendor.
 */

/**
 * @interface QuotesResponse
 * @property {QuoteData[]} results - The list of quotes.
 * @property {number} [page] - The current page number (optional).
 * @property {number} [count] - The count of items (optional).
 * @property {number} [total] - The total number of items (optional).
 * @property {number} [pages] - The total number of pages (optional).
 */

/**
 * @interface EditQuoteResponse
 * @property {string} id - The ID of the quote.
 * @property {string} user_id - The ID of the user associated with the quote.
 * @property {string} created_by_id - The ID of the user who created the quote.
 * @property {string} trashed_by_id - The ID of the user who trashed the quote.
 * @property {string} quotation_date - The date when the quote was issued.
 * @property {string} vendor_id - The ID of the vendor associated with the quote.
 * @property {EditQuoteProduct[]} products - The list of products in the quote.
 * @property {boolean} is_trash - Indicates if the quote is marked as trash.
 * @property {string} status - The status of the quote.
 * @property {string} status_display - The display status of the quote.
 * @property {string} brand_id - The ID of the brand.
 * @property {string} purchase_order_id - The ID of the associated purchase order.
 */

/**
 * @interface EditQuoteProduct
 * @property {string} product_id - The ID of the product.
 * @property {number} line_total - The total amount for the product line.
 * @property {number} unit_price - The unit price of the product.
 * @property {string} user_id - The ID of the user associated with the product.
 * @property {number} quantity - The quantity of the product.
 * @property {EditQuoteProductDetails} product - The product details.
 * @property {string} id - The ID of the product.
 * @property {string} quotation_id - The ID of the quotation.
 * @property {number} tax_rate - The tax rate for the product.
 * @property {number} line_item_tax - The tax amount for the product line.
 */

/**
 * @interface EditQuoteProductDetails
 * @property {boolean} is_trash - Indicates if the product is marked as trash.
 * @property {unknown[]} attributes - The attributes of the product.
 * @property {number} retail_price - The retail price of the product.
 * @property {string | number} number - The product number.
 * @property {unknown[]} discounts - The discounts applied to the product.
 * @property {string | unknown} dimension_length - The length dimension of the product.
 * @property {string | unknown} tax_class - The tax class of the product.
 * @property {string | unknown} dimension_height - The height dimension of the product.
 * @property {string | unknown} dimension_width - The width dimension of the product.
 * @property {number} quantity_per_pack - The quantity per pack of the product.
 * @property {string | unknown} description - The description of the product.
 * @property {number} cost_price - The cost price of the product.
 * @property {string | unknown[]} images - The images of the product.
 * @property {boolean} is_back_order - Indicates if the product is on back order.
 * @property {string} created - The creation date of the product.
 * @property {string | unknown} seo_slug - The SEO slug of the product.
 * @property {string | unknown} external_id - The external ID of the product.
 * @property {string} type - The type of the product.
 * @property {string} sku - The SKU of the product.
 * @property {string | unknown} shipping_rate - The shipping rate of the product.
 * @property {string} barcode - The barcode of the product.
 * @property {string | unknown} sticky_offer_id - The sticky offer ID of the product.
 * @property {boolean} is_downloadable - Indicates if the product is downloadable.
 * @property {string | unknown} tax_status - The tax status of the product.
 * @property {string | undefined} [updated] - The last updated date of the product.
 * @property {string | unknown} status - The status of the product.
 * @property {string} id - The ID of the product.
 * @property {boolean} is_saas - Indicates if the product is SaaS.
 * @property {string} brand_id - The ID of the brand.
 * @property {string | unknown} warning_message - The warning message for the product.
 * @property {boolean} is_tax_exempt - Indicates if the product is tax-exempt.
 * @property {string | unknown} sticky_product_id - The sticky product ID.
 */

/**
 * @interface QuoteToPurchaseOrder
 * @property {string} quotation_id - The ID of the quotation.
 * @property {string} warehouse_id - The ID of the warehouse.
 * @property {string} unit_cost_amounts - The unit cost amounts, e.g., "tax exclusive".
 * @property {string} invoicing_currency - The currency used for invoicing.
 * @property {string} exchange_rate - The exchange rate used.
 */

/**
 * Fetches quotations based on search parameters and optional isTrash flag.
 *
 * @param searchParams - URLSearchParams object containing search parameters.
 * @param isTrash - Optional boolean indicating if to fetch trashed quotations. Defaults to false.
 * @returns A react-query hook for fetching quotations.
 */
export const useQuotations = (
  searchParams: URLSearchParams,
  isTrash: boolean = false
) => {
  const generalParams: Record<string, string> = {
    ...getBrandId(),
    ...(isTrash ? { is_trash: "true" } : {})
  };
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };

  quotesParamsGeneralKeys.forEach(key => {
    if (searchParams.has(key)) {
      generalParams[key] = searchParams.get(key) as string;
    }
  });

  return useQuery<QuotesResponse, Error>(
    ["quotations", searchParams.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/quotation/${queryStringify({
          ...pagination,
          ...generalParams,
          sorting: "-created"
        })}`,
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
    }
  );
};

/**
 * Interface for the response of the useAddEditQuote mutation.
 *
 * @property status - The status code of the response.
 * @property message - The message returned by the server.
 * @property quotation_id - The ID of the quotation.
 */
interface useAddEditQuoteResponse {
  status: number;
  message: string;
  quotation_id: string;
}

/**
 * Custom hook for adding or editing a quotation.
 *
 * This hook uses the useMutation hook from react-query to handle the mutation.
 * It fetches the brand details and user ID, then sends a POST request to the server
 * with the quotation details. On success, it invalidates the quotations and edit-quotation
 * queries and displays a success toast. On error, it displays an error toast.
 *
 * @returns The result of the mutation.
 */
export const useAddEditQuote = (): UseMutationResult<
  useAddEditQuoteResponse,
  Error,
  Partial<QuoteForm>
> => {
  const queryClient = useQueryClient();
  return useMutation<useAddEditQuoteResponse, Error, Partial<QuoteForm>>(
    "create-quote",
    async (variables: Partial<QuoteForm>) => {
      const brand = getBrandDetails();

      if (!brand?.id || !getUserId()) {
        return;
      }
      const response = await fetch(`${API_URL}/full_quotation/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          ...variables,
          brand_id: brand?.id,
          ...getUserId()
        })
      });

      if (response.status === 400) {
        throw new Error("Something went wrong");
      }

      return response.json();
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(["quotations", "edit-quotation"]);
        toast.success(
          `Quotation ${data?.message?.startsWith("updated") ? "Updated" : "Created"} successfully`
        );
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Custom hook to fetch a quotation by its ID.
 * @param {string | undefined} id - The ID of the quotation to fetch.
 * @returns {UseQueryResult<EditQuoteResponse, Error>} - The query result containing the quotation data.
 */
export const useEditQuotation = (id?: string) => {
  return useQuery<EditQuoteResponse, Error>(
    ["edit-quotation", id?.toString()],
    async () => {
      if (!id) {
        return;
      }
      const response = await fetch(`${API_URL}/quotation/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return response.json();
    }
  );
};
/**
 * Custom hook to convert a quotation to a purchase order.
 * @returns {UseMutationResult<useAddEditQuoteResponse, Error, QuoteToPurchaseOrder>} - The mutation result for converting a quotation to a purchase order.
 */
export const useQuoteToPurchaseOrder = (): UseMutationResult<
  useAddEditQuoteResponse,
  Error,
  QuoteToPurchaseOrder
> => {
  const queryClient = useQueryClient();
  return useMutation<useAddEditQuoteResponse, Error, QuoteToPurchaseOrder>(
    "quote-to-purchase-order",
    async (variables: QuoteToPurchaseOrder) => {
      const brand = getBrandDetails();
      if (!brand?.id || !getUserId()) {
        return;
      }
      const response = await fetch(`${API_URL}/quotation_to_purchase_order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          ...variables,
          brand_id: brand?.id,
          ...getUserId()
        })
      });

      if (response.status === 400) {
        throw new Error("Something went wrong");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["quotations", "edit-quotation"]);
        toast.success(`Quotation successfully converted to Purchase Order`);
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * Custom hook to trash a quotation.
 * @returns {UseMutationResult} - The mutation result for trashing a quotation.
 */
export const useTrashQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id?: string }>(
    "delete-quotation",
    async variables => {
      const response = await fetch(`${API_URL}/quotation/${variables?.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error in deleting quote.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("quotations");
        toast.success("Quotations trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * Custom hook to restore a quotation.
 * @returns {UseMutationResult} - The mutation result for restoring a quotation.
 */
export const useRestoreQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>(
    "quotation-restoration",
    async id => {
      if (!id) {
        return;
      }
      const response = await fetch(`${API_URL}/quotation/${id}/restore/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: "{}"
      });
      if (!response.ok) {
        throw new Error("Error in restoring purchase order.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occurred while restoring purchase order.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["quotations"]);
        toast.success("Quotation restored successfully.");
      }
    }
  );
};

/**
 * Custom hook to add a product to a quotation.
 * @returns {UseMutationResult} - The mutation result for adding a product to a quotation.
 */
export const useAddQuotationProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<QuoteFormProduct>>(
    async variables => {
      "add-quotation-product";
      const { id, ...rest } = variables;
      const response = await fetch(`${API_URL}/quotation/${id}/product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(rest)
      });

      if (!response.ok) {
        throw new Error("Error in adding quotation product.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("edit-quotation");
        toast.success("Product added successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Custom hook to update a product in a quotation.
 * @returns {UseMutationResult} - The mutation result for updating a product in a quotation.
 */
export const useUpdateQuotationProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<QuoteFormProduct>>(
    async variables => {
      "update-quotation-product";
      const { id, product_id, ...rest } = variables;

      const response = await fetch(`${API_URL}/quotation/${id}/product/${product_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(rest)
      });

      if (!response.ok) {
        throw new Error("Error in updating quotation product.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("edit-quotation");
        toast.success("Product updated successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * Custom hook to delete a product from a quotation.
 * @returns {UseMutationResult} - The mutation result for deleting a product from a quotation.
 */
export const useDeleteQuotationProduct = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<QuoteFormProduct>>(
    async variables => {
      "delete-quotation-product";
      const { id, product_id } = variables;

      const response = await fetch(`${API_URL}/quotation/${id}/product/${product_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error in deleting quotation product.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("edit-quotation");
        toast.success("Product Deleted successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
