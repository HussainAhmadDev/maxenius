import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { QueryPagination } from "@interfaces/global";
import { API_URL, getAccessToken, getBrandId } from "./api";
import { queryStringify } from "../Utils/queryString";
import {
  MetaFieldListResponse,
  MetaFieldResponse,
  MetaFieldTypes
} from "../Interfaces/metaFieldTypes";
import { useNavigate } from "react-router-dom";

export const useCreateMetaField = (staticPath: string | undefined) => {
  return useMutation<MetaFieldTypes, Error, MetaFieldTypes>(
    "create-meta-field",
    async (variables: MetaFieldTypes) => {
      if (!staticPath) {
        return;
      }
      const response = await fetch(`${API_URL}/${staticPath}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        throw new Error("Error in creating Meta Field.");
      }
      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        toast.success("Meta field created successfully");
      },
      onError: () => {
        toast.error("Error in creating  Meta Field.");
      }
    }
  );
};

export const useGetMetaFields = (product_id: string) => {
  return useQuery<MetaFieldResponse, Error>(
    ["get-product-meta-fields", product_id],
    async () => {
      const brand_id = getBrandId().brand_id;
      if (!brand_id) {
        throw new Error("Active brand is not available.");
      }
      if (!product_id) {
        throw new Error("Product ID is required.");
      }
      console.log(
        "URL:",
        `${API_URL}/product_field_definition/?product_id=${product_id}&brand_id=${brand_id}`
      );
      const response = await fetch(
        `${API_URL}/product_field_definition/?product_id=${product_id}&brand_id=${brand_id}`,
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
    },
    {
      enabled: !!product_id
    }
  );
};
export const useMetaFieldsList = (
  brand_id: string,
  searchParams?: URLSearchParams,
  isTrash: boolean = false
) => {
  return useQuery<MetaFieldListResponse, Error>(
    ["get-all-product-meta-fields-list", searchParams?.toString(), brand_id],
    async () => {
      if (!brand_id) {
        throw new Error("Brand id is not available.");
      }
      const pagination: Partial<QueryPagination> = {
        count: searchParams?.get("count") || "20",
        page: searchParams?.get("page") || "1"
      };
      const generalParams: Record<string, string> = {
        ...(isTrash ? { is_trash: "True" } : { is_trash: "False" })
      };

      const response = await fetch(
        `${API_URL}/list_product_field_definitions/${queryStringify({
          brand_id: brand_id,
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

export const useDeleteMetaField = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { metaFieldID?: string }>(
    async variables => {
      if (!variables.metaFieldID || !id) {
        return;
      }
      const response = await fetch(`${API_URL}/product_field_definition/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error in deleting meta field.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("delete-meta-field");
        toast.success("Meta Field trashed successfully ");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};
export const useSingleMetaField = (id: string) => {
  return useQuery<MetaFieldResponse, Error>(
    ["get-single-meta-field", id],
    async () => {
      if (!id) {
        throw new Error("Meta Field ID is required.");
      }
      const response = await fetch(`${API_URL}/product_field_definition/${id}`, {
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
      enabled: !!id
    }
  );
};

interface UpdateMetaFieldResponse {
  message: string;
}

interface UpdateMetaFieldPayload {
  id: string;
  payload: {
    field_name: string;
    field_description: string;
  };
}
export const useUpdateMetaField = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation<UpdateMetaFieldResponse, Error, UpdateMetaFieldPayload>(
    async ({ id, payload }) => {
      if (!id) {
        return;
      }
      const { field_name, field_description } = payload;
      const response = await fetch(`${API_URL}/product_field_definition/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ field_name, field_description })
      });

      if (!response.ok) {
        throw new Error("Error in updating the meta field.");
      }

      const parsedResponse = await response.json();
      return parsedResponse;
    },
    {
      onSuccess: () => {
        toast.success("Meta field updated successfully.");
        queryClient.invalidateQueries(["meta_fields"]);
        navigate("/admin/meta-fields/products");
      },
      onError: () => {
        toast.error("Error in updating the meta field.");
      }
    }
  );
};
