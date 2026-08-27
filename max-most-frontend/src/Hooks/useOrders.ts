import { useQuery, useMutation, UseQueryResult, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { API_URL, getAccessToken, getBrandId } from "./api";
import { QueryPagination } from "../Interfaces/global";
import { orderCompanyParamKeys, orderParamsGeneralKeys } from "../Utils/queryParamKeys";
import {
  AddLineItemBody,
  FetchOrderProductBatchExpiry,
  ListItemResponse,
  OrderData,
  OrderNote,
  OrderProduct,
  OrderProductShipping,
  OrderResponse,
  OrderShipmentResponse,
  ResponseOrderBatch,
  UpdateDirection
} from "../Interfaces/Orders";
import { queryStringify } from "../Utils/queryString";
import { useNavigate } from "react-router-dom";

import { IReturnInfo } from "../Interfaces/ShippingReturn";
import { AddCustomerResponse } from "@interfaces/ordersType";

/**
 * @interface BatchDetails
 * @property {string} batch_number - The batch number of the product.
 * @property {string} expiry_date - The expiry date of the product.
 * @property {number} quantity_sold - The quantity sold.
 */

/**
 * @interface OrderProduct
 * @property {boolean} is_pom - Whether the product is a prescription-only medicine.
 * @property {boolean} is_fully_shipped - Whether the product is fully shipped.
 * @property {string} [ship_date] - The ship date.
 * @property {number} [tax_rate] - The tax rate.
 * @property {number} [sub_total_tax] - The subtotal tax.
 * @property {number} total_cost - The total cost.
 * @property {number} [taxes] - The taxes.
 * @property {string} id - The unique identifier for the product.
 * @property {number} quantity - The quantity of the product.
 * @property {number} shipped_quantity - The shipped quantity.
 * @property {string} product_id - The product ID.
 * @property {boolean} [was_returned] - Whether the product was returned.
 * @property {number} unit_price - The unit price.
 * @property {number} [shipping_cost] - The shipping cost.
 * @property {number} [sub_total] - The subtotal.
 * @property {OrderProductReturn[]} order_product_return - The order product return details.
 * @property {string} [sku] - The SKU of the product.
 * @property {ProductData} [product] - The product data.
 * @property {boolean} [was_refunded] - Whether the product was refunded.
 * @property {string} [direction] - The direction.
 * @property {string} [patient_name] - The name of the patient.
 * @property {number} [quantity_per_pack] - The quantity per pack.
 * @property {string} prescription_id - The prescription ID.
 * @property {string} website_patient_id - The website patient ID.
 * @property {BatchDetails[]} batch_details - The batch details.
 * @property {Object} return_shipment - The return shipment details.
 * @property {number} return_shipment.id - The ID of the return shipment.
 * @property {string} return_shipment.created - The creation date.
 * @property {string} return_shipment.updated - The update date.
 * @property {string | null} return_shipment.carrier - The carrier.
 * @property {string | null} return_shipment.cost - The cost.
 * @property {string | null} return_shipment.description - The description.
 * @property {string | null} return_shipment.delivery_speed - The delivery speed.
 * @property {string | null} return_shipment.weight - The weight.
 * @property {string | null} return_shipment.dimension_width - The dimension width.
 * @property {string | null} return_shipment.dimension_height - The dimension height.
 * @property {string | null} return_shipment.dimension_length - The dimension length.
 * @property {number} return_shipment.quantity - The quantity.
 */

/**
 * @interface OrderProductReturn
 * @property {string | undefined} id - The unique identifier for the return.
 * @property {string} brand_id - The brand ID associated with the return.
 * @property {string} company_id - The company ID associated with the return.
 * @property {string} created - The creation date of the return.
 * @property {string} ordered_product_id - The ordered product ID.
 * @property {string} product_id - The product ID.
 * @property {OrderProductReturnShipment} return_shipment - The return shipment details.
 * @property {string} shipping_class_id - The shipping class ID.
 * @property {string} user_id - The user ID.
 */

/**
 * @interface OrderNote
 * @property {string} type - The type of the note.
 * @property {string} [updated] - The update date of the note.
 * @property {string} created - The creation date of the note.
 * @property {string} id - The unique identifier for the note.
 * @property {string} text - The text of the note.
 * @property {string} [source] - The source of the note.
 * @property {string} [note_username] - The username associated with the note.
 */

/**
 * @interface OrderNoteResponse
 * @property {OrderNote[]} results - The array of order notes.
 * @property {number} page - The current page number.
 * @property {number} count - The number of items per page.
 * @property {number} total - The total number of items.
 * @property {number} pages - The total number of pages.
 */

/**
 * @interface PaymentData
 * @property {string} type - The type of the payment.
 * @property {boolean} recurring - Whether the payment is recurring.
 * @property {string} receipt - The receipt for the payment.
 * @property {boolean} non_recurring - Whether the payment is non-recurring.
 * @property {number} pending_refund - The amount pending refund.
 * @property {string} created - The creation date of the payment.
 * @property {number} total - The total amount of the payment.
 * @property {boolean} is_refunded - Whether the payment has been refunded.
 * @property {string} id - The unique identifier for the payment.
 * @property {string} status - The status of the payment.
 * @property {string} updated - The update date of the payment.
 * @property {string} payment_provider - The payment provider.
 * @property {string} order_id - The associated order ID.
 * @property {PaymentMethod} payment_method - The payment method details.
 * @property {Object} user - The user details.
 * @property {string} user.created - The creation date of the user.
 * @property {string} user.date_joined - The date the user joined.
 * @property {string} user.email - The email of the user.
 * @property {string} user.first_name - The first name of the user.
 * @property {string} user.id - The unique identifier for the user.
 * @property {boolean} user.is_active - Whether the user is active.
 * @property {boolean} user.is_staff - Whether the user is a staff member.
 * @property {boolean} user.is_superuser - Whether the user is a superuser.
 * @property {string} user.last_login - The last login date of the user.
 * @property {string} user.last_name - The last name of the user.
 * @property {string} user.middle_name - The middle name of the user.
 * @property {string} user.mobile_phone - The mobile phone number of the user.
 * @property {string} user.office_phone - The office phone number of the user.
 * @property {string} user.type - The type of the user.
 * @property {string} user.updated - The update date of the user.
 * @property {string} user.username - The username of the user.
 */

/**
 * @interface OrderCategory
 * @property {"order" | "standing" | "quote"} - The category of the order.
 */

/**
 * @interface PaymentMethod
 * @property {string} id - The unique identifier for the payment method.
 * @property {string} created - The creation date of the payment method.
 * @property {string} updated - The update date of the payment method.
 * @property {string} name - The name of the payment method.
 * @property {string} description - The description of the payment method.
 * @property {boolean} is_active - Whether the payment method is active.
 * @property {boolean} is_trash - Whether the payment method is marked as trash.
 */

/**
 * @interface IReturnInfo
 * @property {string} id - The ID of the return.
 * @property {string} order_id - The ID of the order to which the return belongs.
 * @property {string} ordered_product_id - The ID of the ordered product being returned.
 * @property {number} returned_quantity - The quantity of the product being returned.
 * @property {string} created_at - The timestamp when the return was created.
 */
/**
 * @interface UpdateOrderReturnVariables
 * @property {number} quantity - The updated quantity of the product being returned.
 * @property {string} ordered_product_id - The ID of the ordered product being returned.
 * @property {string} [return_id] - The ID of the return record to be updated.
 */
/**
 * @interface OrderData
 * @property {string} id - The unique identifier for the order.
 * @property {string} company_id - The company ID associated with the order.
 * @property {CompanyData} company - The company data.
 * @property {OrderCategory} category - The category of the order.
 * @property {string} brand_id - The brand ID.
 * @property {string} created - The creation date of the order.
 * @property {string} contact_id - The contact ID.
 * @property {string} [ship_date] - The ship date.
 * @property {string} currency - The currency used in the order.
 * @property {null} discount_tax - The discount tax.
 * @property {null} customer_ip_addr - The customer IP address.
 * @property {null} prices_include_tax - Whether the prices include tax.
 * @property {string} updated - The update date of the order.
 * @property {null} cart_tax - The cart tax.
 * @property {boolean} has_custom_tax_rate - Whether the order has a custom tax rate.
 * @property {number} custom_tax_percentage - The custom tax percentage.
 * @property {number} sales_tax - The sales tax.
 * @property {number} shipping_cost - The shipping cost.
 * @property {null} discount_total - The discount total.
 * @property {string} status - The status of the order.
 * @property {number} total_amount - The total amount of the order.
 * @property {null} customer_user_agent - The customer user agent.
 * @property {boolean} is_trash - Whether the order is marked as trash.
 * @property {string} number - The order number.
 * @property {OrderRefund[]} order_refunds - The order refunds.
 * @property {OrderProduct[]} [products] - The order products.
 * @property {OrderProductShipping[]} product_shippings - The product shippings.
 * @property {OrderNote[]} [notes] - The order notes.
 * @property {number} due_amount - The due amount.
 * @property {string} [company_name] - The company name.
 * @property {number} recurring_payment - The recurring payment amount.
 * @property {number} non_recurring_payment - The non-recurring payment amount.
 * @property {number} sub_total - The subtotal amount.
 * @property {number} [paid_amount] - The paid amount.
 * @property {string} source - The source of the order.
 * @property {boolean} is_custom_shipping - Whether the shipping is custom.
 * @property {string} ordered - The date the order was placed.
 * @property {PaymentData[]} payments - The payment data.
 * @property {boolean} is_standing_order - Whether the order is a standing order.
 * @property {string} [payment_status] - The payment status.
 * @property {number} return_amount - The return amount.
 * @property {string} [shipping_status] - The shipping status.
 * @property {Address} billing_address - The billing address.
 * @property {Address} shipping_address - The shipping address.
 * @property {string} [billing_address_first_name] - The first name for the billing address.
 * @property {string} [billing_address_last_name] - The last name for the billing address.
 * @property {string} [shipping_address_first_name] - The first name for the shipping address.
 * @property {string} [shipping_address_last_name] - The last name for the shipping address.
 * @property {number} [quantity] - The quantity.
 * @property {number | null} number_of_order_items - The number of order items.
 * @property {number} [website_order_id] - The website order ID.
 * @property {Object} website - The website details.
 * @property {string} website.id - The unique identifier for the website.
 * @property {string} website.created - The creation date of the website.
 * @property {string} website.updated - The update date of the website.
 * @property {string} website.title - The title of the website.
 * @property {string} website.site_url - The URL of the website.
 * @property {string} website.authorization_key - The authorization key for the website.
 * @property {string} website.brand_id - The brand ID associated with the website.
 * @property {string} website.prescription - The prescription details.
 * @property {string} website.label_template - The label template.
 * @property {number} [prescription_ids] - The prescription IDs.
 * @property {string} [website_authorization] - The website authorization.
 * @property {number} insurance_fee - The insurance fee.
 * @property {string} website_name - The name of the website.
 * @property {string} [website_url] - The URL of the website.
 * @property {string} [website_authorization_key] - The website authorization key.
 * @property {boolean} packing_slip_print - Whether the packing slip is printed.
 * @property {boolean} invoice_print - Whether the invoice is printed.
 * @property {string} quickbook_reference_number - The QuickBooks reference number.
 */

/**
 * @interface IsOpenStatus
 * @property {string} website_authorization - The website authorization.
 * @property {string} website - The website.
 * @property {string} website_order_id - The website order ID.
 */

/**
 * @interface EditOrderProductShippingVariables
 * @property {number} quantity
 * @property {string} ordered_product_id
 * @property {string} id
 *
 */

/**
 * @interface PatientData
 * @property {string} id - The unique identifier for the patient.
 * @property {string} name - The name of the patient.
 * @property {string} date_of_birth - The date of birth of the patient.
 * @property {string} address - The address of the patient.
 * @property {string} prescriber - The prescriber.
 * @property {string} prescriber_email - The email of the prescriber.
 * @property {string} prescriber_phone - The phone number of the prescriber.
 */

/**
 * @interface OrderShipmentResponse
 * @property {string} ship_date - The ship date.
 * @property {number} quantity - The quantity of the order.
 * @property {string} ordered_product_id - The ordered product ID.
 * @property {string} id - The unique identifier for the shipment.
 */

/**
 * @interface OrderResponse
 * @property {OrderData[]} results - The array of order data.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface HistoryData
 * @property {string} created_by - The user who created the history.
 * @property {string} direction - The direction of the history.
 * @property {number} discount_amount - The discount amount.
 * @property {string} name - The name associated with the history.
 * @property {string} prescriber - The prescriber.
 * @property {number} price - The price of the item.
 * @property {number} quantity - The quantity.
 * @property {string} sku - The SKU of the product.
 * @property {number} subtotal - The subtotal amount.
 * @property {number} total - The total amount.
 * @property {string} website_order_date - The date of the website order.
 * @property {number} website_order_id - The website order ID.
 * @property {number} website_prescription_id - The website prescription ID.
 */

/**
 * @interface HistoryResponse
 * @property {HistoryData[]} results - The array of history data.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * Represents variables used for editing an order.
 * @interface EditOrderVariables
 * @property {string} source - The unique identifier for the order.
 * @property {number} [shipping_cost] - The shipping cost of the order.
 * @property {boolean} [is_standing_order] - Indicates if the order is a standing order.
 * @property {string} [category] - The category of the order.
 * @property {number} [tax_rate] - The tax rate applied to the order.
 * @property {string} [company_id] - The ID of the company associated with the order.
 * @property {string} [contact_id] - The ID of the contact associated with the order.
 * @property {string} [status] - The current status of the order.
 * @property {string} [quickbook_reference_number] - The QuickBooks reference number for the order.
 */

/**
 * @interface PateintResponse
 * @property {PatientData[]} results - The array of patient data.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface OrderProductShipping
 * @property {number} shipped_quantity - The shipped quantity.
 * @property {string} id - The unique identifier for the shipping.
 * @property {string} created - The creation date of the shipping.
 * @property {string} [updated] - The update date of the shipping.
 * @property {string} [ship_date] - The ship date.
 * @property {string} [carrier] - The carrier.
 * @property {string} [tracking] - The tracking number.
 * @property {number} [weight] - The weight of the shipment.
 * @property {string} [shipping_type] - The shipping type.
 * @property {string} ordered_product_id - The ordered product ID.
 * @property {number} [total] - The total amount of the shipping.
 * @property {number} [total_tax] - The total tax.
 * @property {number} quantity - The quantity.
 * @property {number} [returned_quantity] - The returned quantity.
 * @property {number} [total_quantity] - The total quantity.
 */

/**
 * @interface UpdateDirection
 * @property {string} [direction] - The direction to update.
 * @property {string} [productOrderID] - The product order ID.
 */

/**
 * @interface BarcodeScaning
 * @property {string} [direction]
 */

/**
 * @interface AddOrderReturnVariables
 * @property {number} quantity
 * @property {string} ordered_product_id
 *
 */
/**
 * @interface OrderProductReturnShipmentResponse
 * @property {OrderProductReturnShipment[]} results - The array of return shipment details.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface OrderProductReturnShipment
 * @property {string} description - The description of the return shipment.
 * @property {number} dimension_length - The length of the dimension.
 * @property {number} weight - The weight of the return shipment.
 * @property {string} carrier - The carrier of the shipment.
 * @property {number} delivery_speed - The delivery speed.
 * @property {number} dimension_width - The width of the dimension.
 * @property {number} dimension_height - The height of the dimension.
 * @property {number} cost - The cost of the return shipment.
 * @property {number} quantity - The quantity of the return shipment.
 */

/**
 * @interface OrderRefundResponse
 * @property {OrderRefund[]} results - The array of order refunds.
 * @property {number} [page] - The current page number.
 * @property {number} [count] - The number of items per page.
 * @property {number} [total] - The total number of items.
 * @property {number} [pages] - The total number of pages.
 */

/**
 * @interface OrderRefund
 * @property {string} user_id - The user ID associated with the refund.
 * @property {string} brand_id - The brand ID associated with the refund.
 * @property {string} company_id - The company ID associated with the refund.
 * @property {number} total - The total refund amount.
 * @property {string} order_id - The associated order ID.
 * @property {string} created - The creation date of the refund.
 * @property {string} updated - The update date of the refund.
 * @property {string} id - The unique identifier for the refund.
 * @property {number} quantity - The quantity refunded.
 * @property {string} reason - The reason for the refund.
 * @property {string} [prescription_id] - The prescription ID.
 * @property {string} [status] - The status of the refund.
 * @property {string} [description] - The description of the refund.
 */

/**
 * Represents the request body for creating an order.
 *
 * @property company_id - The ID of the company associated with the order.
 * @property brand_id - The ID of the brand associated with the order.
 * @property contact_id - The ID of the contact associated with the order.
 * @property website_id - The ID of the website associated with the order.
 * @property number_of_order_items - The number of items in the order. Optional.
 */
/**
 * @interface OrderRequest
 * @property {string} company_id - The ID of the company associated with the order.
 * @property {string} brand_id - The ID of the brand associated with the order.
 * @property {string} contact_id - The ID of the contact associated with the order.
 * @property {string} website_id - The ID of the website associated with the order.
 * @property {number} number_of_order_items - The number of items in the order.
 *
 */

/**
 *
 */
/**
 * Custom hook to fetch products with optional search and filter parameters.
 *
 * @param {URLSearchParams} [searchParams] - Optional search parameters to filter and paginate the Orders.
 *   - `count` (number): Number of Orders per page (default: 50).
 *   - `page` (number): Page number to retrieve (default: 1).
 *   - `Website Order id` (string): the key of the website order is website_order_id.
 *   - `Order number` (string): the key of the Order number is order_number.
 *   - `Customer name` (string): the key of the Customer name is company_name.
 *   - `Website` (string): the key of the Website is website_id.
 *   - `Status` (string): the key of the Status is status.
 *   - `Shipment Status :` (string): the key of the Shipment Status :
 *   - `Count` (string): the key of the Payment Status is count.
 *
 *
 * @param {boolean} [is_trash] - Flag indicating whether to fetch trashed Orders (`true`) or active Orders (`false`).
 *
 * @returns {UseQueryResult<ProductsResponse, Error>} The query result containing the fetched Orders and metadata.
 *
 * @see {@link ProductsResponse} - Type representing the structure of the response data.
 * @see {@link ProductData} - Type representing individual product details.
 */

export const useOrders = (
  searchParams: URLSearchParams,
  is_trash: boolean = false
): UseQueryResult<OrderResponse, Error> => {
  const pagination: Partial<QueryPagination> = {
    count: searchParams.get("count") || "50",
    page: searchParams.get("page") || "1"
  };
  // testing commit
  const companyParams: Record<string, string> = {};
  const billingShippingParams: Record<string, string> = {};
  const generalParams: Record<string, string> = {
    ...getBrandId(),
    ...(is_trash ? { is_trash: "True" } : { is_trash: "False" })
  };

  orderParamsGeneralKeys.forEach(key => {
    if (searchParams.has(key)) {
      generalParams[key] = searchParams.get(key) as string;
    }
  });

  orderCompanyParamKeys.forEach(key => {
    if (searchParams.has(key)) {
      companyParams[key] = searchParams.get(key) as string;
    }
  });

  return useQuery<OrderResponse, Error>(["orders", searchParams.toString()], async () => {
    if (!getBrandId().brand_id) {
      throw new Error("Active brand is not available.");
    }
    const response = await fetch(
      `${API_URL}/orders/list/${queryStringify({
        ...pagination,
        ...generalParams,
        ...billingShippingParams,
        ...companyParams,
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
  });
};

export const useOrder = (id?: string): UseQueryResult<OrderData, Error> => {
  return useQuery<OrderData, Error>(
    ["orders", id],
    async () => {
      if (!id) {
        return;
      }
      const response = await fetch(`${API_URL}/custom_order_raw/${id}/`, {
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
      enabled: !!id,
      staleTime: 60000 // 1 minute, adjust this value as needed
    }
  );
};
/**
 * Custom hook to fetch order data by ID.
 *
 * This hook uses react-query's useQuery to fetch order data from the API.
 * It sends a GET request to the `/custom_order_raw/:id/` endpoint with the provided order ID.
 * If the order ID is not provided, the query is disabled.
 *
 * @param {string} [id] - The ID of the order to fetch.
 * @returns {UseQueryResult<OrderData, Error>} The query result containing the order data or an error.
 *
 * @example
 * // Usage in a component
 * const { data: order, isLoading, isError } = useOrder("order-id-123");
 *
 * if (isLoading) {
 *   return <div>Loading...</div>;
 * }
 *
 * if (isError) {
 *   return <div>Error loading order</div>;
 * }
 *
 * return <div>Order ID: {order.id}</div>;
 *
 * @see {@link OrderData} - Type representing the structure of the order data.
 * @see {@link OrderRequest} - Type representing the structure of the request data.
 */
interface OrderRequest {
  readonly company_id: string;
  readonly brand_id: string;
  readonly contact_id: string;
  readonly website_id: string;
  readonly number_of_order_items?: number;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, OrderRequest>(
    "create-order",
    async (variables: OrderRequest) => {
      const response = await fetch(`${API_URL}/order/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in creating order.");
      }
      const parsedResponse = await response.json();
      localStorage.setItem("current_order", parsedResponse?.id);
      return parsedResponse;
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(["current_order", data?.id]);
        localStorage.setItem("current_order", data.id);
      },
      onError: () => {
        toast.error(
          "Error in creating order. Customer might not have billing and shipping contacts."
        );
      }
    }
  );
};
/**
 * Custom hook to handle the mutation for creating an order.
 *
 * This hook uses react-query's useMutation to handle the creation of an order.
 * It sends a POST request to the API with the provided order details.
 * It checks the response status and throws an error if the response is not OK.
 *
 * @returns {MutationFunction<OrderData, Error, OrderRequest>} A mutation function that can be used to create a new order.
 *
 * @example
 * // Usage in a component
 * const { mutate: createOrder, isLoading, isError, data } = useCreateOrder();
 *
 * const handleCreateOrder = (orderDetails: OrderRequest) => {
 *   createOrder(orderDetails);
 * };
 *
 * @see OrderData
 * @see OrderRequest
 */

export const useEditOrder = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    OrderData,
    Error,
    {
      source?: string;
      shipping_cost?: number;
      is_standing_order?: boolean;
      category?: string;
      tax_rate?: number;
      company_id?: string;
      contact_id?: string;
      status?: string;
      quickbook_reference_number?: string;
      is_prescription_opened?: boolean;
    }
  >(
    async variables => {
      if (!id) {
        return;
      }
      const response = await fetch(`${API_URL}/order/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in adding products in order.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Order Edited Successfully");
        queryClient.invalidateQueries(["orders", id]);
      },
      onError: () => {
        toast.error("Couldn't edit the order.");
      }
    }
  );
};

/**
 * Custom hook to edit an existing order.
 *
 * This hook uses react-query's useMutation to handle editing an order.
 * It sends a PUT request to the `/order/:id/` endpoint with the provided order details.
 * If the order ID is not provided, the mutation will not proceed.
 *
 * @param {string} id - The ID of the order to edit.
 * @returns {MutationFunction<OrderData, Error, EditOrderVariables>} A mutation function that can be used to edit the order.
 *
 * @example
 * // Usage in a component
 * const { mutate: editOrder, isLoading, isError } = useEditOrder("order-id-123");
 *
 * const handleEditOrder = (editDetails: EditOrderVariables) => {
 *   editOrder(editDetails);
 * };
 *
 * @see {@link EditOrderVariables} - Type representing the structure of the request data.
 */
export const useCreateOrderNote = (orderID?: string) => {
  const queryClient = useQueryClient();

  return useMutation<OrderNote, Error, Omit<OrderNote, "id" | "created">>(
    async variables => {
      if (!orderID) {
        return;
      }
      const response = await fetch(`${API_URL}/order/${orderID}/note/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in creating order.");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        toast.success(`A ${data.type} note has been added to the order.`);
        queryClient.invalidateQueries(["orders", orderID]);
      }
    }
  );
};

type Note = {
  created: string;
  id: string;
  id_hash: string;
  is_trash: boolean;
  note_username: string;
  source: string;
  text: string;
  type: string;
  updated: string | null;
};

/**
 * Custom hook to create a new note for an order.
 *
 * This hook uses react-query's useMutation to handle creating a note for an order.
 * It sends a POST request to the `/order/:orderID/note/` endpoint with the provided note details.
 * If the order ID is not provided, the mutation will not proceed.
 *
 * @param {string} [orderID] - The ID of the order to add a note to.
 * @returns {MutationFunction<OrderNote, Error, Omit<OrderNote, "id" | "created">>} A mutation function that can be used to create a new order note.
 *
 * @example
 * // Usage in a component
 * const { mutate: createOrderNote, isLoading, isError } = useCreateOrderNote("order-id-123");
 *
 * const handleCreateOrderNote = (noteDetails: Omit<OrderNote, "id" | "created">) => {
 *   createOrderNote(noteDetails);
 * };
 *
 * @see {@link OrderNote} - Type representing the structure of the note data.
 */
export const useGetBatchAndExpiry = () => {
  return useMutation<ResponseOrderBatch[], Error, FetchOrderProductBatchExpiry>(
    async variables => {
      const response = await fetch(`${API_URL}/ordered_product_batch_details`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in Getting Batch and Expiry ");
      }
      return response.json();
    }
  );
};

/**
 * This hook is used to update batch and expiry details for ordered products.
 *
 * It returns a mutation function that can be used to update batch and expiry details.
 *
 * @returns A mutation function that updates batch and expiry details.
 */
export const useUpdateBatchAndExpiry = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseOrderBatch[], Error, ResponseOrderBatch>(
    async variables => {
      const id = variables.id;
      //eslint-disable-next-line
      //@ts-ignore
      delete variables.id;
      const response = await fetch(`${API_URL}/purchase_order_receive_update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        toast.error("Error in Update Batch and Expiry ");
        throw new Error("Error in Getting Batch and Expiry ");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["orders"]);
      }
    }
  );
};

/**
 * This hook is used to add a return for an order.
 *
 * It returns a mutation function that can be used to add a return for an order.
 *
 * @param orderId The ID of the order for which the return is being added.
 * @returns A mutation function that adds a return for an order.
 */
export const useAddOrderReturn = (orderId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    IReturnInfo,
    Error,
    { quantity: number | undefined; ordered_product_id: string }
  >(
    ["create-order-return", orderId],
    async variables => {
      const response = await fetch(
        `${API_URL}/order/${orderId}/return/${variables.ordered_product_id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({ quantity: variables.quantity })
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Return added successfully");
        queryClient.invalidateQueries(["orders", orderId]);
      },
      onError: error => {
        toast.error(error?.message);
      }
    }
  );
};

/**
 * Custom hook to add a return to an order.
 *
 * This hook uses react-query's useMutation to handle adding a return to an order.
 * It sends a POST request to the `/order/:orderId/return/:ordered_product_id/` endpoint with the provided return details.
 *
 * @param {string} orderId - The ID of the order to which the return is being added.
 * @returns {MutationFunction<IReturnInfo, Error, AddOrderReturnVariables>} A mutation function that can be used to add a return to the order.
 *
 * @example
 * // Usage in a component
 * const { mutate: addOrderReturn, isLoading, isError } = useAddOrderReturn("order-id-123");
 *
 * const handleAddOrderReturn = (returnDetails: AddOrderReturnVariables) => {
 *   addOrderReturn(returnDetails);
 * };
 * @see AddOrderReturnVariables
 */
export const useUpdateOrderReturn = (orderId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    IReturnInfo,
    Error,
    { quantity: number; ordered_product_id: string; return_id?: string }
  >(
    ["update-order-return", orderId],
    async variables => {
      const response = await fetch(
        `${API_URL}/order/${orderId}/return/${variables.ordered_product_id}/${variables.return_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify({ quantity: variables.quantity })
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Return updated successfully");
        queryClient.invalidateQueries(["orders", orderId]);
      },
      onError: () => {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  );
};

/**
 * Custom hook to update a return in an order.
 *
 * This hook uses react-query's useMutation to handle updating a return in an order.
 * It sends a PUT request to the `/order/:orderId/return/:ordered_product_id/:return_id` endpoint with the provided return details.
 *
 * @param {string} orderId - The ID of the order to which the return is being updated.
 * @returns {MutationFunction<IReturnInfo, Error, UpdateOrderReturnVariables>} A mutation function that can be used to update a return in the order.
 *
 * @example
 * // Usage in a component
 * const { mutate: updateOrderReturn, isLoading, isError } = useUpdateOrderReturn("order-id-123");
 *
 * const handleUpdateOrderReturn = (returnDetails: UpdateOrderReturnVariables) => {
 *   updateOrderReturn(returnDetails);
 * };
 * @see IReturnInfo
 * @see UpdateOrderReturnVariables
 *
 */
export const useAddOrderShipment = (orderId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    OrderShipmentResponse,
    Error,
    Omit<OrderProductShipping, "id" | "created">
  >(
    ["create-order-shipment", orderId],
    async variables => {
      delete variables["total_quantity"];
      delete variables["returned_quantity"];

      const response = await fetch(`${API_URL}/order/${orderId}/shipping/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Shipment added successfully");
        queryClient.invalidateQueries(["orders", orderId]);
      },
      onError: () => {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  );
};

/**
 * Custom hook to add a shipment to an order.
 *
 * This hook uses react-query's useMutation to handle adding a shipment to an order.
 * It sends a POST request to the `/order/:orderId/shipping/` endpoint with the provided shipment details.
 * Certain properties (`total_quantity` and `returned_quantity`) are removed from the request body before sending.
 *
 * @param {string} orderId - The ID of the order to add the shipment to.
 * @returns {MutationFunction<OrderShipmentResponse, Error, Omit<OrderProductShipping, "id" | "created">>} A mutation function that can be used to add a shipment to the order.
 *
 * @example
 * // Usage in a component
 * const { mutate: addOrderShipment, isLoading, isError } = useAddOrderShipment("order-id-123");
 *
 * const handleAddOrderShipment = (shipmentDetails: Omit<OrderProductShipping, "id" | "created">) => {
 *   addOrderShipment(shipmentDetails);
 * };
 *
 * @see {@link OrderProductShipping} - Type representing the structure of the request body.
 */
export const useEditOrderProductShipping = (orderId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    OrderProductShipping,
    Error,
    {
      ordered_product_id: string;
      quantity?: number;
      ship_date?: string;
      id?: string;
    }
  >(
    async variables => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = variables;
      const response = await fetch(
        `${API_URL}/order/${orderId}/shipping/${variables.id}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(rest)
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data?.message);
        throw new Error(data?.message);
      } else {
        toast.success(data?.message);
      }

      return data;
    },
    {
      onSuccess: async data => {
        toast.success("Order's product's shipping edited successfully");
        queryClient.invalidateQueries(["orders"]);
        queryClient.invalidateQueries(["order-shipments", orderId]);

        return data;
      }
    }
  );
};
/**
 * Custom hook to edit the shipping details of a product in an order.
 *
 * This hook uses react-query's useMutation to handle editing the shipping details of a product in an order.
 * It sends a PUT request to the `/order/:orderId/shipping/:id/` endpoint with the provided shipping details.
 *
 * @param {string} id - The ID of the order to edit the product shipping details for.
 * @returns {MutationFunction<OrderProductShipping, Error, EditOrderProductShippingVariables>} A mutation function that can be used to edit the shipping details of a product in the order.
 *
 * @example
 * // Usage in a component
 * const { mutate: editOrderProductShipping, isLoading, isError } = useEditOrderProductShipping("order-id-123");
 *
 * const handleEditOrderProductShipping = (shippingDetails: EditOrderProductShippingVariables) => {
 *   editOrderProductShipping(shippingDetails);
 * };
 *
 * @see {@link EditOrderProductShippingVariables} - Type representing the structure of the request body.
 */
export const useTrashOrder = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { orderId?: string }>(
    async variables => {
      if (!variables.orderId) {
        return;
      }
      const response = await fetch(`${API_URL}/order/${id ? id : variables.orderId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Error in deleting order.");
      }
    },
    {
      onSuccess: () => {
        toast.success("Order trashed successfully");
        queryClient.invalidateQueries("orders");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

/**
 * This hook is used to restore an order. It sends a POST request to the server to restore the order.
 *
 * @returns A mutation function that restores an order.
 */
export const useRestoreOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { orderId?: string }>(
    "order-restoration",
    async variables => {
      if (!variables?.orderId) {
        return;
      }
      const response = await fetch(`${API_URL}/order/${variables.orderId}/restore/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: "{}"
      });
      if (!response.ok) {
        throw new Error("Error in restoring order.");
      }
      return response.json();
    },
    {
      onError: () => {
        toast.error("An Error occured while restoring order.");
      },
      onSuccess: () => {
        toast.success("Order restored successfully.");
        queryClient.invalidateQueries(["orders"]);
      }
    }
  );
};
/**
 * This hook is used to update the direction of an order's product. It sends a POST request to the server to update the direction.
 *
 * @returns A mutation function that updates the direction of an order's product.
 */
export const useUpdateDirection = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateDirection,
    Error,
    {
      productOrderID?: string;
      direction?: string | undefined;
    }
  >(
    async variables => {
      const { productOrderID } = variables;
      const withoutId = { ...variables };
      delete withoutId.productOrderID;

      const response = await fetch(`${API_URL}/order/${productOrderID}/directions/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(withoutId)
      });
      if (!response.ok) {
        throw new Error("Error editing order's product's direction.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Order's product's direction edited successfully");
        queryClient.invalidateQueries(["orders"]);

        // Access the response data here and do something with it
      },
      onError: () => {
        toast.error("Couldn't edit the order's product's direction.");
      }
    }
  );
};

/**
 * Interface for a selector option.
 * @property {string} label - The label of the selector option.
 * @property {string} value - The value of the selector option.
 */
export interface ISelector {
  label: string;
  value: string;
}

/**
 * Interface for service and product details.
 * @property {ISelector[]} network - Array of network selector options.
 * @property {ISelector[]} product - Array of product selector options.
 * @property {ISelector[]} service - Array of service selector options.
 * @property {number} shipmentId - The ID of the shipment.
 * @property {string} tracking_link - The tracking link for the shipment.
 * @property {string} parcelNumbers - The parcel numbers for the shipment.
 * @property {string} delivery_instruction - The delivery instructions for the shipment.
 */
export interface IServiceAndProduct {
  network: ISelector[];
  product: ISelector[];
  service: ISelector[];
  shipmentId: number;
  tracking_link: string;
  parcelNumbers: string;
  delivery_instruction: string;
}

/**
 * Hook to fetch service and product details for an order.
 *
 * @param {number | undefined} order_id - The ID of the order.
 * @param {string | undefined} authorization - The authorization token.
 * @param {string | undefined} website - The website URL.
 * @returns {QueryResult<IServiceAndProduct, Error>} The result of the query.
 */
export const useServiceAndProductSelect = (
  order_id: number | undefined,
  authorization: string | undefined,
  website: string | undefined
) => {
  return useQuery<IServiceAndProduct, Error>(
    ["serviceAndProduct", order_id, authorization],
    async () => {
      if (!order_id || !authorization || !website) {
        return []; // Return an empty array or handle this case accordingly.
      }

      const response = await fetch(
        `${website}/wp-json/inventory/v1/dpd_status?order_id=${order_id}`,
        {
          method: "GET",
          headers: {
            Authorization: authorization
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

interface BarcodeScaning {
  barcode: string;
}
/**
 * Hook to handle barcode scanning for an order.
 *
 * This hook sends a POST request to the server to process the barcode scanning for a given order ID.
 * It uses the `useMutation` hook from `react-query` to handle the mutation and caching.
 *
 * @param {string} orderId - The ID of the order.
 * @returns {UseMutationResult<OrderData, Error>} The result of the mutation.
 */
export const useBarcodeScaning = (orderId: string) => {
  const queryClient = useQueryClient();

  return useMutation<OrderData, Error, BarcodeScaning>(
    "barcode-scaning",
    async (variables: BarcodeScaning) => {
      const response = await fetch(`${API_URL}/order/${orderId}/shipping-by-barcode/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Product Added successfully");
        queryClient.invalidateQueries(["orders"]);
      } else {
        toast.error(data.error || "Failed to add product");
        throw new Error(data.error || "Failed to add product");
      }
      return data;
    }
  );
};

/**
 * Custom hook to handle barcode scanning for adding products to an order's shipment.
 *
 * This hook uses react-query's useMutation to handle adding products to an order's shipment via barcode scanning.
 * It sends a POST request to the `/order/:orderId/shipping-by-barcode/` endpoint with the provided barcode scanning details.
 *
 * @param {string} orderId - The ID of the order to which the product is being added via barcode scanning.
 * @returns {MutationFunction<OrderData, Error, BarcodeScaning>} A mutation function that can be used to add products to an order's shipment via barcode scanning.
 *
 * @example
 * // Usage in a component
 * const { mutate: scanBarcode, isLoading, isError } = useBarcodeScaning("order-id-123");
 *
 * const handleScanBarcode = (scanDetails: BarcodeScaning) => {
 *   scanBarcode(scanDetails);
 * };
 *
 * @see {@link BarcodeScaning} - Type representing the structure of the request body.
 */
export const useLineItems = (order_id: string) => {
  return useQuery<ListItemResponse, Error>(["line-items-listing", order_id], async () => {
    if (!order_id) {
      return [];
    }

    const response = await fetch(`${API_URL}/order/${order_id}/product/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  });
};

/**
 * Hook to add a product to an order.
 *
 * This hook sends a POST request to the server to add a product to an order.
 * It uses the `useMutation` hook from `react-query` to handle the mutation and caching.
 *
 * @returns {UseMutationResult<OrderData, Error>} The result of the mutation.
 */

export const useAddOrderProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<OrderData, Error, AddLineItemBody>(
    async (variables: AddLineItemBody) => {
      const orderId = localStorage.getItem("current_order");
      if (!orderId) {
        throw new Error("Order ID is missing.");
      }

      const response = await fetch(`${API_URL}/order/${orderId}/product/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(variables)
      });

      if (!response.ok) {
        throw new Error("Error in create order.");
      }

      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Create Order Successfully.");
        queryClient.invalidateQueries(["add-order-product"]);
      },
      onError: () => {
        toast.error("Error in Create Order.");
      }
    }
  );
};

/**
 * Hook to delete a product from an order.
 *
 * This hook sends a DELETE request to the server to delete a product from an order.
 * It uses the `useMutation` hook from `react-query` to handle the mutation and caching.
 *
 * @param {string} orderId - The ID of the order.
 * @returns {UseMutationResult<void, Error>} The result of the mutation.
 */
export const useDeleteOrderProduct = (orderId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<AddLineItemBody>>(
    async variables => {
      const response = await fetch(
        `${API_URL}/order/${orderId}/product/${variables.product_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          }
        }
      );
      if (!response.ok || response.status === 204) {
        throw new Error("Error in deleting  ordered product.");
      }
    },
    {
      onSuccess: () => {
        toast.success("Ordered product trashed successfully");
        queryClient.invalidateQueries("line-items-listing");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
/**
 * Hook to edit a product in an order.
 *
 * This hook sends a PUT request to the server to edit a product in an order.
 * It uses the `useMutation` hook from `react-query` to handle the mutation and caching.
 *
 * @param {string} orderId - The ID of the order.
 * @param {string | undefined} productId - The ID of the product to edit. If not provided, the ID from the mutation variables is used.
 * @returns {UseMutationResult<OrderData, Error>} The result of the mutation.
 */
export const useEditOrderProduct = (orderId: string, productId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation<OrderData, Error, Partial<OrderProduct>>(
    "update-order-product",
    async variables => {
      const { id = "" } = variables;
      const withoutId = { ...variables };
      delete withoutId?.id;
      delete withoutId.product_id;
      const response = await fetch(
        `${API_URL}/order/${orderId}/product/${id ? id : productId}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(withoutId)
        }
      );
      if (!response.ok) {
        throw new Error("Error in editing products in order.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Line item updated successfully.");
        queryClient.invalidateQueries(["line-items-listing"]);
      },
      onError: () => {
        toast.error("Error in Editing line item.");
      }
    }
  );
};

export const useUdpateDirection = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UpdateDirection,
    Error,
    {
      productOrderID?: string;
      direction?: string | undefined;
    }
  >(
    async variables => {
      const { productOrderID } = variables;
      const withoutId = { ...variables };
      delete withoutId.productOrderID;

      const response = await fetch(`${API_URL}/order/${productOrderID}/directions/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(withoutId)
      });
      if (!response.ok) {
        throw new Error("Error editing order's product's direction.");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Order's product's direction edited successfully");
        queryClient.invalidateQueries(["orders"]);

        // Access the response data here and do something with it
      },
      onError: () => {
        toast.error("Couldn't edit the order's product's direction.");
      }
    }
  );
};

//updateCost price

export const useUpdateOrderProductCostPrice = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Partial<OrderProduct>>(
    async variables => {
      const { order_id, ordered_product_id, ...rest } = variables;
      const response = await fetch(
        `${API_URL}/order/${ordered_product_id}/product/${order_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            "content-type": "application/json"
          },
          body: JSON.stringify(rest)
        }
      );

      if (!response.ok) {
        throw new Error("Error in updating cost price.");
      }
    },
    {
      onSuccess: () => {
        toast.success("Updated successfully");
        queryClient.invalidateQueries("line-items-listing");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useAddCustomer = () => {
  // const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    AddCustomerResponse,
    Error,
    {
      brand_id: string;
    }
  >(
    async variables => {
      const response = await fetch(`${API_URL}/company/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Customer not added successfully");
      }
      return response.json();
    },
    {
      onSuccess: data => {
        toast.success("Customer added successfully");

        // Assuming the response has an `id` field that corresponds to the newly created customer
        const customerId = data.id;
        if (customerId) {
          navigate(`/edit-customer/${customerId}`);
        }
        // Access the response data here and do something with it
      },
      onError: () => {
        toast.error("Customer not added successfully");
      }
    }
  );
};

export const useCustomerByID = (customer_id: string) => {
  return useQuery<AddCustomerResponse, Error>(
    ["customer-by-id", customer_id],
    async () => {
      if (!customer_id) {
        return [];
      }

      const response = await fetch(`${API_URL}/company/${customer_id}`, {
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

type NotesResponse = {
  count: number;
  page: number;
  pages: number;
  results: Note[];
  total: number;
};

export const useGetNotes = (id?: string): UseQueryResult<NotesResponse, Error> => {
  return useQuery<NotesResponse, Error>(
    ["notes", id],
    async () => {
      if (!id) {
        return;
      }
      const response = await fetch(`${API_URL}/company/${id}/note/`, {
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

type NotePayloadT = {
  type: string;
  text: string;
  source: string;
  note_username: string;
};

type AddNotesResponse = {
  source: string;
  is_trash: boolean;
  created: string;
  updated: null;
  id: string;
  id_hash: string;
  note_username: string;
  text: string;
  type: string;
};
export const useAddNote = () => {
  return useMutation<
    AddNotesResponse,
    Error,
    { id: string | undefined; payload: NotePayloadT }
  >(
    async ({ id, payload }) => {
      if (!id) {
        return;
      }
      console.log("Add Note Payload: ", payload);
      const response = await fetch(`${API_URL}/company/${id}/note/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("A note has been added successfully");
      },
      onError: error => {
        toast.error(`An error occurred: ${error?.message}`);
      }
    }
  );
};

type NoteEditPayloadT = { text: string };
export const useUpateNote = () => {
  return useMutation<
    Note,
    Error,
    { id: string | undefined; noteId: string | undefined; payload: NoteEditPayloadT }
  >(
    async ({ id, noteId, payload }) => {
      if (!id || !noteId) {
        return;
      }
      console.log("Edit Note Payload: ", payload);
      const response = await fetch(`${API_URL}/company/${id}/note/${noteId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Note has been updated successfully");
      },
      onError: error => {
        toast.error(`An error occurred: ${error?.message}`);
      }
    }
  );
};
export const useNoteDelete = () => {
  return useMutation<
    NotesResponse,
    Error,
    { id: string | undefined; noteId: string | undefined }
  >(
    async ({ id, noteId }) => {
      if (!id || !noteId) {
        return;
      }
      const response = await fetch(`${API_URL}/company/${id}/note/${noteId}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAccessToken()}`
        }
        // body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.status === 204) {
        return null;
      }
      return response.json();
    },
    {
      onSuccess: () => {
        toast.success("Note has been deleted successfully");
      },
      onError: error => {
        toast.error(`An error occurred: ${error?.message}`);
      }
    }
  );
};
