import { useMutation, useQuery, useQueryClient } from "react-query";
import { API_URL, getAccessToken } from "./api";
import { queryStringify } from "Utils/queryString";
import { toast } from "react-toastify";
import { showError, showSuccess } from "Components/Toaster";
import { useBrand } from "Context/BrandContext";

interface IWarningResponse {
  id: string;
  warning: string;
  message: string;
  warnNumber: string;
  warningNumber: string;
}

export const useWarningMessages = (searchParams: URLSearchParams) => {
  const { activeBrand } = useBrand();

  return useQuery<IWarningResponse[], Error>(
    ["getAllWarningMessages", searchParams.toString()],
    async () => {
      const response = await fetch(
        `${API_URL}/warning-message/${queryStringify({
          sorting: "-created",
          brand_id: activeBrand
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
interface WarningBody {
  id?: string;
  brand_id: string;
  message?: string;
  warningNumber: string;
}
export const useAddWarning = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, WarningBody>(
    "add-warning-message",

    async variables => {
      const response = await fetch(`${API_URL}/warning-message/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(variables)
      });
      if (!response.ok) {
        const errorMessage = await response.json();

        toast.error(`${errorMessage.error}`);
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("getAllWarningMessages");
        toast.success("Warning Added successfully.");
      }
    }
  );
};

export const useTrashWarning = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { id: string }>(
    async variables => {
      "delete-warning-message";
      const response = await fetch(`${API_URL}/warning-message/${variables.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error("Error deleting Warning.");
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getAllWarningMessages"]);
        toast.success("Warning trashed successfully");
      },
      onError: error => {
        toast.error(error.message);
      }
    }
  );
};

export const useEditWarning = () => {
  const queryClient = useQueryClient();

  return useMutation<any, Error, WarningBody>(
    ["edit-warning-message"],
    async (variables: WarningBody) => {
      const warningID = variables.id;
      delete variables.id;
      const response = await fetch(`${API_URL}/warning-message/${warningID}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({ ...variables })
      });
      if (!response.ok) {
        throw new Error("Error in Updating Warning");
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getAllWarningMessages"]);
        showSuccess("Warning Number Updated Successfully");
      },
      onError: () => showError("Error in Updating Warning")
    }
  );
};

interface IWarningMessageByProduct {
  id: string;
  created: string;
  updated: string | null;
  product_id: string;
  warning_id: string;
  warning_message: string;
}

export const useWarningMessageByID = (
  productID: string,
  searchParams: URLSearchParams
) => {
  return useQuery<IWarningMessageByProduct, Error>(
    ["getWarningByProductID", productID, searchParams.toString()],
    async () => {
      if (!productID) {
        return;
      }
      const response = await fetch(`${API_URL}/warning-message-of-product/${productID}`, {
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
