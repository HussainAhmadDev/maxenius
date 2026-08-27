import {
  UseMutationResult,
  UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient
} from "react-query";
import { QueryPagination } from "../Interfaces/global";
import { queryStringify } from "../Utils/queryString";
import { productParamsGeneralKeys } from "../Utils/queryParamKeys";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { toast } from "react-toastify";
import { updateProductPayloadT } from "../Interfaces/Products";

import {
  AttributeItem,
  CreateProductResponse,
  ProductData,
  ProductDataMadeIn,
  ProductsResponse,
  TopSellingResponse
} from "../Interfaces/Products";
import { useNavigate } from "react-router-dom";
/**
 * @interface Attachment
 * @property {string} url - The URL of the attachment.
 * @property {boolean} is_cover - Indicates if the attachment is a cover image.
 * @property {string} id - The unique identifier of the attachment.
 */

/**
 * @interface ProductData
 * @property {string} warning_number - A warning number associated with the product.
 * @property {string} id - The unique identifier of the product.
 * @property {string} [updated] - The date and time when the product was last updated.
 * @property {string} created - The date and time when the product was created.
 * @property {string} name - The name of the product.
 * @property {string} [description] - A description of the product.
 * @property {boolean} [is_tax_exempt] - Indicates if the product is tax exempt.
 * @property {string|null} [tax_class] - The tax class of the product, if applicable.
 * @property {string|null} [tax_status] - The tax status of the product, if applicable.
 * @property {string|number} [number] - A numeric or string identifier for the product.
 * @property {number} [retail_price] - The retail price of the product.
 * @property {number} [shipping_rate] - The shipping rate for the product.
 * @property {"in_stock"|"on_back_order"|"out_of_stock"} [status] - The current stock status of the product.
 * @property {boolean} [is_downloadable] - Indicates if the product is downloadable.
 * @property {boolean} [is_saas] - Indicates if the product is a SaaS product.
 * @property {string} [seo_slug] - The SEO slug for the product.
 * @property {string} sku - The SKU (Stock Keeping Unit) of the product.
 * @property {Attachment[]} [images] - An array of attachments related to the product.
 * @property {boolean} is_trash - Indicates if the product is marked as trash.
 * @property {number} [sticky_product_id] - The ID of the sticky product, if applicable.
 * @property {number} [sticky_offer_id] - The ID of the sticky offer, if applicable.
 * @property {string} [image] - The URL of the product image.
 * @property {Discount[]} [discounts] - An array of discounts applied to the product.
 * @property {number} [dimension_width] - The width dimension of the product.
 * @property {number} [dimension_height] - The height dimension of the product.
 * @property {number} [dimension_length] - The length dimension of the product.
 * @property {string} [external_id] - An external ID for the product.
 * @property {number} [quantity] - The quantity of the product.
 * @property {number} [shippedQuantity] - The quantity of the product that has been shipped.
 * @property {number} [shippingCost] - The shipping cost for the product.
 * @property {string} [shipping_date] - The shipping date for the product.
 * @property {string} [barcode] - The barcode for the product.
 * @property {boolean} [is_back_order] - Indicates if the product is available for back order.
 * @property {number} [quantity_per_pack] - The quantity per pack for the product.
 * @property {number} [shipped_quantity] - The quantity of the product that has been shipped.
 * @property {string} [direction] - The direction related to the product.
 * @property {string} [patient_name] - The name of the patient associated with the product.
 * @property {string} [warning_message] - A warning message related to the product.
 * @property {string} warning_id - The ID of the warning associated with the product.
 * @property {string} [stock_quantity] - The stock quantity of the product.
 * @property {string} id_hash - A hash of the product ID.
 * @property {number} [cost_price] - The cost price of the product.
 * @property {string} [product_name] - The name of the product.
 */

/**
 * @interface Discount
 * @property {number} price - The price of the discount.
 * @property {string} [product_id] - The ID of the product to which the discount applies.
 * @property {number} from_quantity - The minimum quantity required for the discount.
 * @property {string} [user_id] - The ID of the user associated with the discount.
 * @property {number} to_quantity - The maximum quantity for which the discount applies.
 * @property {string} brand_id - The ID of the brand associated with the discount.
 */

/**
 * @interface ProductsResponse
 * @property {ProductData[]} results - An array of `ProductData` items.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items returned in the response.
 * @property {number} [total] - The total number of items available.
 * @property {number} [pages] - The total number of pages available.
 */

/**
 * @interface TopSellingProduct
 * @property {string} product_name - The name of the top-selling product.
 * @property {string} product_sku - The SKU of the top-selling product.
 * @property {string} sale_amount - The sale amount for the top-selling product.
 * @property {string} product_id - The ID of the top-selling product.
 */

/**
 * @interface TopSellingResponse
 * @property {TopSellingProduct[]} results - An array of `TopSellingProduct` items.
 */

/**
 * Custom hook to fetch products with optional search and filter parameters.
 *
 * @param {URLSearchParams} [searchParams] - Optional search parameters to filter and paginate the products.
 *   - `count` (number): Number of products per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 *   - `website_id` (string): Website id is a string.
 *   - `sku` (string): sku  is a string.
 *   - `name` (string): Product Name is a  string.
 *   - `name` (barcode): barcode is a  string.
 *
 *   - Other parameters can be used to filter products based on specific attributes.
 *
 * @param {boolean} [isTrash] - Flag indicating whether to fetch trashed products (`true`) or active products (`false`).
 *
 * @returns {UseQueryResult<ProductsResponse, Error>} The query result containing the fetched products and metadata.
 *
 * @see {@link ProductsResponse} - Type representing the structure of the response data.
 * @see {@link ProductData} - Type representing individual product details.
 */
export const useProducts = (searchParams?: URLSearchParams, isTrash: boolean = false) => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams?.get("count") || "50",
    page: searchParams?.get("page") || "1"
  };

  const generalParams: Record<string, string> = {
    ...getBrandId(),
    ...(isTrash ? { is_trash: "True" } : { is_trash: "False" })
  };

  productParamsGeneralKeys.forEach(key => {
    if (searchParams?.has(key)) {
      generalParams[key] = searchParams?.get(key) as string;
    }
  });

  return useQuery<ProductsResponse, Error>(
    ["products", searchParams?.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/products_by_sku/${queryStringify({
          ...pagination,
          ...generalParams
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

export const useVariantProducts = (
  searchParams?: URLSearchParams,
  isTrash: boolean = false
) => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams?.get("count") || "50",
    page: searchParams?.get("page") || "1"
  };

  const generalParams: Record<string, string> = {
    ...getBrandId(),
    ...(isTrash ? { is_trash: "True" } : { is_trash: "False" })
  };

  productParamsGeneralKeys.forEach(key => {
    if (searchParams?.has(key)) {
      generalParams[key] = searchParams?.get(key) as string;
    }
  });

  return useQuery<ProductsResponse, Error>(
    ["products", searchParams?.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/variant_product/${queryStringify({
          ...pagination,
          ...generalParams
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

export const useTopSellingProducts = (brand_id: string) => {
  return useQuery<TopSellingResponse, Error>(["top-selling-list", brand_id], async () => {
    if (!brand_id) {
      return;
    }
    const response = await fetch(
      `${API_URL}/top_selling_products/${queryStringify({
        brand_id: brand_id,
        count: "20"
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
  });
};

/**
 * Custom hook to trash a product.
 * @param {string} [id] - The ID of the product to be trashed. If not provided, the productId from variables will be used.
 * @returns {UseMutationResult} - The mutation result for the trash operation.
 */
export const useTrashProduct = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { productId?: string }>(
    async variables => {
      if (!variables.productId || !id) {
        return;
      }
      const response = await fetch(
        `${API_URL}/variant_product/${id ? id : variables.productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Error in deleting product.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
        toast.success("Product trashed successfully ");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * Custom hook to restore a trashed product.
 * @param {string} [productId] - The ID of the product to be restored.
 * @returns {UseMutationResult} - The mutation result for the restore operation.
 */
export const useRestoreProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { productId?: string }>(
    async variables => {
      if (!variables?.productId) {
        return;
      }
      const response = await fetch(`${API_URL}/product/${variables.productId}/restore/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: "{}"
      });
      if (!response.ok) {
        throw new Error("Error in restoring product.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An error occurred while restoring the product.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]);
        toast.success("Product restored successfully.");
      }
    }
  );
};

/**
 * Custom hook to fetch a single product by its ID.
 * @param {string} [id] - The ID of the product to fetch.
 * @returns {UseQueryResult<ProductData, Error>} - The query result containing the product data.
 */
export const useSingleProduct = (id?: string): UseQueryResult<ProductData, Error> => {
  return useQuery<ProductData, Error>(
    ["products", id],
    async () => {
      console.log("Edit Product Payload ID:", id);
      if (!id) {
        return;
      }
      const response = await fetch(`${API_URL}/variant_product/${id}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      staleTime: 0,
      cacheTime: 0
    }
  );
};

interface IGenerateBarcodes {
  data: string[];
}
/**
 * Interface representing the data structure for generating barcodes.
 * @interface IGenerateBarcodes
 * @property {string[]} data - An array of SKU strings for which to generate barcodes.
 */

/**
 * Custom hook to generate barcodes by SKU.
 * @returns {UseMutationResult<IGenerateBarcodes, Error, IGenerateBarcodes>} - The mutation result for generating barcodes.
 */
export const useGenerateBarcodeBySKU = () => {
  // const { activeBrand: brand_id } = useBrand();

  return useMutation<IGenerateBarcodes, Error, IGenerateBarcodes>(
    "generate-barcode-by-sku",

    async (variables: IGenerateBarcodes) => {
      const response = await fetch(`${API_URL}/generate_barcodes/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables })
      });
      if (response.ok) {
        const pdf = await response.blob();
        const url = URL.createObjectURL(pdf);
        window.open(url, "_blank");
      } else {
        const res = await response.json();
        throw new Error(res.message);
      }

      return response.json();
    }
  );
};

/**
 * Custom hook to edit a product.
 * @param {string | undefined} id - The ID of the product to be edited. If undefined, the edit operation will not proceed.
 * @returns {UseMutationResult<ProductData, Error, Partial<ProductData>>} - The mutation result for the edit operation, including status and error handling.
 * @see {@link ProductData} - The Body of Edit Product consists of Partial Data Types, allowing for updates to specific fields of the product.
 */
export const useEditProduct = (
  id: string | undefined
): UseMutationResult<ProductData, Error, Partial<ProductData>> => {
  const queryClient = useQueryClient();

  return useMutation<ProductData, Error, Partial<ProductData>>(
    ["product/", id],
    async (variables: Partial<ProductData>) => {
      if (!id) {
        return; // Exit if no valid product ID is provided
      }
      delete variables.id; // Remove ID from variables to prevent overwriting
      delete variables.created; // Remove created date to avoid modification
      if (variables.updated) delete variables.updated; // Optionally remove updated date if present
      const response = await fetch(`${API_URL}/product/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables, ...getBrandId() }) // Include brand ID in the request
      });
      if (!response.ok) {
        throw new Error("Error in updating product"); // More accurate error message
      }
      return response.json(); // Return the updated product data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products", id]); // Invalidate queries to refresh product list
        toast.success("Product has been edited successfully"); // Success message
      },
      onError: () => {
        toast.error("Error in editing product");
      }
    }
  );
};

export const useProductCustomFields = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { data: Partial<ProductDataMadeIn>; isEdit: boolean }>(
    "create-product-custom-field",
    async ({ data }) => {
      console.log("Meta field Payload: ", data);
      const response = await fetch(`${API_URL}/product_custom_fields/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ ...data })
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || response.statusText);
      }
      return response.json();
    },
    {
      onError: (error: Error) => {
        toast.error(`error occured: ${error.message}`);
      },
      onSuccess: (_, variables) => {
        toast.success(
          variables.isEdit
            ? "Product custom field updated successfully"
            : "Product custom field created successfully"
        );
        queryClient.invalidateQueries(["product_custom_fields"]);
      }
    }
  );
};

/**
 * Custom hook to edit a product.
 *
 * This hook uses react-query's useMutation to handle editing a product.
 * It sends a PUT request to the `/product/:id/` endpoint with the provided product details.
 *
 * @param {string | undefined} id - The ID of the product to be edited. If undefined, the edit operation will not proceed.
 * @returns {UseMutationResult<ProductData, Error, Partial<ProductData>>} The mutation result for the edit operation, including status and error handling.
 *
 * @example
 * // Usage in a component
 * const { mutate: editProduct, isLoading, isError, data } = useEditProduct("product-id-123");
 *
 * const handleEditProduct = (productDetails: Partial<ProductData>) => {
 *   editProduct(productDetails);
 * };
 *
 * @see ProductData - The body of the edit product request consists of partial data types, allowing for updates to specific fields of the product.
 */
interface SingleProductWebsite {
  Websites: string[];
  product_id: string;
}

/**
 * Custom hook to fetch the websites associated with a product by its SKU.
 * @param {string | undefined} sku - The SKU of the product.
 * @returns {UseQueryResult<SingleProductWebsite, Error>} - The query result for the product websites.
 */
export const useProductWebsites = (sku: string | undefined) => {
  return useQuery<SingleProductWebsite, Error>(["product-websites", sku], async () => {
    if (!sku) {
      return;
    }

    const response = await fetch(
      `${API_URL}/single_product_website/?sku=${sku}&brand_id=${getBrandId()?.brand_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      }
    );
    return response.json();
  });
};

export const useCreateProduct = () => {
  const navigate = useNavigate();

  return useMutation<void, Error, CreateProductResponse>(
    ["create-product", new Date().toISOString()],
    async variables => {
      const response = await fetch(`${API_URL}/variant_product/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ ...variables })
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || response.statusText);
      }
      return response.json();
    },
    {
      onError: () => {},
      onSuccess: () => {
        toast.success("Product created successfully");
        navigate("/products");
      }
    }
  );
};
/**
 * Returns a mutation hook for creating a product.
 *
 * @return {MutationTuple<void, Error, Partial<ProductDataMadeIn>>} The mutation hook.
 */

export const useTrashProductVariant = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id?: string }>(
    async variables => {
      const response = await fetch(`${API_URL}/variation/${variables.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error in deleting product variant.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("products");
        toast.success("Product Variant trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * Custom hook to trash a product variant.
 *
 * This hook uses react-query's useMutation to handle the deletion of a product variant.
 * It sends a DELETE request to the `/variation/:id/` endpoint.
 *
 * @returns {UseMutationResult<void, Error, { id?: string }>} The mutation result for the trash operation.
 *
 * @example
 * const { mutate: trashVariant } = useTrashProductVariant();
 *
 * const handleTrashVariant = (variantId: string) => {
 *   trashVariant({ id: variantId });
 * };
 */

export const useEditProductVariant = (): UseMutationResult<
  AttributeItem,
  Error,
  AttributeItem
> => {
  const queryClient = useQueryClient();

  return useMutation<AttributeItem, Error, AttributeItem>(
    ["product-variantion-update", new Date().toISOString()],
    async (variables: AttributeItem) => {
      const variantId = variables.id;
      delete variables.id;
      delete variables.attributes;
      const response = await fetch(`${API_URL}/variation/${variantId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables }) // Include brand ID in the request
      });
      if (!response.ok) {
        throw new Error("Error in updating product variant"); // More accurate error message
      }
      return response.json(); // Return the updated product data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]); // Invalidate queries to refresh product list
        toast.success("Product variant has been edited successfully"); // Success message
      },
      onError: () => {
        toast.error("Error in editing product variant");
      }
    }
  );
};

export const useAddProductVariant = (): UseMutationResult<
  AttributeItem,
  Error,
  AttributeItem
> => {
  const queryClient = useQueryClient();

  return useMutation<AttributeItem, Error, AttributeItem>(
    ["product-variantion-add"],
    async (variables: AttributeItem) => {
      const productId = variables.id;
      delete variables.id;
      if (!productId) {
        return;
      }
      const response = await fetch(`${API_URL}/add_variation/${productId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables }) // Include brand ID in the request
      });
      if (!response.ok) {
        throw new Error("Error in Adding product variant"); // More accurate error message
      }
      return response.json(); // Return the updated product data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["products"]); // Invalidate queries to refresh product list
        toast.success("Product variant has been Add successfully"); // Success message
      },
      onError: () => {
        toast.error("Error in Adding product variant");
      }
    }
  );
};

// Dynamic attribute structure

interface APIResponse {
  // Define the structure of the expected response from the API
}

export const useUpdateProduct = () => {
  // const queryClient = useQueryClient();
  return useMutation<APIResponse, Error, updateProductPayloadT>(
    async (productDataToUpdate: updateProductPayloadT) => {
      const { id_hashed, ...payload } = productDataToUpdate;
      const response = await fetch(`${API_URL}/variant_product/${id_hashed}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Error in updating Product Record.");
      }
      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        toast.success("Product record updated successfully.");
        // queryClient.invalidateQueries(["Products"]);
      },
      onError: () => {
        toast.error("Error in updating Product record");
      }
    }
  );
};

interface verifySku {
  sku: string;
  brand_id: string;
}

interface verficationApiResponse {
  is_exists: boolean;
}

export const useVerifySku = () => {
  return useMutation<verficationApiResponse, Error, verifySku>(
    async (payload: verifySku) => {
      const response = await fetch(`${API_URL}/verify_sku/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Sku already exist.");
      }

      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(["verify_sku"]);
      },
      onError: () => {
        toast.error("Error in verifying sku.");
      }
    }
  );
};

interface verifyBarcode {
  barcode: string;
  brand_id: string;
}

interface barcodeVerfiyResponse {
  is_exists: boolean;
}

export const useVerfiyBarcode = () => {
  // const queryClient = useQueryClient();
  return useMutation<barcodeVerfiyResponse, Error, verifyBarcode>(
    async (payload: verifyBarcode) => {
      const response = await fetch(`${API_URL}/verify_barcode/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Barcode already exist.");
      }

      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(["verify_barcode"]);
      },
      onError: () => {
        toast.error("Error in verifying barcode.");
      }
    }
  );
};
